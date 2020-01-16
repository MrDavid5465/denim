import React, { FC, ReactElement } from "react";
import {
  IIs,
  IField,
  IForm,
  IValidationErrors,
  Field,
  Schema,
  SchemaDefinition
} from "../Form/types";

type Props<T> = {
  dirty?: IIs;
  errors: IValidationErrors;
  name?: string;
  onChange: (name: string, value: any) => void;
  onFocus?: (name: string) => void;
  schema: Schema<SchemaDefinition<T>>;
  Template: FC<IField>;
  touched?: IIs;
  values: IForm;
};

export default function FormWrapper<T>({
  dirty,
  errors,
  name: parent,
  onFocus,
  onChange,
  schema,
  Template,
  touched,
  values
}: Props<T>): ReactElement {
  return (
    <>
      {Object.entries(schema).map(([name, definition], i) => {
        const { label, options, type } = definition as Required<Field>;
        return (
          <Template
            dirty={dirty && dirty[name]}
            errors={errors[name]}
            key={`${name}-${i}`}
            label={label}
            name={name}
            onChange={onChange}
            onFocus={onFocus}
            options={options}
            parent={parent}
            touched={touched && touched[name]}
            type={type}
            value={values[name]}
          />
        );
      })}
    </>
  );
}
