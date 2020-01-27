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
import { IconProps } from "../../logo";
import { useConstCallback } from "@uifabric/react-hooks";
import { AppNavBar } from "./AppNavBar";
import { NavBar } from "./NavBar";
import { IApplication } from "../../lib/queries";

interface Props {
  my: any;
  Logo: React.FC<IconProps>;
  themes: any;
}

export const Header: React.FC<Props> = ({ my, Logo, themes }) => {
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
        tokens={{ childrenGap: 10, maxHeight: 50 }}
        style={{
          backgroundColor: theme.semanticColors.primaryButtonBackground,
          color: theme.palette.themeLighter,
          position: "fixed",
          width: "100vw",
          minWidth: 320,
          zIndex: 1000
        }}
      >
        <Stack verticalAlign={"center"} horizontal tokens={{ childrenGap: 10 }}>
          <Stack.Item grow disableShrink>
            <IconButton onClick={openPanel} className={style.headerIconButton}>
              <Icon
                iconName={"Waffle"}
                style={{
                  fontSize: theme.fonts.xLargePlus.fontSize,
                  color: theme.palette.themeLighter
                }}
              />
            </IconButton>
          </Stack.Item>
          <Logo
            style={{
              fill: theme.palette.themeLighter,
              height: 35,
              minHeight: 35,
              maxHeight: 35,
              width: 35
            }}
          />
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
        />
        <NavBar my={my} />
      </Stack>
    </div>
  );
};
