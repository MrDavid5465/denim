import React from "react";
import { Modal, useMutation, Stack, getStyle } from "../lib";
import { userSettings } from "./schema";
import dispatcher, { ISettings } from "../../../lib/queries";
import { Form, PrimaryButton } from "../../../lib";
import { RefObject } from "office-ui-fabric-react";

interface Props {
  isOpen: boolean;
  dismissModal: () => any;
  settings: Partial<ISettings>;
  themes: any;
}

const Index: React.FC<Props> = ({ isOpen, dismissModal, settings, themes }) => {
  const style = getStyle();
  const settingsRef: React.RefObject<any> = React.createRef();
  const [updateMyUserSettings] = useMutation(dispatcher.updateMyUserSettings, {
    onCompleted: () => dismissModal()
  });
  function handleChange() {
    settingsRef.current.isValid &&
      updateMyUserSettings({
        variables: { settings: settingsRef.current.submit() },
        refetchQueries: ["my"]
      });
  }
  return (
    <Modal isOpen={isOpen} onDismiss={dismissModal} titleAriaId={"title"}>
      <Stack className={style.modalHeader}>
        <span id={"title"}>User Settings</span>
      </Stack>
      <Stack className={style.modalBody}>
        {settings && (
          <>
            <Form
              form={userSettings(themes)}
              name={"userSettings"}
              initialValues={settings}
              ref={settingsRef}
              //onChange={handleChange}
            />
            <Stack horizontal tokens={{ childrenGap: "0.77em" }}>
              <PrimaryButton onClick={handleChange}>Save</PrimaryButton>
            </Stack>
          </>
        )}
      </Stack>
    </Modal>
  );
};
export default Index;
