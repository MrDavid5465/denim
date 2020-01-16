export { Form } from "../../../lib";
export { useMutation, useQuery } from "@apollo/react-hooks";
export { Link, Route, withRouter } from "react-router-dom";
export interface Name {
  singular: string;
  plural: string;
}
export interface Row {
  value: any;
  values: any;
}
export interface DisplayField {
  label: string;
  onRender?: (row: Row) => any;
  options: any;
}
export type DisplaySchema<T> = {
  [key in keyof T]: DisplayField;
};
