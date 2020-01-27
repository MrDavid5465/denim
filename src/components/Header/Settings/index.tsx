import React, { useState, useEffect } from "react";
import { TextField, Modal, Toggle, useMutation, Stack, getStyle } from "../lib";
import { userSettings } from "./schema";
import dispatcher, { ISettings } from "../../../lib/queries";
import { Dropdown, Form } from "../../../lib";
import { IDropdownOption } from "office-ui-fabric-react";

interface Props {
  isOpen: boolean;
  dismissModal: () => any;
  settings: Partial<ISettings>;
  themes: any;
}

const Index: React.FC<Props> = ({ isOpen, dismissModal, settings, themes }) => {
  const style = getStyle();

  const [updateMyUserSettings] = useMutation(dispatcher.updateMyUserSettings);
  function handleChange(name: string, values: any) {
    updateMyUserSettings({
      variables: { settings: values.clean },
      refetchQueries: ["my"]
    });
  }
  // function handleChange(
  //   ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   newValue?: string
  // ) {
  //   setForm({ ...form, [ev.currentTarget.name]: newValue });
  // }
  // function handleSelect(ev: any, option?: IDropdownOption | undefined) {
  //   setForm({ ...form, [ev.currentTarget.name]: option?.key });
  // }
  // function toggleDark(
  //   ev: React.MouseEvent<HTMLElement>,
  //   checked: boolean | undefined
  // ) {
  //   setForm({ ...form, theme: checked ? "dark" : "light" });
  // }
  return (
    <Modal isOpen={isOpen} onDismiss={dismissModal} titleAriaId={"title"}>
      <Stack className={style.modalHeader}>
        <span id={"title"}>User Settings</span>
      </Stack>
      <Stack className={style.modalBody}>
        <Form
          form={userSettings(themes)}
          name={"userSettings"}
          initialValues={settings}
          onChange={handleChange}
        />
        {/* <TextField
          name={"launchPage"}
          label={userSettings(themes).launchPage.label}
          value={form.launchPage}
          onChange={handleChange}
        />
        <TextField
          name={"serviceDeskKey"}
          label={userSettings(themes).serviceDeskKey.label}
          value={form.serviceDeskKey}
          onChange={handleChange}
        />
        <Dropdown
          name={"theme"}
          label={userSettings(themes).theme.label}
          options={userSettings(themes).theme.options}
          value={form.theme}
          onChange={handleSelect}
        /> */}
      </Stack>
    </Modal>
  );
};
export default Index;
