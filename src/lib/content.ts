import { IStyle } from "@uifabric/styling";

export interface Content {
  root: IStyle;
}
const content: Content = {
  root: {
    paddingTop: 50,
    width: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    selectors: {
      "@media (min-width: 639px)": {
        maxWidth: 480
      },
      "@media (min-width: 1023px)": {
        maxWidth: 640
      },
      "@media (min-width: 1365px)": {
        maxWidth: 1024
      },
      "@media (min-width: 1919px)": {
        maxWidth: 1366
      }
    }
  }
};
export default content;
