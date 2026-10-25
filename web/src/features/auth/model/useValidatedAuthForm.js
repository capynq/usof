import { useFormFields } from "../../../shared/lib/useFormFields.js";

export const useValidatedAuthForm = ({
  initialValues,
  validator,
  onSubmit,
  onAttempt,
}) => {
  const fields = useFormFields(initialValues);

  const handleSubmit = async (event) => {
    event.preventDefault();
    onAttempt?.();

    const errors = fields.validate(validator);
    if (Object.keys(errors).length) return;

    await onSubmit(fields.values);
  };

  return { ...fields, handleSubmit };
};
