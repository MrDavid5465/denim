interface StringTMap<T> {
  [key: string]: T;
}
type Modify<T, R> = Omit<T, keyof R> & R;
export interface IForm extends StringTMap<any> {}
export interface ISchema extends StringTMap<Required<Field>> {}
export interface IValidationErrors extends StringTMap<string[]> {}

export interface Validation {
  test(form: Form<IForm>): boolean;
  message: string;
}

export interface Field {
  [key: string]: any;
  type: string;
  label: string;
  required?: boolean;
  validations?: Array<Validation>;
  display?: boolean;
  defaultValue?: number | boolean | string | [] | {};
  defaultNull?: number | boolean | string | [] | {};
}

export interface CommonFieldProps {
  [key: string]: any;
  error: string | undefined;
  hint: string | undefined;
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  text?: string;
  type: string;
  value: any;
}

export type TextProps = CommonFieldProps & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export type RadioProps = {
  checked: boolean;
  options: { text: string; value: any }[];
  type: string;
  label: string;
  required: boolean;
};

export type CheckboxProps = CommonFieldProps & {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export type SelectProps = CommonFieldProps & {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: { text: string; value: any }[];
};

export interface IFormHook<T> {
  form: Form<T>;
  submit: () => IForm;
  change: (k: string, v: any) => void;
  reset: () => void;
}

export type Form<IForm> = {
  [key in keyof IForm]: any;
};

export type ValidationErrors<T> = {
  [key in keyof T]: string[];
};

export type SchemaDefinition<T> = {
  [key in keyof T]: Field;
};

export type Schema<T> = {
  [key in keyof T]: Required<Field>;
};
