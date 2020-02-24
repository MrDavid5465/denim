import React from "react";
import { Modal, useMutation, Stack, getStyle } from "../lib";
import { userSettings } from "./schema";
import dispatcher, { ISettings } from "../../../lib/queries";
import { Form } from "../../../lib";

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
      </Stack>
    </Modal>
  );
};
export default Index;
