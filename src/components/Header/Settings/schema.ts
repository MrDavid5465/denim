export const userSettings = (themes: any) => ({
  serviceDeskKey: {
    type: "text",
    label: "Service Desk Key",
    required: false
  },
  launchPage: {
    type: "text",
    label: "Launch Page",
    required: false
  },
  theme: {
    type: "select",
    label: "Theme",
    options: Object.keys(themes).map(k => ({ key: k, text: k, value: k }))
  }
});
