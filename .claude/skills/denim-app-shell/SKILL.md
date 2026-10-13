---
name: denim-app-shell
description: How to build a React app's shell with Denim (the app skeleton that sits on typical-admin-fabric, per-form and a typiql backend) - registering applications and their nav links, routes and deep links, theming (12 colours x light/dark/high-contrast, font size), the Settings modal and its extension point (settingsTabs, settingsGeneralFields, settingsFields), local vs server settings and the optional `my`/`updateSettings` server contract, the Photo/cropper component, quick-entry UX for data-entry apps, plain-http LAN pitfalls, and when to hand-roll instead. Use before creating a new app on this stack, adding an app/page to the nav, adding a setting, or touching the header, waffle menu, theme or Settings modal.
license: MIT
---

# Building an app shell with Denim

Denim renders the whole frame of an app: a fixed header with the current
app's name and sub-page links, a waffle (app switcher) panel listing every
application, a Settings modal, Fluent theming applied to `<body>`, a splash
screen while the backend answers, and one route per application. Your code
supplies the applications' components; CRUD screens inside them are
ReactiveAdmin (read `typical-admin-fabric/.claude/skills/reactive-admin`).

Folder layout is fixed: Denim imports its siblings by relative path, so clone
`denim`, `typical-admin`, `typical-admin-fabric` and `per-form` side by side
(e.g. `src/lib/denim`, `src/lib/typical-admin-fabric`, ...). See the README
for peer packages and the full minimal app.

## 1. Mount it

```tsx
// main.tsx: providers. Denim reads Apollo from <ApolloProvider>; it never
// imports your client.
<ApolloProvider client={client}>
  <MergedSubscriptionProvider>        {/* typical-admin: one subscription connection */}
    <BrowserRouter>
      <App />
      <ConfirmDialogHost />           {/* typical-admin-fabric/ConfirmDialog */}
    </BrowserRouter>
  </MergedSubscriptionProvider>
</ApolloProvider>

// App.tsx
import Denim from './lib/denim';
export default function App() {
  return <Denim components={{ projects: ProjectsApp, tasks: TasksApp }} />;
}
```

- Don't wrap Denim in your own `ThemeProvider` or call `loadTheme`; Denim
  owns the theme (section 4). Importing Denim also calls Fluent's
  `initializeIcons()`, so don't call it again.
- Use `BrowserRouter`. Denim's `getCurrentApp()` reads
  `document.location.pathname`, so under `HashRouter` the waffle panel
  doesn't expand the current app.
- Denim can be the element of a `<Route path="/*">` or rendered directly
  under the router; both work.

## 2. Register applications (nav + routes)

An **application** is one entry in the waffle panel and one top-level route:

```ts
interface IApplication {
  name: string;          // label in the waffle panel and the header
  path: string;          // URL segment: the app owns /<path>/*
  defaultRoute: string;  // /<path> redirects to /<path>/<defaultRoute>; "" for none
  frontEnd: string;      // key into <Denim components={{ ... }}>
  links: { path: string; text: string }[];  // sub-pages, /<path>/<link.path>
}
```

Two sources, pick one:

- **Static** (`<Denim applications={[...]} />`): the list lives in the
  frontend. No backend contract needed. Best for a single-purpose app.
- **Backend** (omit `applications`): Denim queries `my { applications {...} }`.
  Use it when the list differs per user/role or is edited at runtime (e.g. an
  `Application` typiql type, see the README's server contract).

Either way, adding a page takes **both** a link entry and a route in the
component that renders it; one without the other is unreachable or a dead
link.

What Denim renders for each application:

| URL | Renders |
|---|---|
| `/<path>/*` | header + `components[frontEnd]` with prop `{ app }`, below the fixed header |
| `/<path>` exactly, with `defaultRoute` | `<Navigate replace>` to `/<path>/<defaultRoute>` (deep links below are left alone) |
| `/kiosk/<path>/*` | the same component with no header (wall displays, embeds) |
| `/` | `RootComponent` if given, else a redirect to the `launchPage` setting, else "Welcome" text |
| anything else | the `/` content; there is no 404 route |

The component nests its own routes **relative** to `/<path>`:

```tsx
// Registered as { name: 'Projects', path: 'projects', frontEnd: 'projects',
//   defaultRoute: '', links: [{ path: 'board', text: 'Board' }] }
export default function ProjectsApp() {
  return (
    <Routes>
      <Route path="board" element={<ProjectBoard />} />
      {/* ReactiveAdmin owns list/new/:id/show/:id/edit under /projects */}
      <Route path="*" element={<ProjectsAdmin />} />
    </Routes>
  );
}
```

`RootComponent` (e.g. a public site's homepage) also stands in for the splash
screen while `my` loads, and the header is hidden on any path that isn't a
registered application, so a landing page doesn't sit under app chrome.

Other props: `Logo` (splash screen), `Brand` (icon next to the waffle),
`Controls` (right side of the header; also replaces the narrow-screen menu
button), `ExternalApps` (extra content at the top of the waffle panel).

## 3. Settings: where they live

Denim's own settings are `theme` (`"<mode>-<color>"`, e.g. `dark-teal`),
`fontSize` (1, 1.14, 1.29) and `launchPage`. `settingsSource` decides where:

| | `"local"` (default) | `"server"` |
|---|---|---|
| Stored in | this browser's `localStorage` (`denim-settings`) | the backend: `my.settings`, saved with `updateSettings` |
| Backend needs | nothing | the settings half of the README's contract |
| Right for | public sites (anonymous visitors), single-user tools, prototypes | settings shared by every device of an installation or account |

`defaultSettings={{ theme: 'light-blue', launchPage: 'projects' }}` sets the
values before anything is saved.

The Settings modal is for **global, cross-cutting preferences** (theme, units,
this device's name). A feature's own configuration, however small, gets its
own application or page instead of a Settings tab.

## 4. Theming

- `<Denim>` loads the theme for the current `theme`/`fontSize` with Fluent's
  `loadTheme` and applies it to `<body>`; the favicon follows the theme
  colour. The default `themes` prop is Denim's `THEMES`: 12 colours x
  `light`/`dark`/`hc`, plus `default` (= `dark-red`).
- In your components read colours from the theme, never hard-code them:
  `getTheme().palette.themePrimary`, `.neutralLight`, `.white` (the page
  background, dark in dark mode), `theme.semanticColors.*`. Inside Fluent
  components prefer `useTheme()`. See `hand-rolled-components`.
- A custom `themes` map must keep the `<mode>-<color>` keys (`themeKey()`,
  `parseThemeKey()`, `COLOR_KEYS`, `MODE_KEYS` are exported), because the
  Settings modal's Colour/Theme pickers build the key that way. Each value is
  `(fontSize: number) => IPartialTheme`; Denim's `buildTheme(mode, color)`
  shows the shape.
- `getStyle()` returns Denim's shared class names (`content`, `modalHeader`,
  `modalBody`, ...) for the current theme.

## 5. Extending the Settings modal

Denim owns the General tab. An app adds to it in three ways:

```tsx
import Denim, { ISettingsTab, ISettingsTabProps } from './lib/denim';
import { Form } from './lib/denim/lib';      // typical-admin-fabric's per-form Form

// (a) Extra fields on the General tab: a per-form schema (see form-schema).
const generalFields = {
  units: { type: 'select', label: 'Units', defaultValue: 'metric',
           options: [{ text: 'Metric', value: 'metric' }, { text: 'Imperial', value: 'imperial' }] },
};

// (b) A whole tab.
function DeviceTab({ settings, onChange, registerSave }: ISettingsTabProps) {
  const [name, setName] = useState<string>(settings.deviceName ?? '');
  useEffect(() => {
    // Merged into the one save; isValid=false blocks Save and shows the message.
    onChange({ deviceName: name }, name.length <= 40, 'Device name: 40 characters at most.');
    // Optional: side effects after the settings are saved (your own mutations).
    registerSave(async () => { /* e.g. await renameDevice({ variables: { name } }) */ });
  }, [name]);
  return (
    <Form name="device" form={{ deviceName: { type: 'text', label: 'Device name' } }}
          initialValues={{ deviceName: name }}
          onChange={(_n: string, { clean }: any) => setName(clean.deviceName)} />
  );
}
const settingsTabs: ISettingsTab[] = [{ key: 'device', headerText: 'Device', Component: DeviceTab }];

// (c) settingsFields: with settingsSource="server", the extra AppSettings
// fields to select in my.settings so tabs can read them.
<Denim settingsSource="server" settingsFields="units deviceName"
       settingsGeneralFields={generalFields} settingsTabs={settingsTabs} ... />
```

How saving works:

- Save merges General's values and every tab's latest `onChange` patch into
  one object. Local: written to `localStorage` (extra keys included). Server:
  sent as `updateSettings(settings: {...})`, then `my` is refetched; every key
  must therefore exist on the backend's `AppSettingsInput`.
- Then each `registerSave` callback runs in tab order. A thrown error shows
  next to Save and keeps the modal open.
- Fluent's Pivot unmounts inactive tabs. Patches and save callbacks survive
  that, so keep a tab's state in what you report, not only in its component.
- Server mode: `settings` includes Apollo's `__typename`, also on nested
  objects. Strip it from anything you send back; input types reject it.
- Don't share one `onChange` handler between two per-form `Form`s with
  different fields (a field missing from one reads as cleared).

## 6. Photo (image picker + cropper)

```tsx
import Photo from './lib/denim/components/Photo';

<Photo
  id={project.id}                    // download file name
  image={project.coverPhoto ?? ''}   // base64 PNG/JPEG, WITHOUT the data: prefix
  icon="image"                       // or "user": placeholder icon when empty
  submit={(base64: string) =>        // the saved image (PNG base64), '' on remove
    updateProject({ variables: { id: project.id, update: { coverPhoto: base64 || null } } })}
/>
```

- Drop or pick a JPEG/PNG up to 500 kB; EXIF orientation is corrected; Crop,
  then Save, calls `submit`. Existing images get crop/download/delete buttons.
- It needs `react-image-crop`, `react-dropzone` and `exif-js`, and imports
  `react-image-crop/dist/ReactCrop.css` itself.
- It never talks to the server. Store the base64 in a typiql field (a
  `String`), or in a `Location::At` per-record file type for large images.
- For an image field inside a form, use per-form's `image-upload` type
  instead (see `form-schema`).

## 7. Quick entry in data-entry apps

When users enter many records in a row (tasks, time entries, readings),
don't send each one through ReactiveAdmin's full-page `/new` route and back:
testing found that bouncing through create/show pages per entry is slow. Offer
an add **over the current page** instead, and keep the list visible:

- A pop-up (Fluent `Panel` or `Modal`) or an inline row above the list,
  opened by one button or a shortcut.
- Focus the first field on open.
- Pre-fill sensible defaults: today's date, the project currently filtered
  to, the last-used category (per-form `defaultValue`, or `initialValues`).
- Save on Enter, then clear and refocus for the next entry; Escape closes.
  The list updates through the type's `xChanged` subscription.

```tsx
function QuickAddTask({ projectId }: { projectId: string }) {
  const formRef = useRef<IFormRef>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);                       // remount = clear
  const [addTask] = useMutation(ADD_TASK);
  useEffect(() => {
    boxRef.current?.querySelector<HTMLElement>('input, textarea')?.focus();
  }, [key]);
  const save = async () => {
    if (!formRef.current?.isValid) return;
    await addTask({ variables: { values: { ...formRef.current.submit(), projectId } } });
    setKey(k => k + 1);
  };
  return (
    <div ref={boxRef} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); } }}>
      <Form key={key} ref={formRef} name="quickTask"
            form={{ title: { type: 'text', label: 'Title', required: true },
                    due: { type: 'date', label: 'Due', defaultNull: null } }}
            initialValues={{ due: new Date().toISOString().slice(0, 10) }} />
    </div>
  );
}
```

(`IFormRef` and `Form` come from `typical-admin-fabric/lib/templates/Form`.)
Keep ReactiveAdmin's own show/edit routes for the occasional full edit.

## 8. Plain http on the LAN is not a secure context

Opening the app as `http://192.168.x.x:5173` (a phone, another PC) is not a
[secure context](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts);
only `https://` and `http://localhost` are. There, `crypto.randomUUID`,
`crypto.subtle`, `navigator.clipboard`, service workers and some device APIs
are `undefined`, and code that calls them throws only on other devices.

- Let typiql generate record keys (it does; never generate keys client-side).
- For a client-side id (a device id, a temporary row key), fall back to
  `crypto.getRandomValues`, which works without a secure context:

  ```ts
  export function uuid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && window.isSecureContext) {
      return crypto.randomUUID();
    }
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
  ```
- Guard clipboard buttons with `window.isSecureContext`, or serve over https.
- Point the GraphQL URL at `window.location.hostname` (or a same-origin
  proxy), never `localhost`, so other devices reach the backend.

## 9. When to hand-roll instead

- **A CRUD screen**: never hand-roll; ReactiveAdmin (override one slot if you
  must).
- **A one-off visual component** (card, status strip, dashboard tile): build
  it from Fluent primitives and theme tokens per `hand-rolled-components`, and
  mount it inside an application's component.
- **A page with no app chrome** (a landing page, a kiosk display): use
  `RootComponent` or the `/kiosk/<path>` route, not a second router outside
  Denim.
- **A different header, nav or Settings layout**: Denim is consumed as
  source, so change it in the denim repo for every app, rather than forking a
  copy into one app. Prefer the props and extension points above first.
- **Not part of Denim's job**: auth, data fetching for your pages, and
  per-feature config. Denim's `lib/index.ts` re-exports some Fluent,
  react-router and typical-admin-fabric pieces for convenience; import from
  the original packages when in doubt.

## Exports at a glance

`import Denim, { ... } from './lib/denim'`: `Denim`, `DenimProps`, `THEMES`,
`buildTheme`, `themeKey`, `parseThemeKey`, `COLOR_KEYS`, `MODE_KEYS`,
`IApplication`, `ILink`, `IDenimSettings`, `DEFAULT_SETTINGS`,
`ISettingsTab`, `ISettingsTabProps`, `buildMyQuery`, `UPDATE_SETTINGS`,
`useHealthPoll`, `HeaderLink`, `getStyle`, `getCurrentApp`, `Logo`.
Components by path: `components/Photo`, `components/ConfirmDialog` (an older
copy of typical-admin-fabric's; mount and call one of them consistently, as
each has its own `confirmAsync` singleton), `components/Splashscreen`.
`components/Admin` (an application-config admin) is commented-out legacy
code and does nothing.
