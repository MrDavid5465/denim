import { useState } from "react";
import { Schema, IForm, Form } from "./interfaces";

export function useForm<T extends IForm>(
  schema: Schema<T>,
  passedValues: IForm = {}
): {
  values: T;
  submit: () => IForm;
  change: (k: string, v: any) => void;
  reset: () => void;
} {
  const [values, setValues] = useState(defaultValues());

  function defaultValues(): Form<T> {
    return Object.entries(schema).reduce((prev, [k, v]: [string, any]) => {
      const defaultValue = passedValues[k] || v.defaultValue || "";
      const cleanValue = defaultValue === v.nullValue ? "" : defaultValue;
      return { ...prev, [k]: cleanValue };
    }, {} as Form<T>);
  }

  function convertIfNumber(key: string) {
    return values[key] !== "" &&
      schema[key].type === "number" &&
      !isNaN(values[key])
      ? values[key] % 1 === 0
        ? parseInt(values[key])
        : parseFloat(values[key])
      : values[key];
  }

  function onChange(name: string, value: any) {
    setValues({ ...values, [name]: value });
  }

  function onReset() {
    setValues(defaultValues());
  }

  function onSubmit() {
    return Object.entries(schema).reduce((prev, [k, v]) => {
      const convertedValue = convertIfNumber(k);
      return v.nullValue !== undefined && convertedValue === ""
        ? { ...prev, [k]: v.nullValue }
        : { ...prev, [k]: convertedValue };
    }, values);
  }

  return { values, submit: onSubmit, change: onChange, reset: onReset };
}
