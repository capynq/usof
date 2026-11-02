import { useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { PROFILE_SAVE_CHECK_TIMEOUT_MS } from "../../../shared/config.js";
import { authApi, sessionRestored } from "../../../features/auth/index.js";
import { getProfileValues, sameProfileValues } from "./profileDetailsForm.js";
import { PROFILE_DETAILS_MESSAGES } from "./constants.js";
import { useUpdateProfileMutation } from "../../../entities/user/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";

export const useProfileDetailsForm = (user) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [form, setForm] = useState(() => ({
    baseline: getProfileValues(user),
    values: getProfileValues(user),
    notice: null,
    busy: false,
    conflict: false,
  }));
  const [updateProfile] = useUpdateProfileMutation();
  const { values, notice, busy, conflict } = form;

  const updateField = (event) => {
    const { name, value } = event.currentTarget;
    setForm((current) => ({
      ...current,
      values: { ...current.values, [name]: value },
      notice: null,
    }));
  };

  const submit = async (reload = false) => {
    if (busy) return;
    const generation = store.getState().auth.generation;
    const isCurrent = () =>
      store.getState().auth.generation === generation && store.getState().auth.user?.id === user.id;
    setForm((current) => ({ ...current, busy: true, notice: null }));
    const request = dispatch(
      authApi.endpoints.getCurrentUser.initiate(generation, {
        subscribe: false,
        forceRefetch: true,
      }),
    );
    const timer = window.setTimeout(() => request.abort(), PROFILE_SAVE_CHECK_TIMEOUT_MS);

    try {
      const latestUser = await request.unwrap();
      window.clearTimeout(timer);
      if (!isCurrent()) return;
      const latest = getProfileValues(latestUser);

      if (reload) {
        dispatch(sessionRestored(latestUser));
        setForm({ baseline: latest, values: latest, notice: null, busy: false, conflict: false });

        return;
      }

      if (!sameProfileValues(form.baseline, latest)) {
        setForm((current) => ({
          ...current,
          conflict: true,
          notice: { type: "error", message: PROFILE_DETAILS_MESSAGES.conflict },
        }));

        return;
      }

      const updatedUser = await updateProfile({
        userId: user.id,
        body: { login: values.login.trim(), full_name: values.full_name.trim() },
      }).unwrap();
      if (!isCurrent()) return;
      dispatch(sessionRestored(updatedUser));
      const saved = getProfileValues(updatedUser);
      setForm({
        baseline: saved,
        values: saved,
        busy: false,
        conflict: false,
        notice: { type: "success", message: PROFILE_DETAILS_MESSAGES.saved },
      });
    } catch (error) {
      if (isCurrent())
        setForm((current) => ({
          ...current,
          notice: {
            type: "error",
            message: getErrorMessage(error, PROFILE_DETAILS_MESSAGES.saveFailed),
          },
        }));
    } finally {
      window.clearTimeout(timer);
      request.unsubscribe();
      if (isCurrent()) setForm((current) => ({ ...current, busy: false }));
    }
  };

  const saveProfile = (event) => {
    event.preventDefault();
    void submit();
  };

  const reloadProfile = () => {
    void submit(true);
  };

  return { values, notice, busy, conflict, updateField, saveProfile, reloadProfile };
};
