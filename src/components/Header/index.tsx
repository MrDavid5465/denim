import React, { useState } from "react";
import {
  Stack,
  HeaderLink,
  Icon,
  IconButton,
  getTheme,
  Switch,
  Route,
  getStyle
} from "./lib";
import { useConstCallback } from "@uifabric/react-hooks";
import { AppNavBar } from "./AppNavBar";
import { NavBar } from "./NavBar";
import { IApplication } from "../../lib/queries";

interface Props {
  my: any;
  Brand?: React.FC<any>;
  Controls?: React.FC<any>;
  themes: any;
  ExternalApps?: React.FC<any>;
}

export const Header: React.FC<Props> = ({
  my,
  Brand,
  themes,
  Controls,
  ExternalApps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = getTheme();
  const style = getStyle();
  const openPanel = useConstCallback(() => setIsOpen(true));
  const dismissPanel = useConstCallback(() => setIsOpen(false));
  return (
    <div
      style={{
        backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered,
        color: theme.palette.themeLighter,
        width: "100vw"
      }}
    >
      <Stack
        horizontal
        horizontalAlign={"space-between"}
        verticalAlign={"center"}
        tokens={{ childrenGap: "0.77em", maxHeight: "3.85em" }}
        style={{
          backgroundColor: theme.semanticColors.primaryButtonBackground,
          color: theme.palette.themeLighter,
          position: "fixed",
          width: "100vw",
          minWidth: "24.64em",
          zIndex: 1000
        }}
      >
        <Stack
          verticalAlign={"center"}
          horizontal
          tokens={{ childrenGap: "0.77em" }}
        >
          <Stack.Item grow disableShrink>
            <IconButton onClick={openPanel} className={style.headerIconButton}>
              <Icon iconName={"Waffle"} className={style.waffle} />
            </IconButton>
          </Stack.Item>
          {Brand && (
            <Brand
              style={{
                fill: theme.palette.themeLighter,
                height: "2.695em",
                minHeight: "2.695em",
                maxHeight: "2.695em",
                width: "2.695em"
              }}
            />
          )}
          <Switch>
            <Route
              path={`/`}
              exact
              render={props => (
                <HeaderLink to={`/`} {...props}>
                  Home
                </HeaderLink>
              )}
            />
            {my.applications &&
              my.applications.map((app: IApplication) => (
                <Route
                  key={app.path}
                  path={`/${app.path}`}
                  render={props => (
                    <HeaderLink to={`/${app.path}`} {...props}>
                      {app.name}
                    </HeaderLink>
                  )}
                />
              ))}
          </Switch>
        </Stack>
        <AppNavBar
          isOpen={isOpen}
          dismissPanel={dismissPanel}
          my={my}
          themes={themes}
          ExternalApps={ExternalApps}
        />
        <NavBar my={my} Controls={Controls} className={style.navBar} />
      </Stack>
    </div>
  );
};
