import { FormField } from "../../../shared/ui/form-field/index.js";

export const AuthField = ({
  autoComplete,
  error,
  label,
  maxLength,
  minLength,
  name,
  onChange,
  type = "text",
  value,
}) => {
  return (
    <FormField
      id={name}
      label={label}
      layout="horizontal"
      error={error}
      inputProps={{ autoComplete, maxLength, minLength, name, onChange, type, value }}
    />
  );
};
