import Denim from "./components";

export { default as light } from "./lib/light";
export { default as dark } from "./lib/dark";
export { default as Logo } from "./logo";
export { default as denimDispatcher } from "./lib/queries";

export { default as styles } from "./lib/getStyle";
export { default as Denim } from "./components";
export type { DenimProps } from "./components";
// export { default as Admin } from "./components/Admin";
export { HeaderLink } from "./components/Header/lib/HeaderLink";
export { FLink, getStyle, getCurrentApp } from "./lib";

export * from "./lib/queries";
export * from "./themes";
export type { IDenimSettings, ILocalSettings } from "./lib/localSettings";
export { DEFAULT_SETTINGS, readLocalSettings, writeLocalSettings } from "./lib/localSettings";
export type { ISettingsTab, ISettingsTabProps, ISettingsExtensions } from "./lib/settingsExtensions";
export { useHealthPoll, pingServer } from "./lib/health";

export default Denim;
