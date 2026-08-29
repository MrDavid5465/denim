// Browser-local source of truth for Denim chrome settings (theme, font
// size, launch page) — a public site with anonymous visitors, so these are
// per-visitor preferences, not something a shared backend record could hold
// without one visitor's change leaking to everyone else. See
// `backend/src/user_settings.rs` for the real per-account model this will
// eventually read/write instead, once JWT auth exists.
export interface ILocalSettings {
  launchPage: string;
  theme: string;
  fontSize: number;
}

const KEY = 'denim-settings';

export const DEFAULT_SETTINGS: ILocalSettings = {
  launchPage: 'projects',
  theme: 'default',
  fontSize: 1,
};

export function readLocalSettings(): ILocalSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeLocalSettings(settings: ILocalSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable — nothing to do
  }
}
