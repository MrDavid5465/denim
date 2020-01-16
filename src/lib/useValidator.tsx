import {
  Form,
  ISchema,
  Schema,
  Validation,
  ValidationErrors
} from "./interfaces";

export function useValidator<T extends ISchema>(passedSchema: Schema<T>) {
  function validate<F>(values: Form<F>): ValidationErrors<F> {
    const intersection = Object.keys(values).filter(key => !!passedSchema[key]);

    return intersection.reduce((prev, k) => {
      const { defaultValue, required, validations } = passedSchema[k];
      const { [k]: value }: any = values;

      const validationsWithDefaults: Validation[] = required
        ? [
            {
              test: ({ [k]: field }: any) => !!field,
              message: "This field is required"
            },
            ...validations
          ]
        : validations;

      return {
        ...prev,
        [k]:
          !required && value === defaultValue
            ? []
            : validationsWithDefaults.reduce<string[]>(
                (p, { test, message }): string[] =>
                  test(values) ? p : [...p, message],
                []
              )
      } as ValidationErrors<F>;
    }, {} as Form<F>);
  }

  return validate;
}
