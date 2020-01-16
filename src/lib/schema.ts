export interface IndexableObject {
  [key: string]: any;
}

export interface Field {
  label: string;
  type: string;
  required: boolean;
  onLabel: string;
  offLabel: string;
}
export interface IRow {
  name: string;
  onRender?: (row: IndexableObject) => any;
}
