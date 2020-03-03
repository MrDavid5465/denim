import React, { useState } from "react";
import {
  Stack,
  IconButton,
  Icon,
  Panel,
  PanelType,
  useConstCallback,
  getTheme,
  Nav,
  HeaderLink,
  Switch,
  Route,
  getStyle
} from "./lib";
import { IUser } from "../../lib/queries";
import { useHistory } from "react-router";
import { INavLink } from "office-ui-fabric-react";

interface Props {
  my: Partial<IUser>;
  Controls?: React.FC<any>;
  className: string;
}

export const NavBar: React.FC<Props> = ({ my, Controls, className }) => {
  const history = useHistory();
  const theme = getTheme();
  const style = getStyle();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const openNav = useConstCallback(() => setIsNavOpen(true));
  const dismissNav = useConstCallback(() => setIsNavOpen(false));
  const apps =
    my.applications &&
    my.applications.map(app => ({
      ...app,
      links:
        app.links &&
        app.links.filter(l => {
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
    }));

  return (
    <Stack className={className}>
      <Stack horizontal horizontalAlign={"end"}>
        <Switch>
          {apps &&
            apps.map(app => {
              return (
                <Route
                  key={app.path}
                  path={`/${app.path}`}
                  render={props => (
                    <Stack
                      className={style.hiddenLgDown}
                      verticalAlign={"center"}
                      style={{ paddingRight: "0.924em" }}
                      horizontal
                      tokens={{ childrenGap: "0.77em" }}
                    >
                      {app.links &&
                        app.links.map(l => {
                          return (
                            <HeaderLink
                              key={l.path}
                              to={`/${app.path}/${l.path}`}
                              active={props.location.pathname.startsWith(
                                `/${app.path}/${l.path}`
                              )}
                              {...props}
                            >
                              {l.text}
                            </HeaderLink>
                          );
                        })}
                    </Stack>
                  )}
                />
              );
            })}
        </Switch>
        {Controls && <Controls />}
      </Stack>
      <Stack
        horizontal
        style={{ position: "absolute", top: "0em", right: "0em" }}
        className={style.hiddenXlUp}
      >
        <IconButton onClick={openNav} className={style.iconButtonStyle}>
          <Icon
            iconName={"GlobalNavButton"}
            style={{
              fontSize: "1.7em",
              color: theme.semanticColors.primaryButtonText
            }}
          />
        </IconButton>
        <Panel
          isLightDismiss
          onDismiss={dismissNav}
          isOpen={isNavOpen}
          customWidth={"20.94em"}
          type={PanelType.custom}
        >
          {Controls && <Controls />}
          <Switch>
            {apps &&
              apps.map(app => (
                <Route
                  key={app.path}
                  path={`/${app.path}`}
                  render={props => (
                    <Nav
                      onLinkClick={(ev?: any, item?: INavLink) => {
                        ev?.preventDefault();
                        item && history.push(item.url);
                        dismissNav();
                      }}
                      groups={[
                        {
                          links: app.links.map(l => ({
                            name: l.text,
                            url: `/${app.path}/${l.path}`
                          }))
                        }
                      ]}
                      {...props}
                    />
                  )}
                />
              ))}
          </Switch>
        </Panel>
      </Stack>
    </Stack>
  );
};
