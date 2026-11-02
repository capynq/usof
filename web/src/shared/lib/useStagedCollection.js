import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isLocalMutationData } from "./localMutationSync.js";

const entries = (value) =>
  Array.isArray(value)
    ? value
    : Array.isArray(value?.data)
      ? value.data
      : value == null
        ? []
        : [value];
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const identity = (value) => value;

export const useStagedCollection = (data, collectionKey = "", select = identity) => {
  const generation = useSelector((state) => state.auth.generation);
  const scopeKey = JSON.stringify([generation, collectionKey]);
  const [state, setState] = useState(() => ({ scopeKey, displayed: data, latest: data }));
  const applyPending = () => setState((current) => ({ ...current, displayed: current.latest }));

  useEffect(() => {
    if (data == null) {
      setState((current) =>
        current.displayed == null && current.latest == null && current.scopeKey === scopeKey
          ? current
          : { scopeKey, displayed: undefined, latest: undefined },
      );

      return;
    }

    setState((current) => {
      if (current.scopeKey !== scopeKey || current.displayed == null || isLocalMutationData(data)) {
        return { scopeKey, displayed: data, latest: data };
      }

      if (current.latest === data) return current;

      return { ...current, latest: data };
    });
  }, [data, scopeKey]);

  const current =
    data != null && state.scopeKey === scopeKey ? state : { displayed: data, latest: data };
  const hasPending = !equal(select(current.displayed), select(current.latest));
  const displayed = entries(current.displayed);
  const latest = entries(current.latest);
  const oldById = new Map(displayed.map((item) => [item.id, item]));
  const newIds = new Set(latest.map((item) => item.id));
  const changed = latest.filter(
    (item, index) => !equal(oldById.get(item.id), item) || displayed[index]?.id !== item.id,
  ).length;
  const removed = displayed.filter((item) => !newIds.has(item.id)).length;
  const pendingCount = hasPending ? Math.max(1, changed + removed) : 0;

  return { data: current.displayed ?? data, hasPending, pendingCount, applyPending };
};
