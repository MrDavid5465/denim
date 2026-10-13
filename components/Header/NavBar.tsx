import React, { useState, useCallback } from "react";
import {
  Stack,
  IconButton,
  Icon,
  Panel,
  PanelType,
  getTheme,
  Nav,
  HeaderLink,
  Routes,
  Route,
  getStyle
} from "./lib";
import { IUser } from "../../lib/queries";
import { INavLink } from "@fluentui/react";
import { useLocation, useNavigate } from "react-router";

interface Props {
  my: Partial<IUser>;
  Controls?: React.FC<any>;
  className: string;
}

// A link is active on its own page and the pages under it, matched by whole
// path segments: "check" must not light up on "checks". A link to the app
// root ("") is active only on the root itself, or it would match every page.
const isLinkActive = (pathname: string, appPath: string, linkPath: string) => {
  const base = `/${appPath}${linkPath ? `/${linkPath}` : ""}`.replace(/\/+$/, "");
  const path = pathname.replace(/\/+$/, "");
  return linkPath ? path === base || path.startsWith(`${base}/`) : path === base;
};

export const NavBar: React.FC<Props> = ({ my, Controls, className }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = getTheme();
  const style = getStyle();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const openNav = useCallback(() => setIsNavOpen(true), []);
  const dismissNav = useCallback(() => setIsNavOpen(false), []);
  const apps =
    my.applications &&
    my.applications.map(app => ({
      ...app,
      links:
        app.links &&
        app.links
    }));

  return (
    <Stack className={className}>
      <Stack horizontal horizontalAlign={"end"}>
        <Routes>
          {apps &&
            apps.map(app => {
              return (
                <Route
                  key={app.path}
                  path={`/${app.path}/*`}
                  element={
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
                              active={isLinkActive(pathname, app.path, l.path)}
                            >
                              {l.text}
                            </HeaderLink>
                          );
                        })}
                    </Stack>
                  }
                />
              );
            })}
        </Routes>
        {Controls && <Controls />}
      </Stack>
      <Stack
        horizontal
        style={{ position: "absolute", top: "0em", right: "0em" }}
        className={style.hiddenXlUp}
      >
        {Controls ? (
          <div
            onClick={openNav}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Controls />
          </div>
        ) : (
          <IconButton onClick={openNav} className={style.iconButtonStyle}>
            <Icon
              iconName={"GlobalNavButton"}
              style={{
                fontSize: "1.7em",
                color: theme.semanticColors.primaryButtonText
              }}
            />
          </IconButton>
        )}
        <Panel
          isLightDismiss
          onDismiss={dismissNav}
          isOpen={isNavOpen}
          customWidth={"20.94em"}
          type={PanelType.custom}
        >
          <Routes>
            {apps &&
              apps.map(app => (
                <Route
                  key={app.path}
                  path={`/${app.path}/*`}
                  element={
                    <Nav
                      onLinkClick={(ev?: any, item?: INavLink) => {
                        ev?.preventDefault();
                        item && navigate(item.url);
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
                    />
                  }
                />
              ))}
          </Routes>
        </Panel>
      </Stack>
    </Stack>
  );
};
