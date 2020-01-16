import React, { useState } from "react";

import SubForm from "./Form";
import { IForm, MasterForm, IConverters } from "./lib";
import { unflatten } from "./lib";
import { useMasterFormState } from "../components/Form/useMasterFormState";

interface Props {
  converters?: IConverters;
  initialValues?: IForm;
  masterSchema: MasterForm<any, any>;
}

const Master: React.FC<Props> = ({
  masterSchema,
  initialValues = {},
  converters = {}
}) => {
  const [formRefs, addSubform, removeSubform] = useMasterFormState({
    masterSchema,
    initialValues
  });
  const [valid, setValid] = useState(false);
  const { forms }: { forms: IForm } = masterSchema;

  function checkValidity() {
    return Object.entries(formRefs).reduce((prev, [, ref]) => {
      return prev && ref.current.isValid;
    }, true);
  }

  function handleAddSubform(name: string) {
    return () => addSubform(name);
  }

  function handleChange() {
    setValid(checkValidity());
  }

  function handleRemoveSubform(name: string) {
    return () => removeSubform(name);
  }

  function handleSubmit() {
    const currentState: IForm = {};
    Object.entries(formRefs).forEach(([name, ref]) => {
      if (ref.current !== null) currentState[name] = ref.current.submit();
    });
    console.log(unflatten(currentState, { compress: true }));
  }

  return (
    <div>
      <h1>{masterSchema.name}</h1>
      {Object.entries(formRefs).map(([name, ref]) => {
        const [formName, index] = name.split(".").slice(-2);

        return (
          <div key={name}>
            <h2>
              {forms[formName].name.singular} {index && Number(index) + 1}
            </h2>

            <SubForm
              converters={converters}
              form={forms[formName].schema}
              initialValues={
                Object.keys(initialValues).length > 0
                  ? forms[formName].type === "list"
                    ? initialValues[formName][index]
                    : initialValues[formName]
                  : undefined
              }
              name={name}
              onChange={handleChange}
              ref={ref}
            />

            {forms[formName].type === "list" && (
              <button onClick={handleRemoveSubform(name)}>
                remove vehicle
              </button>
            )}
          </div>
        );
      })}
      <button onClick={handleAddSubform("vehicles")}>Add Vehicle</button> |{" "}
      <button disabled={!valid} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Master;
