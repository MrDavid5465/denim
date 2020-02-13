import React from "react";
import "../App.scss";
import "@uifabric/icons";
import {
  Fabric,
  loadTheme,
  mergeStyleSets,
  Stack,
  Switch,
  Route,
  getTheme,
  Redirect
} from "../lib";
import { Header } from "./Header";
import Splashscreen from "./Splashscreen";
import stylesJson from "../lib/getStyle";
import { useQuery } from "@apollo/react-hooks";
import { IMy } from "../lib/queries";
import dispatcher from "../lib/queries";
import IconSVG, { IconProps } from "../logo";

export const setTheme = (themeString: string, themes: any) => {
  loadTheme(themes[themeString || "default"] || themes["default"]);
};
export const getCurrentApp = () => {
  return document.location.pathname.split("/")[1];
};
export const getStyle = () => mergeStyleSets(stylesJson(getTheme()));
interface Props {
  components?: any;
  RootComponent?: any;
  themes: any;
  Logo?: React.FC<IconProps>;
  Brand?: React.FC<any>;
  Controls?: React.FC<any>;
}
const App: React.FC<Props> = ({
  components = {},
  themes,
  Logo = IconSVG,
  Brand,
  RootComponent,
  Controls
}) => {
  const { loading, data } = useQuery<IMy>(dispatcher.my);
  if (loading) {
    setTheme("default", themes);
    return <Splashscreen Icon={Logo} />;
  }
  setTheme(
    `${data && data.my && data.my.settings && data.my.settings.theme}`,
    themes
  );
  const style = getStyle();
  return (
    <Fabric
      key={`${data && data.my && data.my.settings && data.my.settings.theme}`}
      applyThemeToBody
    >
      <Route
        exact
        path={"/"}
        render={props => (
          <Header
            my={data && data.my}
            Brand={Brand}
            Controls={Controls}
            themes={themes}
          />
        )}
      />
      <Route
        path={"/:render"}
        render={props => {
          return props.match.params.render !== undefined &&
            props.match.params.render === "kiosk" ? (
            <></>
          ) : (
            <Header
              my={data && data.my}
              Brand={Brand}
              Controls={Controls}
              themes={themes}
            />
          );
        }}
      />

      <Switch>
        <Route
          path={"/"}
          exact
          render={props => (
            <Stack className={style.content}>
              {RootComponent ? (
                <RootComponent {...props} />
              ) : data &&
                data.my &&
                data.my.settings &&
                data.my.settings.launchPage ? (
                <Redirect to={`/${data.my.settings.launchPage}`} />
              ) : (
                <Stack>
                  <h1>Welcome, Click the waffle icon to begin!</h1>
                </Stack>
              )}
            </Stack>
          )}
        />
        {data &&
          data.my &&
          data.my.applications &&
          data.my.applications.map((app, i) => {
            const Empty: React.FC = () => <Stack />;
            return (
              <Route
                key={i}
                path={`/${app.path}`}
                render={props => {
                  const Component = components[app.frontEnd] || Empty;
                  return (
                    <Stack className={style.content}>
                      {app.defaultRoute && (
                        <Route
                          path={`/${app.path}`}
                          exact
                          render={props => (
                            <Redirect to={`/${app.path}/${app.defaultRoute}`} />
                          )}
                        />
                      )}
                      <Component {...props} app={app} />
                    </Stack>
                  );
                }}
              />
            );
          })}
        {data &&
          data.my &&
          data.my.applications &&
          data.my.applications.map((app, i) => {
            const Empty: React.FC = () => <Stack />;
            return (
              <Route
                key={i}
                path={`/kiosk/${app.path}`}
                render={props => {
                  const Component = components[app.frontEnd] || Empty;
                  return (
                    <Stack className={style.content} style={{ paddingTop: 0 }}>
                      {app.defaultRoute && (
                        <Route
                          path={`/kiosk/${app.path}`}
                          exact
                          render={props => (
                            <Redirect
                              to={`/kiosk/${app.path}/${app.defaultRoute}`}
                            />
                          )}
                        />
                      )}
                      <Component {...props} />
                    </Stack>
                  );
                }}
              />
            );
          })}
      </Switch>
    </Fabric>
  );
};

export default App;
