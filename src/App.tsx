import React from "react";
import "./App.scss";
import "@uifabric/icons";
import {
  Fabric,
  loadTheme,
  mergeStyleSets,
  Stack,
  Switch,
  Route,
  getTheme,
  Redirect,
  IndexableObject
} from "./lib";
import { Header } from "./components/Header";
import Splashscreen from "./components/Splashscreen";
import Dark from "./lib/dark.json";
import Light from "./lib/light.json";
import dave from "./lib/dave.json";
import stylesJson from "./lib/getStyle";
import { useQuery } from "@apollo/react-hooks";
import { IMy } from "./lib/queries";
import dispatcher from "./lib/queries";
import Admin from "./components/Admin";
import ReactiveAdmin from "./components/ReactiveAdmin";
import IconSVG from "./logo";

export const setTheme = (themeString: string | undefined) => {
  switch (themeString) {
    case "dark":
      loadTheme(Dark);
      break;
    case "light":
      loadTheme(Light);
      break;
    case "dave":
      loadTheme(dave);
      break;
    default:
      loadTheme(Light);
  }
};
export const getCurrentApp = () => {
  return document.location.pathname.split("/")[1];
};
export const getStyle = () => mergeStyleSets(stylesJson(getTheme()));
const App: React.FC = () => {
  const { loading, data } = useQuery<IMy>(dispatcher.my);
  if (loading) {
    setTheme("light");
    return <Splashscreen Icon={IconSVG} />;
  }
  setTheme(`${data && data.my && data.my.settings && data.my.settings.theme}`);
  const style = getStyle();
  const frontEnd: IndexableObject = {
    Admin: Admin,
    "Reactive Admin": ReactiveAdmin
  };
  return (
    <Fabric
      key={`${data && data.my && data.my.settings && data.my.settings.theme}`}
      applyThemeToBody
    >
      <Route exact path={"/"} render={props => <Header />} />
      <Route
        path={"/:render"}
        render={props => {
          return props.match.params.render !== undefined &&
            props.match.params.render === "kiosk" ? (
            <></>
          ) : (
            <Header />
          );
        }}
      />

      <Switch>
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
                  const Component = frontEnd[app.frontEnd] || Empty;
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
                  const Component = frontEnd[app.frontEnd] || Empty;
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
