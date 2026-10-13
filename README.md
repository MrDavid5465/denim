# denim

The Denim app skeleton: UI component library, routing and theming for React
apps built on the typiql stack. Denim renders the frame of an app so the app
only writes its pages:

- a fixed **header** with the current application's name and its sub-page
  links (a slide-out menu on narrow screens);
- a **waffle** app switcher listing every application and its links;
- a **Settings** modal (theme colour and mode, font size, launch page) with an
  extension point for the app's own settings;
- **theming**: 12 colours x light / dark / high contrast, applied to the whole
  page through Fluent UI v8, with the favicon following the colour;
- **routing**: one route per application at `/<path>/*`, an optional
  homepage, a header-less `/kiosk/<path>/*` variant, and safe default-route
  redirects that leave deep links alone;
- a **splash screen** that waits for the backend and recovers when it comes
  up;
- a **Photo** picker/cropper, a confirm dialog and small utilities.

Pages inside an application are normally
[typical-admin-fabric](../typical-admin-fabric)'s `ReactiveAdmin` CRUD
screens over a [typiql-rs](../typiql-rs) backend, with
[per-form](../per-form) for forms.

Consumed as source (no build step, no npm package).

## Using with an AI coding agent

Before writing any code with Denim, read its skill,
[`.claude/skills/denim-app-shell/SKILL.md`](./.claude/skills/denim-app-shell/SKILL.md):
registering applications and nav links, routes, theming, settings and the
Settings extension point, Photo, quick-entry UX, plain-http LAN pitfalls,
and when to hand-roll instead.

Then the siblings' skills:

- typiql-rs `.claude/skills/typiql-api`: the backend, types and generated GraphQL names
- typical-admin-fabric `.claude/skills/`:
  - `reactive-admin`: CRUD screens, slot overrides, live updates
  - `form-schema`: form field types and properties
  - `list-schema`: list/show columns and list components
  - `hand-rolled-components`: one-off components from Fluent primitives
  - `playwright-verify`: checking the running app in headless Chromium

Skills in a cloned repository are not loaded automatically unless the agent
was started inside that repository, so open the `SKILL.md` files directly.

## Layout: clone the libraries side by side

Denim imports its siblings by relative path (`../typical-admin-fabric`,
`../per-form`), and they import each other the same way, so all four must be
sibling folders:

```
your-app/src/lib/denim/
your-app/src/lib/typical-admin/
your-app/src/lib/typical-admin-fabric/
your-app/src/lib/per-form/
```

Get them from:

- file:///var/mnt/Media/david-source/repos/typiql-standins/denim
- file:///var/mnt/Media/david-source/repos/typiql-standins/typical-admin
- file:///var/mnt/Media/david-source/repos/typiql-standins/typical-admin-fabric
- file:///var/mnt/Media/david-source/repos/typiql-standins/per-form

```sh
cd your-app/src/lib
git clone file:///var/mnt/Media/david-source/repos/typiql-standins/denim
git clone file:///var/mnt/Media/david-source/repos/typiql-standins/typical-admin
git clone file:///var/mnt/Media/david-source/repos/typiql-standins/typical-admin-fabric
git clone file:///var/mnt/Media/david-source/repos/typiql-standins/per-form
```

(or add them as git submodules at those paths). The backend,
[typiql-rs](file:///var/mnt/Media/david-source/repos/typiql-standins/typiql-rs),
is a Rust dependency; see its README.

## Peer npm packages

Versions known to work together:

```bash
npm i react@^18.3.1 react-dom@^18.3.1 \
  @fluentui/react@^8.125.6 \
  @apollo/client@^4.2.3 graphql@^16.14.2 rxjs@^7.8.2 \
  react-router@^7.17.0 react-router-dom@^7.17.0 \
  match-sorter@^8.3.0 date-fns@^4.4.0 \
  react-image-crop@^11.0.10 react-dropzone@^15.0.0 exif-js@^2.3.0
npm i -D typescript@~5.6.2 vite@^6 @vitejs/plugin-react@^4.3.4 \
  @types/react@^18.3.1 @types/react-dom@^18.3.1
```

- This is typical-admin-fabric's list plus three packages for Denim's
  `Photo` component (`react-image-crop`, `react-dropzone`, `exif-js`). They
  are needed to type-check the folder even if you never render `Photo`.
- `@fluentui/react-hooks` and `graphql-tag` come in with `@fluentui/react`
  and `@apollo/client`; don't install them.
- TypeScript needs Vite's client types: `"types": ["vite/client"]` in
  `tsconfig.json`. Everything type-checks under Vite's default strict
  `tsconfig` (`strict`, `noUnusedLocals`, `noUnusedParameters`).

## Minimal app

A Vite + React + TypeScript app with a Denim shell, nav from the backend, and
one ReactiveAdmin CRUD screen inside it. The backend is the typiql app in
[Server contract](#server-contract) below, which also defines the `Project`
type:

```rust
#[typiql_type]
pub struct Project {
    #[typiql(key)]
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub priority: Option<i32>,
    pub archived: Option<bool>,
}
```

**`vite.config.ts`**: proxy the GraphQL endpoint so it is same-origin in dev.

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/typiql': 'http://localhost:4123' },
  },
});
```

**`src/apollo.ts`**

```ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// typiql serves queries, mutations and subscriptions on one POST endpoint;
// HttpLink handles its multipart subscriptions on its own.
export const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL ?? '/typiql/graphql' }),
  cache: new InMemoryCache(),
});
```

**`src/main.tsx`**: Denim takes the Apollo client from `<ApolloProvider>`;
it never imports your client file.

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { ConfirmDialogHost } from './lib/typical-admin-fabric/ConfirmDialog';
import { MergedSubscriptionProvider } from './lib/typical-admin/MergedSubscriptions';
import { client } from './apollo';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      {/* One subscription connection for every mounted ReactiveAdmin screen. */}
      <MergedSubscriptionProvider>
        <BrowserRouter>
          <App />
          <ConfirmDialogHost />
        </BrowserRouter>
      </MergedSubscriptionProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
```

- No `ThemeProvider`, `loadTheme` or `initializeIcons()` here: Denim applies
  the theme to `<body>` itself, and importing it registers Fluent's icons.
- `MergedSubscriptionProvider` (typical-admin) merges every mounted live
  subscription into one connection; without it, a few open screens can use
  up the browser's ~6 connections per origin and stall requests.
- `<ConfirmDialogHost />` serves `confirmAsync()`, used by the list delete
  buttons.
- Use `BrowserRouter`; see the skill for why not `HashRouter`.

**`src/App.tsx`**: the whole shell.

```tsx
import Denim from './lib/denim';
import ProjectsAdmin from './admin/ProjectsAdmin';

// Denim is the whole shell: header, waffle menu, Settings, theming, and one
// route per application at /<path>/*. `components` maps each application's
// `frontEnd` (from the backend's my.applications) to its component.
export default function App() {
  return (
    <Denim
      settingsSource="server"
      components={{ projects: ProjectsAdmin }}
    />
  );
}
```

**`src/admin/ProjectsAdmin.tsx`**: the CRUD screen (see the `reactive-admin`
skill for every part of it).

```tsx
import { gql } from '@apollo/client';
import ReactiveAdmin from '../lib/typical-admin-fabric';
import type { ITASchema, IDispatcher } from '../lib/typical-admin';

const FIELDS = 'id name description priority archived';

const dispatcher: IDispatcher = {
  list: gql`query getProjects { getProjects { ${FIELDS} } }`,
  show: gql`query getProject($id: String!) { getProject(id: $id) { ${FIELDS} } }`,
  new: gql`mutation addProject($values: ProjectInput!) { addProject(values: $values) { ${FIELDS} } }`,
  edit: gql`mutation updateProject($id: String!, $update: ProjectInput!) { updateProject(id: $id, update: $update) { ${FIELDS} } }`,
  delete: gql`mutation removeProject($id: String!) { removeProject(id: $id) { id } }`,
  subscribe: gql`subscription projectChanged { projectChanged { operationName value { id } } }`,
  subscribeToOne: gql`subscription projectChanged($id: String) { projectChanged(id: $id) { operationName value { id } } }`,
};

const display = {
  name: { label: 'Name' },
  priority: { label: 'Priority', options: { minWidth: 60, maxWidth: 80 } },
};

const form = {
  name: { type: 'text', label: 'Name', required: true },
  description: { type: 'text', label: 'Description', multiline: true, defaultNull: null },
  priority: { type: 'number', label: 'Priority', defaultNull: null },
  archived: { type: 'checkbox', label: 'Archived', defaultValue: false },
};

const schemaDefinition: ITASchema = {
  list: { columns: display, buttons: { add: true } },
  show: { ...display, description: { label: 'Description' } },
  new: form,
  edit: form,
};

// Mounted by Denim at /projects/*; ReactiveAdmin nests its own routes there.
export default function ProjectsAdmin() {
  return (
    <ReactiveAdmin
      dispatcher={dispatcher}
      name={{ singular: 'Project', plural: 'Projects' }}
      schemaDefinition={schemaDefinition}
    />
  );
}
```

### Without a backend contract

Denim needs nothing from the backend if the app list is static and settings
stay in the browser. Only `App.tsx` changes; Denim then sends no request of
its own (your pages still query their data):

```tsx
import Denim, { IApplication } from './lib/denim';
import ProjectsAdmin from './admin/ProjectsAdmin';

const applications: IApplication[] = [
  {
    name: 'Projects',
    path: 'projects',
    defaultRoute: '',
    frontEnd: 'projects',
    links: [{ path: 'new', text: 'New project' }],
  },
];

export default function App() {
  return (
    <Denim
      applications={applications}
      components={{ projects: ProjectsAdmin }}
      defaultSettings={{ theme: 'light-blue', launchPage: 'projects' }}
    />
  );
}
```

`settingsSource` defaults to `"local"`. A public site with a homepage passes
`RootComponent={Home}`: it renders at `/` (and while `my` loads) with no
header, and the header appears on the application routes.

Both versions of this app type-check with the packages above and were run in
headless Chromium against the backend below: shell and nav render, the
ReactiveAdmin list loads, the Settings modal opens and saves (server and
local), a settings tab saves (server and local) and an extra General field
saves (local), the
splash screen recovers when the backend starts late, and there are no
console errors.

## `<Denim>` props

| Prop | Default | What it does |
|---|---|---|
| `components` | `{}` | `frontEnd` key -> component rendered at `/<path>/*`, given `{ app }` |
| `applications` | from `my.applications` | static app list; when set, `my.applications` is not queried |
| `settingsSource` | `"local"` | `"local"`: localStorage. `"server"`: `my.settings` + `updateSettings` |
| `defaultSettings` | `{ theme: 'default', fontSize: 1, launchPage: '' }` | values before anything is saved |
| `settingsFields` | `""` | extra `AppSettings` fields to select (server mode), for your settings tabs |
| `settingsTabs` | `[]` | extra Settings tabs, `{ key, headerText, Component }` |
| `settingsGeneralFields` | none | extra per-form fields on the General tab |
| `themes` | `THEMES` | theme builders keyed `<mode>-<color>` plus `default` |
| `RootComponent` | none | the `/` page (also shown while `my` loads); hides the header off app routes |
| `Logo`, `Brand`, `Controls`, `ExternalApps` | | splash logo, header icon, header right side, top of the waffle panel |

The Settings extension point (`settingsTabs`, `settingsGeneralFields`,
`settingsFields`) is documented with an example in the skill, section 5.

## Server contract

Every part is optional. What Denim asks for depends on its props:

| Denim needs | When | GraphQL |
|---|---|---|
| nothing | `applications` given and `settingsSource="local"` | none |
| the app list | `applications` not given | `my { applications { name path defaultRoute frontEnd links { path text } } }` |
| settings | `settingsSource="server"` | `my { settings { launchPage theme fontSize <settingsFields> } }` and `updateSettings(settings: AppSettingsInput!)` |

The exact shapes:

```graphql
type Query {
  my: My!
}

type My {
  applications: [Application!]!   # only if Denim queries the app list
  settings: AppSettings           # only for settingsSource="server"; null = defaults
}

type Application {
  name: String!
  path: String!          # URL segment, /<path>/*
  defaultRoute: String!  # "" for none
  frontEnd: String!      # key into <Denim components>
  links: [AppLink!]!
}

type AppLink { path: String!  text: String! }

type AppSettings {        # nullable fields fall back to defaultSettings
  launchPage: String
  theme: String           # "<mode>-<color>", e.g. "dark-teal"
  fontSize: Float
  # ...plus anything your settings tabs read (settingsFields)
}

type Mutation {
  # Patch semantics: omitted fields are left alone. The input type MUST be
  # named AppSettingsInput; the argument may be nullable or not. It may
  # return any object type: Denim selects only __typename, then refetches my.
  updateSettings(settings: AppSettingsInput!): My!
}
```

Denim also exports `uploadFile` / `getFileBase64` documents
(`denimDispatcher.upload`, `.getFile`) for apps that use them; Denim itself
never sends them, so they are not part of the contract.

### Implementing it on typiql-rs

`Application` and `AppSettings` are ordinary typiql types, so they also get
the generated CRUD API (an admin screen for the app list is just a
ReactiveAdmin over `Application`). Only `my` (a combined view) and
`updateSettings` (patch the single settings record, creating it on first
save) are hand-written.

**`Cargo.toml`** (typiql-rs cloned next to the app):

```toml
[dependencies]
typiql = { package = "typiql-core", path = "../typiql-rs/crates/typiql-core" }
typiql-adapter-json = { path = "../typiql-rs/crates/typiql-adapter-json" }
async-graphql = "7"
tokio = { version = "1", features = ["rt-multi-thread", "macros", "net"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
axum = "0.8"
```

**`src/denim_contract.rs`**

```rust
#![allow(clippy::too_many_arguments)]

use async_graphql::{Context, Object, Result, SimpleObject};
use typiql::{resolve_list, resolve_upsert, typiql_type, TypiQLBroker};

/// One sub-page link of an application (`/<app.path>/<link.path>`).
#[derive(
    async_graphql::SimpleObject, async_graphql::InputObject,
    serde::Serialize, serde::Deserialize, Clone, Debug, Default,
)]
#[graphql(input_name = "AppLinkInput")]
pub struct AppLink {
    pub path: String,
    pub text: String,
}

/// One entry in the waffle menu / one top-level route.
#[typiql_type]
pub struct Application {
    #[typiql(key)]
    pub id: String,
    pub name: String,
    /// URL segment: the app lives at `/<path>/*`.
    pub path: String,
    /// Sub-path `/<path>` redirects to; "" for none.
    pub default_route: String,
    /// Key into <Denim components={{ … }}>.
    pub front_end: String,
    pub links: Vec<AppLink>,
    /// Menu order (not part of Denim's contract).
    pub position: i64,
}

/// The settings record. Denim reads launchPage/theme/fontSize; add your
/// app's own fields here and select them with <Denim settingsFields="…">.
#[typiql_type]
pub struct AppSettings {
    #[typiql(key)]
    pub id: String,
    pub launch_page: Option<String>,
    pub theme: Option<String>,
    pub font_size: Option<f64>,
}

#[derive(SimpleObject)]
pub struct My {
    pub applications: Vec<Application>,
    pub settings: Option<AppSettings>,
}

async fn load_my(ctx: &Context<'_>) -> Result<My> {
    let mut applications = resolve_list::<Application>(ctx, vec![]).await?;
    applications.sort_by_key(|a| a.position);
    // One settings record for the whole app. Scope it with a user_id filter
    // once you have users.
    let settings = resolve_list::<AppSettings>(ctx, vec![]).await?.into_iter().next();
    Ok(My { applications, settings })
}

#[derive(Default)]
pub struct DenimQuery;

#[Object]
impl DenimQuery {
    async fn my(&self, ctx: &Context<'_>) -> Result<My> {
        load_my(ctx).await
    }
}

#[derive(Default)]
pub struct DenimMutation;

#[Object]
impl DenimMutation {
    /// Patch the single settings record, creating it on first save.
    async fn update_settings(&self, ctx: &Context<'_>, settings: AppSettingsInput) -> Result<My> {
        // No filters: the first (only) row, or a new one with upsert = true.
        if let Some(row) = resolve_upsert::<AppSettings>(ctx, vec![], settings, vec![], vec![], true).await? {
            // Hand-written writes don't publish on their own.
            TypiQLBroker::publish(AppSettingsChanged { operation_name: "update".into(), value: row });
        }
        load_my(ctx).await
    }
}
```

**`src/main.rs`**: register the types and roots, and seed the app list once.

```rust
use std::{collections::HashMap, sync::Arc};
use typiql::{typiql_schema, typiql_type, AdapterMap, TypiQLAdapter, TypiQLType};
use typiql_adapter_json::JsonAdapter;

mod denim_contract;
use denim_contract::*;

#[typiql_type]
pub struct Project {
    #[typiql(key)]
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub priority: Option<i32>,
    pub archived: Option<bool>,
}

typiql_schema!(Project, Application, AppSettings; DenimQuery; DenimMutation);

/// Seed the app list once (an empty table), so the waffle menu has entries.
async fn seed_applications(adapter: &Arc<dyn TypiQLAdapter>) {
    let loc = || Application::collection_name().into();
    if !adapter.get_many(loc(), vec![]).await.is_empty() {
        return;
    }
    let apps = [
        serde_json::json!({ "name": "Projects", "path": "projects", "default_route": "",
            "front_end": "projects", "position": 1,
            "links": [ { "path": "", "text": "All projects" }, { "path": "new", "text": "New project" } ] }),
    ];
    for app in apps {
        adapter.add(loc(), Application::key_field(), app).await.expect("seed");
    }
}

#[tokio::main]
async fn main() {
    let data_dir = std::env::var("DATA_DIR").unwrap_or_else(|_| "data".into());
    let port = std::env::var("PORT").unwrap_or_else(|_| "4123".into());
    let adapter: Arc<dyn TypiQLAdapter> = Arc::new(JsonAdapter::new(&data_dir));
    seed_applications(&adapter).await;

    let mut adapters: AdapterMap = HashMap::new();
    adapters.insert("default", adapter);
    let schema = build_typiql_schema(adapters);

    let app = axum::Router::new().nest("/typiql", typiql::typiql_router(schema, "/typiql/graphql"));
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

This backend compiles against typiql-rs and served the verification runs
above. Variations:

- **A fixed app list in code**: make `Application` a plain
  `#[derive(SimpleObject)]` struct and return a `vec![...]` from `my`; no
  storage or seeding.
- **Per-user settings**: add a `user_id` field to `AppSettings` and filter on
  it in `load_my` and `resolve_upsert` (the `identify` argument).
- **More settings**: add fields to `AppSettings` (they appear in
  `AppSettingsInput` automatically) and list them in `settingsFields`.

## What's in here

| Path | What it is |
|---|---|
| `index.ts` | `Denim` (default export) and the public exports |
| `components/index.tsx` | the shell: `my` query, settings source, theme loading, routes |
| `components/Header/` | header, `NavBar` (current app's links), `AppNavBar` (waffle panel), `Settings/` modal |
| `components/Splashscreen/` | splash screen shown while `my` loads |
| `components/Photo/` | image picker with EXIF rotation, cropper, download and remove |
| `components/ConfirmDialog.tsx` | an older copy of typical-admin-fabric's `confirmAsync()` + host (see Known issues) |
| `components/Admin/` | an application-config admin; commented-out legacy code, not functional |
| `themes/` | `THEMES` (12 colours x 3 modes), `buildTheme`, `themeKey`, `parseThemeKey` |
| `lib/queries.ts` | the contract's documents: `buildMyQuery`, `UPDATE_SETTINGS`; types |
| `lib/localSettings.ts` | `IDenimSettings`, localStorage read/write, defaults |
| `lib/settingsExtensions.ts` | `ISettingsTab`, `ISettingsTabProps` |
| `lib/health.ts` | `useHealthPoll`: retries the backend through the Apollo client |
| `lib/index.ts` | convenience re-exports (Fluent, react-router, Apollo hooks, typical-admin-fabric `Form`/`List`/cards), `getStyle()` |
| `lib/getStyle.ts`, `lib/light.ts`, `lib/dark.ts` | shared class names; two older single themes |

## Known issues

- `components/ConfirmDialog.tsx` is a separate copy of typical-admin-fabric's
  `ConfirmDialog`, with its own module-level singleton. `confirmAsync()` from
  one is only served by the `<ConfirmDialogHost />` from the same file; mount
  typical-admin-fabric's (its list delete buttons use it) and import
  `confirmAsync` from there.
- `getCurrentApp()` reads `document.location.pathname`, so under a
  `HashRouter` the waffle panel doesn't expand the current application.
- `components/Admin/` is entirely commented out.

## License

MIT, see `LICENSE`.
