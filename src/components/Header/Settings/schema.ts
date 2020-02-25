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
    type: "select",
    label: "Font Size",
    options: [
      { text: "Small", value: 1.0 },
      { text: "Medium", value: 1.14 },
      { text: "Large", value: 1.29 }
    ],
    defaultValue: 1,
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
