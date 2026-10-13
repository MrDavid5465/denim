// Denim's chrome settings: theme, font size and launch page, plus whatever
// extra keys an app's own settings tabs add (see ISettingsTab).
//
// Where they live is the `settingsSource` prop on <Denim>:
// - "local" (the default): this browser's localStorage. Right for a public
//   site with anonymous visitors, where one shared backend record would leak
//   one visitor's choice to everyone, and for any app with no backend
//   settings at all.
// - "server": the backend's `my.settings` / `updateSettings` (see README,
//   "Server contract"). localStorage then only caches the last-seen theme so
//   the first paint isn't unthemed while `my` loads.
export interface IDenimSettings {
  launchPage: string;
  theme: string;
  fontSize: number;
  // An app's own settings (settingsTabs / settingsGeneralFields) ride along.
  [key: string]: any;
}

/** @deprecated use IDenimSettings */
export type ILocalSettings = IDenimSettings;

const KEY = 'denim-settings';

export const DEFAULT_SETTINGS: IDenimSettings = {
  launchPage: '',
  theme: 'default',
  fontSize: 1,
};

export function readLocalSettings(
  defaults: Partial<IDenimSettings> = {},
): IDenimSettings {
  const base = { ...DEFAULT_SETTINGS, ...defaults };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    return { ...base, ...JSON.parse(raw) };
  } catch {
    return base;
  }
}

export function writeLocalSettings(settings: IDenimSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable (private mode, quota): nothing to do
  }
}
