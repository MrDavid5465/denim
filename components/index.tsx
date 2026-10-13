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
  useMutation,
  useQuery
} from "../lib";
import { Header } from "./Header";
import Splashscreen from "./Splashscreen";
import { IApplication, IMy, UPDATE_SETTINGS, buildMyQuery } from "../lib/queries";
import IconSVG, { IconProps } from "../logo";
import { useHealthPoll } from "../lib/health";
import { IDenimSettings, readLocalSettings, writeLocalSettings } from "../lib/localSettings";
import { ISettingsTab } from "../lib/settingsExtensions";
import { THEMES } from "../themes";

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

// Drops nulls so an unset server field falls back to the default instead of
// overriding it with null.
function withoutNulls(obj: Record<string, any> | null | undefined) {
  const out: Record<string, any> = {};
  Object.entries(obj ?? {}).forEach(([k, v]) => {
    if (v !== null && v !== undefined) out[k] = v;
  });
  return out;
}

export interface DenimProps {
  /** Maps each application's `frontEnd` to the component rendered at `/<path>/*`. */
  components?: Record<string, React.ComponentType<any>>;
  /** Shown at `/` (and while `my` loads) instead of the launch-page redirect. */
  RootComponent?: React.ComponentType<any>;
  /** Theme builders keyed by `<mode>-<color>` plus `default`. Defaults to Denim's THEMES. */
  themes?: Record<string, (fontSize: number) => any>;
  Logo?: React.FC<IconProps>;
  Brand?: React.FC<any>;
  Controls?: React.FC<any>;
  ExternalApps?: React.FC<any>;
  /**
   * A static app list. When given, Denim does not query `my.applications`;
   * with settingsSource "local" as well, it sends no request at all.
   */
  applications?: IApplication[];
  /** Where chrome settings live: browser localStorage (default) or the backend's `my.settings`. */
  settingsSource?: "local" | "server";
  /** Initial values before anything is saved, e.g. `{ theme: "light-blue", launchPage: "projects" }`. */
  defaultSettings?: Partial<IDenimSettings>;
  /** Extra AppSettings fields selected in `my.settings` (settingsSource "server") for your settings tabs. */
  settingsFields?: string;
  /** Extra tabs in the Settings modal. */
  settingsTabs?: ISettingsTab[];
  /** Extra per-form fields appended to the Settings modal's General tab. */
  settingsGeneralFields?: Record<string, any>;
}

// Renders an app's `defaultRoute` redirect ONLY when the browser is actually
// at that app's root.
//
// The routes below are `${app.path}/*`, so their element renders for every
// route underneath them too. A bare <Navigate> there fired on deep links as
// well as on the root: opening /dashboards/dashboards/963/show redirected
// straight back to /dashboards/dashboards, making every dashboard
// unreachable.
//
// `replace` so a redirect that does fire doesn't leave the app root in history
// for Back to bounce off.
const AppDefaultRedirect: React.FC<{ path: string; defaultRoute: string }> = ({
  path,
  defaultRoute,
}) => {
  const { pathname } = useLocation();
  if (pathname.replace(/\/+$/, "") !== `/${path}`) return null;
  return <Navigate to={`/${path}/${defaultRoute}`} replace />;
};

const App: React.FC<DenimProps> = ({
  components = {},
  themes = THEMES,
  Logo = IconSVG,
  Brand,
  RootComponent,
  Controls,
  ExternalApps,
  applications: staticApplications,
  settingsSource = "local",
  defaultSettings,
  settingsFields = "",
  settingsTabs,
  settingsGeneralFields,
}) => {
  const serverSettings = settingsSource === "server";
  const queryApplications = !staticApplications;
  // Nothing to ask the backend: render immediately, no `my` request.
  const needsMy = queryApplications || serverSettings;
  const myQuery = React.useMemo(
    () => buildMyQuery({ applications: queryApplications, settings: serverSettings, settingsFields }),
    [queryApplications, serverSettings, settingsFields]
  );
  const myResult: any = useQuery(myQuery, { skip: !needsMy });
  const { loading, data } : { loading?: boolean, data?: IMy } = myResult;
  const refetch: () => void = myResult.refetch;
  const location = useLocation();
  const ready = !needsMy || !!data;

  // localStorage holds the settings in "local" mode, and in "server" mode
  // caches the last-seen ones so the first paint is already themed.
  const [localSettings, setLocalSettings] = React.useState<IDenimSettings>(() =>
    readLocalSettings(defaultSettings)
  );
  const serverValues = data?.my?.settings;
  const settings: IDenimSettings = React.useMemo(
    () =>
      serverSettings && serverValues
        ? { ...readLocalSettings(defaultSettings), ...withoutNulls(serverValues) }
        : localSettings,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serverSettings, serverValues, localSettings]
  );
  React.useEffect(() => {
    if (serverSettings && serverValues) {
      const { launchPage, theme, fontSize } = settings;
      writeLocalSettings({ launchPage, theme, fontSize });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSettings, serverValues]);

  const [updateSettings] = useMutation(UPDATE_SETTINGS, {
    // The settings object usually has no `id`, so Apollo can't merge the
    // mutation result into the cached `my`; refetch it instead.
    refetchQueries: [{ query: myQuery }],
    awaitRefetchQueries: true,
  });
  const handleSettingsChange = React.useCallback(
    async (values: Record<string, any>) => {
      if (serverSettings) {
        await updateSettings({ variables: { settings: values } });
      } else {
        const next = { ...localSettings, ...values };
        writeLocalSettings(next);
        setLocalSettings(next);
      }
    },
    [serverSettings, updateSettings, localSettings]
  );

  // Covers two related startup/reconnect races: the native app's frontend
  // webview loading before the backend has finished starting (this initial
  // `my` fetch fails outright, `loading` settles to false with no data, and
  // nothing would ever retry it on its own, so the splash screen would stay
  // forever), and a client whose connection drops mid-session. Only active
  // once the fetch has actually *finished* failing (`!loading && !data`),
  // not during the normal brief initial loading state.
  const stuckOnSplash = needsMy && !loading && !data;
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
  // component with no other reason to re-render stays frozen showing the
  // stale theme. forceRerender triggers exactly one more render, still
  // inside this same synchronous useLayoutEffect pass (so still before
  // paint, no visible flash), so *everything* picks up the freshly-loaded
  // theme together.
  //
  // Calling loadTheme directly in the render body sidesteps this bug but
  // trips React's "cannot update a component while rendering a different
  // component" warning once settings change live.
  React.useLayoutEffect(() => {
    setTheme(settings, themes);
    forceRerender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme, settings.fontSize]);

  const applications: IApplication[] =
    staticApplications ?? (data?.my?.applications as IApplication[] | undefined) ?? [];
  const my = { applications, settings };

  if (!ready) {
    // A `RootComponent` (e.g. a public site's homepage) stands in for the
    // generic splash screen while `my` is loading or unreachable: it should
    // render real content without needing the backend, so visitors see the
    // actual homepage from the first paint. Apps with no `RootComponent`
    // keep the plain splash screen.
    return RootComponent ? (
      // Same Fabric wrapper as the main render path below — without it the
      // theme (dark background etc.) never applies, since that's what
      // `applyTo="body"` actually does.
      <Fabric key={`${settings.theme}${settings.fontSize}`} applyTo="body">
        <RootComponent />
      </Fabric>
    ) : (
      <Splashscreen Icon={Logo} statusText={stuckOnSplash ? 'Waiting for server…' : undefined} />
    );
  }
  const style = getStyle();

  // `RootComponent` renders whenever no registered application's path is
  // active, which is also the "landing page, not a chrome-driven app" case,
  // so the header is hidden there rather than shown above a page never
  // designed to sit under one. Any real app path (e.g. "/projects") still
  // gets the header. Apps without a `RootComponent` are unaffected.
  const currentSegment = location.pathname.split("/")[1] || "";
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
                my={my}
                settings={settings}
                onSettingsChange={handleSettingsChange}
                settingsExtensions={{ settingsTabs, settingsGeneralFields }}
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
        {applications.map((app, i) => {
            const Empty: React.FC = () => <Stack />;
            return (
              <Route
                key={i}
                path={`${app.path}/*`}
                element={
                    <Stack className={style.content}>
                      {app.defaultRoute && (
                        <AppDefaultRedirect
                          path={app.path}
                          defaultRoute={app.defaultRoute}
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
        {applications.map((app, i) => {
            const Empty: React.FC = () => <Stack />;
            return (
              <Route
                key={i}
                // `/*`, matching the non-kiosk route above. Without it this
                // matched ONLY the app root, so every kiosk deep link
                // (/kiosk/dashboards/dashboards/963/show) fell through to the
                // catch-all and rendered the default app instead.
                //
                // Bare /kiosk/dashboards was broken by the same thing, less
                // obviously: it matched, then AppDefaultRedirect below sent it
                // to /kiosk/dashboards/dashboards, which an exact-match route
                // no longer matched — so the redirect walked it straight off
                // the route it had just arrived on.
                path={`/kiosk/${app.path}/*`}
                element={
                    <Stack className={style.content} style={{ top: "0em" }}>
                      {app.defaultRoute && (
                        <AppDefaultRedirect
                          path={`kiosk/${app.path}`}
                          defaultRoute={app.defaultRoute}
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
