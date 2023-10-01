import React from "react";
// import '../App.scss';
import "@uifabric/icons";
import {
  Fabric,
  getStyle,
  loadTheme,
  Stack,
  Switch,
  Route,
  Redirect,
} from "../lib";
import { Header } from "./Header";
import Splashscreen from "./Splashscreen";
import { useQuery } from "@apollo/react-hooks";
import { IMy } from "../lib/queries";
import dispatcher from "../lib/queries";
import IconSVG, { IconProps } from "../logo";
import { Mutation } from "@apollo/react-components";
import gql from "graphql-tag";

export const setTheme = (theme: any, themes: any) => {
  loadTheme(themes[(theme && theme.theme) || "default"](theme.fontSize || 1));
};

interface Props {
  components?: any;
  RootComponent?: any;
  themes: any;
  Logo?: React.FC<IconProps>;
  Brand?: React.FC<any>;
  Controls?: React.FC<any>;
  ExternalApps?: React.FC<any>;
}
const App: React.FC<Props> = ({
  components = {},
  themes,
  Logo = IconSVG,
  Brand,
  RootComponent,
  Controls,
  ExternalApps,
}) => {
  const { loading, data, error } = useQuery<IMy>(dispatcher.my);
  if (loading) {
    setTheme({ theme: "default", fontSize: 1 }, themes);
    return <Splashscreen Icon={Logo} />;
  } else if (
    error &&
    process.env.REACT_APP_TYPICAL_SERVER_NAME == "localhost"
  ) {
    return (
      <Mutation
        mutation={gql`
          mutation login {
            login(username: "developer", password: "") {
              id
              userName
              firstName
              surname
            }
          }
        `}
      >
        {() => <></>}
      </Mutation>
    );
  }
  setTheme(
    (data && data.my && data.my.settings) || { theme: "default", fontSize: 1 },
    themes
  );
  const style = getStyle();
  return (
    <Fabric
      key={`${data && data.my && data.my.settings && data.my.settings.theme}${
        data?.my?.settings?.fontSize
      }`}
      applyThemeToBody
    >
      <Route
        exact
        path={"/"}
        render={() => (
          <Header
            my={data && data.my}
            Brand={Brand}
            Controls={Controls}
            ExternalApps={ExternalApps}
            themes={themes}
          />
        )}
      />
      <Route
        path={"/:render"}
        render={(props) => {
          return props.match.params.render !== undefined &&
            props.match.params.render === "kiosk" ? (
            <></>
          ) : (
            <Header
              my={data && data.my}
              Brand={Brand}
              Controls={Controls}
              ExternalApps={ExternalApps}
              themes={themes}
            />
          );
        }}
      />

      <Switch>
        <Route
          path={"/"}
          exact
          render={(props) => (
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
                render={(props) => {
                  const Component = components[app.frontEnd] || Empty;
                  return (
                    <Stack className={style.content}>
                      {app.defaultRoute && (
                        <Route
                          path={`/${app.path}`}
                          exact
                          render={() => (
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
                render={(props) => {
                  const Component = components[app.frontEnd] || Empty;
                  return (
                    <Stack className={style.content} style={{ top: "0em" }}>
                      {app.defaultRoute && (
                        <Route
                          path={`/kiosk/${app.path}`}
                          exact
                          render={() => (
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
