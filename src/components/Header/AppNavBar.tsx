import React, { useState } from "react";
import { Panel, PanelType, Nav, DefaultButton, FLink } from "./lib";
import { IUser, ISettings } from "../../lib/queries";
import Settings from "./Settings";
import { INavLink, Icon, FontSizes, Stack } from "office-ui-fabric-react";
import { useHistory } from "react-router";
import { getCurrentApp } from "../";
interface Props {
  my: Partial<IUser>;
  isOpen: boolean;
  dismissPanel: () => any;
}

export const AppNavBar: React.FC<Props> = ({ my, isOpen, dismissPanel }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();
  const openGroup = getCurrentApp();
  function openModal() {
    setModalOpen(true);
  }
  function dismissModal() {
    setModalOpen(false);
  }
  const applications: Array<INavLink> = my.applications
    ? my.applications.map(app => ({
        name: `${app.name}`,
        groupData: {
          url: (app.defaultRoute && `/${app.path}`) || `/${app.path}`
        },
        isExpanded: app.path === openGroup,
        url: (app.defaultRoute && `/${app.path}`) || `/${app.path}`,
        key:
          app.path === getCurrentApp()
            ? history.location.pathname
            : `/${app.path}`,
        links:
          app.links &&
          app.links
            .filter(l => {
              return (
                app.roles &&
                app.roles.filter(r => {
                  return (
                    my.groups &&
                    my.groups.filter(g => {
                      return r.groupNames.includes(g.name);
                    }).length > 0 &&
                    l.roles.includes(r.name)
                  );
                }).length > 0
              );
            })
            .map(l => ({
              name: l.text,
              url: `/${app.path}/${l.path}`,
              key: `/${app.path}/${l.path}`
            }))
      }))
    : [{ name: "Loading...", url: "", key: "loading", disabled: true }];
  const settings: Partial<ISettings> = my.settings ? my.settings : {};
  return (
    <Panel
      isLightDismiss
      customWidth={"272px"}
      type={PanelType.customNear}
      isOpen={isOpen}
      onDismiss={dismissPanel}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <>
          <DefaultButton onClick={openModal}>Settings</DefaultButton>
          <Settings
            isOpen={modalOpen}
            dismissModal={dismissModal}
            settings={settings}
          />
        </>
      )}
    >
      <FLink href={`http://intranet`}>
        <Stack horizontal verticalAlign={"center"}>
          <Icon
            style={{
              fontSize: "3em",
              textDecoration: "none",
              paddingRight: 10
            }}
            iconName={"SharepointLogo"}
          />
          <span style={{ fontSize: FontSizes.large }}>Sharepoint</span>
        </Stack>
      </FLink>

      <h2>Applications</h2>
      <Nav
        selectedKey={history.location.pathname}
        groups={[
          {
            links: applications
          }
        ]}
        onLinkClick={(ev?: any, item?: INavLink) => {
          ev?.preventDefault();
          item && history.push(item.url);
        }}
        isOnTop={false}
      />
    </Panel>
  );
};
