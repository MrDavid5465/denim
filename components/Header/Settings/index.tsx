import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Stack, getStyle } from '../lib';
import { Pivot, PivotItem, getTheme } from '../../../lib';
import { userSettings } from './schema';
import { parseThemeKey, themeKey } from '../../../themes';
import { IDenimSettings } from '../../../lib/localSettings';
import { ISettingsExtensions, ISettingsTabProps } from '../../../lib/settingsExtensions';
import { Form, PrimaryButton } from '../../../lib';

interface Props extends ISettingsExtensions {
  isOpen: boolean;
  dismissModal: () => any;
  settings: IDenimSettings;
  /** Persists the merged values (localStorage or `updateSettings`). */
  onSave: (values: Record<string, any>) => void | Promise<void>;
}

type SaveFn = (() => void | Promise<void>) | undefined;

const Index: React.FC<Props> = ({
  isOpen,
  dismissModal,
  settings,
  onSave,
  settingsTabs = [],
  settingsGeneralFields,
}) => {
  const style = getStyle();

  // Pushed up from each tab via onChange rather than pulled from refs at
  // save time: Fluent's Pivot unmounts inactive tabs, so a ref into another
  // tab is null by the time Save is pressed.
  const [generalValues, setGeneralValues] = useState<any>({});
  const [generalValid, setGeneralValid] = useState(true);
  const [tabPatches, setTabPatches] = useState<Record<string, Record<string, any>>>({});
  const [tabValidity, setTabValidity] = useState<Record<string, { valid: boolean; message?: string }>>({});
  const saveFns = useRef<Record<string, SaveFn>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Start every opening from the saved settings, not a previous session's
  // unsaved edits.
  useEffect(() => {
    if (isOpen) {
      setTabPatches({});
      setTabValidity({});
      setSaveError(null);
      saveFns.current = {};
    }
  }, [isOpen]);

  // One stable onChange/registerSave pair per tab key, so a tab can list
  // them as effect dependencies without re-running every render.
  const tabCallbacks = useMemo(() => {
    const out: Record<string, Pick<ISettingsTabProps, 'onChange' | 'registerSave'>> = {};
    settingsTabs.forEach(tab => {
      out[tab.key] = {
        onChange: (patch, isValid = true, message) => {
          setTabPatches(prev => ({ ...prev, [tab.key]: patch }));
          setTabValidity(prev => ({ ...prev, [tab.key]: { valid: isValid, message } }));
        },
        registerSave: save => {
          saveFns.current[tab.key] = save;
        },
      };
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsTabs.map(t => t.key).join('|')]);

  async function handleSave() {
    if (!generalValid) {
      setSaveError('Please fix the highlighted fields on the General tab before saving.');
      return;
    }
    const invalid = settingsTabs.find(t => tabValidity[t.key] && !tabValidity[t.key].valid);
    if (invalid) {
      setSaveError(tabValidity[invalid.key].message ?? `Please fix the ${invalid.headerText} tab before saving.`);
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      const values = Object.assign({}, generalValues, ...settingsTabs.map(t => tabPatches[t.key] ?? {}));
      await onSave(values);
      for (const tab of settingsTabs) {
        await saveFns.current[tab.key]?.();
      }
      dismissModal();
    } catch (e: any) {
      setSaveError(e?.message ?? 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  const general = settings && (
    <Stack tokens={{ childrenGap: '0.77em' }} style={{ paddingTop: '0.77em' }}>
      <Form
        form={{ ...userSettings(), ...(settingsGeneralFields ?? {}) }}
        name={'userSettings'}
        initialValues={{
          ...settings,
          themeMode: parseThemeKey(settings.theme).mode,
          themeColor: parseThemeKey(settings.theme).color,
        }}
        onChange={(_name: string, { clean, isValid }: any) => {
          const { themeColor, themeMode, ...rest } = clean;
          setGeneralValues({ ...rest, theme: themeKey(themeMode, themeColor) });
          setGeneralValid(isValid);
        }}
      />
    </Stack>
  );

  return (
    <Modal isOpen={isOpen} onDismiss={dismissModal} titleAriaId={'title'}>
      <Stack className={style.modalHeader}>
        <span id={'title'}>Settings</span>
      </Stack>
      <Stack className={style.modalBody}>
        <div style={{ width: '34em', maxWidth: '100%' }}>
          {settingsTabs.length === 0 ? (
            general
          ) : (
            <Pivot>
              <PivotItem headerText="General" itemKey="general">
                {general}
              </PivotItem>
              {settingsTabs.map(({ key, headerText, Component }) => (
                <PivotItem key={key} itemKey={key} headerText={headerText}>
                  <Stack style={{ paddingTop: '0.77em' }}>
                    <Component
                      settings={settings}
                      isOpen={isOpen}
                      onChange={tabCallbacks[key].onChange}
                      registerSave={tabCallbacks[key].registerSave}
                    />
                  </Stack>
                </PivotItem>
              ))}
            </Pivot>
          )}
        </div>

        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: '0.77em' }} style={{ paddingTop: '1em' }}>
          <PrimaryButton onClick={handleSave} disabled={saving}>Save</PrimaryButton>
          {saveError && (
            <span style={{ fontSize: '0.82em', color: getTheme().palette.redDark }}>{saveError}</span>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
export default Index;
