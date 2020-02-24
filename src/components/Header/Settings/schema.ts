import { IForm } from "@octant/per-form";

export const userSettings = (themes: any) => ({
  launchPage: {
    type: "text",
    label: "Launch Page",
    required: false
  },
  theme: {
    type: "select",
    label: "Theme",
    options: Object.keys(themes).map(k => ({ key: k, text: k, value: k }))
  },
  fontSize: {
    type: "number",
    label: "Font Size multiplier",
    defaultNull: 1,
    converter: (
      key: string,
      values: IForm,
      defaultNull: any,
      dirty: boolean
    ) => {
      return parseFloat(values[key]) || defaultNull;
    }
  }
});
