import React from "react";
// import '../App.scss';
import "@fluentui/react";
import { useLocation } from "react-router-dom";
import {
  Fabric,
  getStyle,
  loadTheme,
  Stack,
  Route,
  Routes,
  Navigate,
  useQuery
} from "../lib";
import { Header } from "./Header";
import Splashscreen from "./Splashscreen";
import { IMy } from "../lib/queries";
import dispatcher from "../lib/queries";
import IconSVG, { IconProps } from "../logo";
import { useHealthPoll } from "../../../graphql/health";
import { ILocalSettings, readLocalSettings, writeLocalSettings } from "../lib/localSettings";

// Keeps the browser tab favicon in sync with the user's selected theme
// color. Rendered as a data URI rather than reusing /logo.svg because the
// desktop app icon (generated from that static file via `tauri icon`)
// can't be re-colored at runtime, but the favicon can and should track
// whichever of the 12 theme colors is currently active.
const FAVICON_SVG = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">` +
  `<path d="M 24 73 A 32 32 0 1 1 56 73 L 50 62 A 20 20 0 1 0 30 62 Z" fill="${color}"/>` +
  `<path d="M 42 44 L 41 48 L 38 46 L 32 22 Z" fill="${color}"/>` +
  `<circle cx="40" cy="45" r="3" fill="${color}"/>` +
  `</svg>`;

function setFaviconColor(color: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG(color))}`;
}

export const setTheme = (theme: any, themes: any) => {
  const key = (theme && theme.theme) || "default";
  const build = themes[key] || themes.default;
  const builtTheme = build(theme.fontSize || 1);
  loadTheme(builtTheme);
  if (builtTheme?.palette?.themePrimary) {
    setFaviconColor(builtTheme.palette.themePrimary);
  }
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
  ExternalApps
}) => {
  const myResult: any = useQuery(dispatcher.my);
  const { loading, data } : { loading?: boolean, data?: IMy } = myResult;
  const refetch: () => void = myResult.refetch;
  const location = useLocation();

  // Per-visitor chrome settings (theme, font size, launch page) live in
  // browser localStorage, not the `my` query — this is a public site with
  // anonymous visitors, so a backend-shared settings record would leak one
  // visitor's choice to everyone else (see `lib/localSettings.ts`).
  const [settings, setSettings] = React.useState<ILocalSettings>(() => readLocalSettings());
  const handleSettingsChange = React.useCallback((next: ILocalSettings) => {
    writeLocalSettings(next);
    setSettings(next);
  }, []);

  // Covers two related startup/reconnect races: the native app's frontend
  // webview loading before the Tauri-managed backend has finished starting
  // (this initial `my` fetch fails outright, `loading` settles to false with
  // no data, and nothing would ever retry it on its own — splash screen
  // stuck forever), and a client sitting on a non-dashboard page whose
  // connection drops mid-session for any reason. Only active once the fetch
  // has actually *finished* failing (`!loading && !data`), not during the
  // normal brief initial loading state.
  const stuckOnSplash = !loading && !data;
  useHealthPoll(stuckOnSplash, () => { refetch(); });
  // Bumped after every setTheme() call below to force one more render pass
  // — see the effect's own comment for why this is necessary, not optional.
  const [, forceRerender] = React.useReducer((n: number) => n + 1, 0);

  // Fluent's loadTheme (inside setTheme) mutates a module-level global theme
  // variable — it does NOT itself trigger React to re-render anything.
  // Components that read getTheme()/getStyle() imperatively during their own
  // render (Header, FormCard, etc., as opposed to Fluent's own components
  // that subscribe via context) only ever pick up the new value on their
  // *next* render. On the render that first sees new settings, this effect
  // hasn't run yet (useLayoutEffect fires after render, before paint), so
  // that render still uses the *old* global theme throughout — including
  // anything remounted by the <Fabric key=.../> change below. Once this
  // effect finally calls setTheme(), nothing forces a further render, so a
  // component with no other reason to re-render (Header has no props/state
  // that change; a few Fluent controls like Checkbox turned out to have the
  // same issue) stays frozen showing the stale theme snapshot indefinitely,
  // while something that happens to re-render again later for an unrelated
  // reason (e.g. ShakerMatrix's own subscriptions ticking) self-corrects and
  // makes the bug look inconsistent/partial rather than total. forceRerender
  // triggers exactly one more render, still inside this same synchronous
  // useLayoutEffect pass (so still before paint, no visible flash), so
  // *everything* picks up the freshly-loaded theme together.
  //
  // Calling loadTheme directly in the render body (as this used to do) sidesteps
  // this specific bug (the same render that reads getTheme() is the one after
  // loadTheme ran) but trips React's "cannot update a component while
  // rendering a different component" warning once settings actually change
  // live, without a page reload in between. Settings now come from
  // localStorage rather than a network round-trip, so this effect no longer
  // needs to branch on the `my` query's loading state — it's simpler than
  // before, not just relocated.
  React.useLayoutEffect(() => {
    setTheme(settings, themes);
    forceRerender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme, settings.fontSize]);

  if (loading || !data) {
    // A `RootComponent` (this app's `Home`) stands in for the generic
    // splash screen while `my` is loading or unreachable — it's built to
    // render real content (see its own doc comment) without needing the
    // backend at all, so visitors see the actual homepage from the first
    // paint rather than a spinner, and it's still what shows if the backend
    // never comes up. Denim consumers with no `RootComponent` (e.g.
    // typiql-tauri's desktop app, which has nothing meaningful to show
    // before `my` resolves) keep the plain spinner.
    return RootComponent ? (
      // Same Fabric wrapper as the main render path below — without it the
      // theme (dark background etc.) never applies, since that's what
      // `applyTo="body"` actually does; RootComponent would otherwise
      // render against the browser's plain unthemed default.
      <Fabric key={`${settings.theme}${settings.fontSize}`} applyTo="body">
        <RootComponent />
      </Fabric>
    ) : (
      <Splashscreen Icon={Logo} statusText={stuckOnSplash ? 'Waiting for server…' : undefined} />
    );
  }
  const style = getStyle();

  // The homepage renders as `RootComponent` (see App.tsx) whenever no
  // registered application's path is active — that's also exactly the
  // "landing page, not a chrome-driven app" case, so it hides the header
  // rather than showing it above a page that was never designed to sit
  // under one. Any real app path (e.g. "/projects") still gets the header.
  // `RootComponent`-less Denim consumers (e.g. typiql-tauri's desktop app)
  // are unaffected — this only fires when a caller actually passes one.
  const currentSegment = location.pathname.split("/")[1] || "";
  const applications = (data.my && data.my.applications) || [];
  const isRegisteredApp = applications.some((app: any) => app.path === currentSegment);
  const isKiosk = currentSegment === "kiosk";
  const showHeader = !isKiosk && (isRegisteredApp || !RootComponent);

  return (
    <Fabric
      key={`${settings.theme}${settings.fontSize}`}
      applyTo="body"
    >
      <Routes>
        <Route
          path={"kiosk/*"}
          element={
              <></>

          }
        />
        <Route
          path={"*"}
          element={
            showHeader ? (
              <Header
                my={data && data.my}
                settings={settings}
                onSettingsChange={handleSettingsChange}
                Brand={Brand}
                Controls={Controls}
                ExternalApps={ExternalApps}
              />
            ) : (
              <></>
            )
          }
        />
      </Routes>
      <Routes>
        <Route
          path={"*"}
          //exact
          element={
            <Stack className={style.content} style={!showHeader ? { top: "0em" } : undefined}>
              {RootComponent ? (
                <>
                  <RootComponent />
                </>
              ) : settings.launchPage ? (
                <Navigate to={`/${settings.launchPage}`} />
              ) : (
                <Stack>
                  <h1>Welcome, Click the waffle icon to begin!</h1>
                </Stack>
              )}
            </Stack>
          }
        />
        {data &&
          data.my &&
          data.my.applications &&
          data.my.applications.map((app, i) => {
            const Empty: React.FC = () => <Stack />;
            return (
              <Route
                key={i}
                path={`${app.path}/*`}
                element={
                    <Stack className={style.content}>
                      {app.defaultRoute && (
                        <Navigate to={`/${app.path}/${app.defaultRoute}`} />
                      )}
                      {React.createElement(components[app.frontEnd] || Empty, {
                        app
                      })}
                    </Stack>
                  
                }
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
                element={
                    <Stack className={style.content} style={{ top: "0em" }}>
                      {app.defaultRoute && (                    
                        <Navigate
                          to={`/kiosk/${app.path}/${app.defaultRoute}`}
                        />
                      )}
                      {React.createElement(components[app.frontEnd] || Empty, {
                        app
                      })}
                    </Stack>
                }
              />
            );
          })}
      </Routes>
    </Fabric>
  );
};

export default App;
