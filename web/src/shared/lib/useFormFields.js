import { useState } from "react";

export const useFormFields = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = (validator) => {
    const errors = validator(values);
    setFieldErrors(errors);
    return errors;
  };

  return { values, fieldErrors, handleChange, validate };
};
