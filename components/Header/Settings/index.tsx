import React, { useState } from 'react';
import { Modal, Stack, getStyle } from '../lib';
import { getTheme } from '../../../lib';
import { userSettings } from './schema';
import { parseThemeKey, themeKey } from '../../../../themes';
import { ILocalSettings } from '../../../lib/localSettings';
import { Form, PrimaryButton } from '../../../lib';

interface Props {
  isOpen: boolean;
  dismissModal: () => any;
  settings: ILocalSettings;
  onSave: (next: ILocalSettings) => void;
}

const Index: React.FC<Props> = ({ isOpen, dismissModal, settings, onSave }) => {
  const style = getStyle();

  // Pushed up from the General tab's Form via onChange rather than pulled
  // from a ref at save time — see denim's original Settings dialog for why
  // (Fluent Pivot unmounts inactive tabs, dropping ref-based state). No
  // longer relevant with a single tab, but kept for consistency if more
  // tabs get added back later.
  const [generalValues, setGeneralValues] = useState<any>({});
  const [generalValid, setGeneralValid] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleSave() {
    if (!generalValid) {
      setSaveError('Please fix the highlighted fields before saving.');
      return;
    }
    setSaveError(null);
    onSave({ ...settings, ...generalValues });
    dismissModal();
  }

  return (
    <Modal isOpen={isOpen} onDismiss={dismissModal} titleAriaId={'title'}>
      <Stack className={style.modalHeader}>
        <span id={'title'}>Settings</span>
      </Stack>
      <Stack className={style.modalBody}>
        <div style={{ width: '34em' }}>
          {settings && (
            <Stack tokens={{ childrenGap: '0.77em' }} style={{ paddingTop: '0.77em' }}>
              <Form
                form={userSettings()}
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
          )}
        </div>

        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: '0.77em' }} style={{ paddingTop: '1em' }}>
          <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
          {saveError && (
            <span style={{ fontSize: '0.82em', color: getTheme().palette.redDark }}>{saveError}</span>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
export default Index;
