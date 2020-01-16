import { MasterForm, MasterFormState, IForm } from "./types";
import React, { createRef, useState, useEffect, RefObject } from "react";
import { range, unflatten } from "../../lib";

interface Props {
  masterSchema: MasterForm<any, any>;
  initialValues?: IForm;
}

export function useMasterFormState<T>({
  masterSchema,
  initialValues = {}
}: Props): [MasterFormState, (name: string) => void, (name: string) => void] {
  const [refs, setRefs]: [
    { [key: string]: RefObject<any> },
    React.Dispatch<React.SetStateAction<{ [key: string]: RefObject<any> }>>
  ] = useState({});

  useEffect(() => {
    Object.entries(masterSchema.forms).forEach(([key, form]) => {
      const existing = Array.isArray(initialValues[key])
        ? initialValues[key].length
        : 0;
      const start = form.min || 0;
      form.type === "list"
        ? range(0, existing === 0 ? start : existing).forEach(i => {
            const name = `${key}.${i}`;
            setRefs(prev => ({ ...prev, [name]: createRef() }));
          })
        : setRefs(prev => ({ ...prev, [key]: createRef() }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterSchema.forms]);

  function addSubform(name: string) {
    const subformArray = unflatten(refs)[name];

    setRefs(prev => ({
      ...prev,
      [`${name}.${subformArray ? subformArray.length : 0}`]: createRef()
    }));
  }

  function removeSubform(name: string) {
    const { [name]: target, ...rest } = refs;

    setRefs(rest);
  }

  return [refs, addSubform, removeSubform];
}
