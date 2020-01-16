import React, { useState, useEffect } from "react";
import { TextField, Modal, Toggle, useMutation, Stack, getStyle } from "../lib";
import { userSettings } from "./schema";
import dispatcher, { ISettings } from "../../../lib/queries";

interface Props {
  isOpen: boolean;
  dismissModal: () => any;
  settings: Partial<ISettings>;
}

const Index: React.FC<Props> = ({ isOpen, dismissModal, settings }) => {
  const style = getStyle();
  const [form, setForm] = useState<Partial<ISettings>>({
    sAMAccountName: settings.sAMAccountName,
    launchPage: settings.launchPage,
    theme: settings.theme,
    serviceDeskKey: settings.serviceDeskKey
  });

  const [updateMyUserSettings] = useMutation(dispatcher.updateMyUserSettings);
  useEffect(() => {
    updateMyUserSettings({
      variables: { settings: form },
      refetchQueries: ["my"]
    });
  }, [form, updateMyUserSettings]);

  function handleChange(
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) {
    setForm({ ...form, [ev.currentTarget.name]: newValue });
  }
  function toggleDark(
    ev: React.MouseEvent<HTMLElement>,
    checked: boolean | undefined
  ) {
    setForm({ ...form, theme: checked ? "dark" : "light" });
  }
  return (
    <Modal isOpen={isOpen} onDismiss={dismissModal} titleAriaId={"title"}>
      <Stack className={style.modalHeader}>
        <span id={"title"}>User Settings</span>
      </Stack>
      <Stack className={style.modalBody}>
        <TextField
          name={"launchPage"}
          label={userSettings.launchPage.label}
          value={form.launchPage}
          onChange={handleChange}
        />
        <TextField
          name={"serviceDeskKey"}
          label={userSettings.serviceDeskKey.label}
          value={form.serviceDeskKey}
          onChange={handleChange}
        />
        <Toggle
          label={"Dark Theme"}
          onText={"Dark"}
          offText={"Light"}
          checked={form.theme === "dark" ? true : false}
          onChange={toggleDark}
        />
      </Stack>
    </Modal>
  );
};
export default Index;
