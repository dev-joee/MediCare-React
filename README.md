# MediCare — Medical Booking System

A doctor appointment booking single-page application built with **React 19 + Vite**,
backed by a local mock REST API (**json-server**).

Patients create an account, browse and search a catalogue of doctors, save favourites,
maintain a personal profile, and book / reschedule / cancel appointments — all without
a phone call.

This is the final individual project for the React Summer Training at ITI.

---

## Overview

Booking a doctor's appointment usually means phone calls, waiting on hold, and
juggling paper notes. **MediCare** turns that into a few clicks in the browser.

The application solves the problem in three parts:

1. **Discovery** — a searchable, filterable, paginated catalogue of doctors with a
   detail page for each one (specialty, experience, working days, available time
   slots, consultation fee, contact details, rating).
2. **Identity** — a user account, so the app knows who is booking, and a saved
   profile whose contact details pre-fill the booking form.
3. **Management** — a single "My appointments" view where a booking can be reviewed,
   rescheduled, or cancelled.

The frontend is a standard React SPA. There is **no custom backend**: `json-server`
exposes the `db.json` file as a REST API, and the app talks to it through a single
Axios instance. Authentication is therefore a **mock/demo implementation**, not
production-grade security (see [Notes & Limitations](#notes--limitations)).

---

## Features

### Doctor discovery

- **Doctor catalogue** — 50 doctors fetched from the REST API and rendered as reusable
  `DoctorCard` components in a responsive grid.
- **Search by name** — debounced (400 ms) text search over the loaded doctor list.
- **Specialty filter** — dropdown built at runtime from the specialties present in the
  fetched data, so it never gets out of sync with the API.
- **All / Favorites view toggle** — switch the grid between every doctor and only the
  ones saved as favourites.
- **Pagination** — client-side, 6 doctors per page, with ellipsis page numbers, a
  "Showing X–Y of Z doctors" summary, and a control that renders fewer page slots on
  small screens so it never overflows.
- **Doctor details page** — dynamic route `/doctors/:id` showing the bio, specialty
  badge, rating, years of experience, working days, available time slots, phone,
  email, location and consultation fee.
- **Initials avatars** — doctor avatars are generated from the name with a colour
  chosen deterministically from the doctor's id, so no image assets are needed.

### Authentication

- **Sign up** — name, email, password and password confirmation, validated in the form,
  with a duplicate-email check against the API. Creating an account logs the user in
  immediately.
- **Log in** — email + password checked against the `users` collection.
- **Session persistence** — the logged-in identity survives a page refresh
  (stored in `localStorage`; the password is never persisted).
- **Log out** — clears the session *and* the cached profile.
- **Protected routes** — booking, appointments and profile pages redirect to `/login`
  when nobody is logged in, and send the user back to the page they wanted after a
  successful login.

### Profile

- **Per-user profile** — the profile fields live on that user's own record in the
  `users` collection, so every account has its own data.
- **Loaded automatically** — on login, on page refresh, and whenever the logged-in user
  changes; cleared on logout so one user's details can never appear in another's session.
- **Add / edit profile** — a single validated form used for both the first save and
  later edits.
- **Completion detection** — the profile counts as complete once name, email and phone
  are all saved.
- **Navbar notification** — a red dot next to "Profile" while the profile is incomplete,
  which clears itself the moment the profile is saved.
- **Avatar initials** — the saved name is reduced to initials (e.g. "Yousef Ali" → "YA")
  for the profile avatar.
- **Pre-fills booking** — saved details populate the booking form automatically.

### Appointments

- **Booking** — `/book` or `/book/:doctorId` (which pre-selects the doctor from the
  details page), with the patient details pre-filled from the profile.
- **Doctor-aware time slots** — the time dropdown offers the selected doctor's own
  slots, falling back to a default slot list when no doctor is chosen yet.
- **Validation** — required fields, email and phone formats, and a rule that rejects a
  date in the past (enforced both in the picker's `min` attribute and in validation).
- **My appointments** — every appointment with its doctor's name/specialty, a status
  badge, and the patient, date, time and optional note; sorted newest first.
- **Edit / reschedule** — `/appointments/:id/edit` reuses the same appointment form.
- **Cancel** — a confirmation dialog before the appointment is deleted, so a destructive
  action is never a single mis-click.
- **Feedback** — a toast notification for every successful and failed mutation.

### Favourites

- Heart toggle on every doctor card and on the doctor details page.
- Favourites are stored as **doctor ids only** (never whole doctor objects), so the list
  stays small and can't go stale when doctor data changes.
- Persisted to `localStorage`, and exposed as a Favorites filter on the doctors page.

### UI / UX

- **Dark / light theme** — defaults to the operating system preference, then remembers
  the user's explicit choice. Applied before the app renders, so a dark theme never
  flashes light first.
- **Loading skeletons** — every data-driven view has a placeholder that mirrors the real
  layout (doctor grid, doctor details, appointment list, appointment form, routed pages),
  so content does not visibly jump when it arrives.
- **Error states** — failed requests show an error alert with a **Try again** button that
  re-runs the request.
- **Distinct 404 handling** — a missing doctor or appointment is reported as "not found",
  separately from a network/server failure.
- **Empty states** — contextual messages for "no appointments yet", "no doctors found"
  and "no favorite doctors yet".
- **Toast notifications** — a small custom toast system (no extra dependency) that
  replaces `alert()`, auto-dismisses after 4 seconds, and caps the stack at three.
- **Responsive layout** — a collapsing mobile navigation menu, responsive grids, and a
  pagination control that adapts to the viewport.
- **Animations** — short CSS-only enter animations for pages, cards, dialogs and toasts,
  with a staggered delay for list items.
- **Reduced-motion support** — all animations and transitions are effectively disabled
  for users who prefer reduced motion.
- **Accessibility touches** — `aria-label`/`aria-pressed` on icon-only buttons,
  `aria-invalid` on invalid fields, `role="alert"` on error messages, `aria-current` on
  the active page, screen-reader-only labels, and Escape/overlay-click to close dialogs.
- **404 page** — an unknown route renders a friendly page with links back into the app.

---

## Tech Stack

| Technology | Version | Why it is used here |
| --- | --- | --- |
| **React** | 19 | The UI library. The whole app is built from function components and hooks. |
| **Vite** | 8 | Dev server and production bundler — instant HMR while developing, and the `/api` dev proxy that avoids CORS. |
| **JavaScript (JSX)** | — | No TypeScript; plain `.jsx`/`.js` files. |
| **React Router** | 7 | Client-side routing via `createBrowserRouter`, dynamic params (`/doctors/:id`), nested routes with a shared layout, lazy-loaded routes, and a catch-all 404. |
| **Zustand** | 5 | Global state (auth session, profile cache, favourites, theme). Small stores with no provider nesting or boilerplate. |
| **Axios** | 1 | All HTTP calls, centralised in one instance with a shared base URL. |
| **json-server** | 0.17 | Serves `db.json` as a REST API so the app can perform real HTTP CRUD during development without writing a backend. |
| **React Hook Form** | 7 | Login, signup, profile and appointment forms — uncontrolled inputs with built-in validation rules and `isSubmitting` state. |
| **Tailwind CSS** | 4 | Styling. Design tokens are CSS variables, and dark mode is a class-based variant. |
| **class-variance-authority** | 0.7 | Variant definitions for the `Button`, `Badge` and `Alert` primitives. |
| **clsx** + **tailwind-merge** | 2 / 3 | Combined in the `cn()` helper to merge class names and resolve Tailwind conflicts. |
| **lucide-react** | 0.549 | Icon set used throughout the UI. |
| **oxlint** | 1 | Linter (with the React plugin) — `npm run lint`. |
| **babel-plugin-react-compiler** | 1 | React Compiler, wired in through `@rolldown/plugin-babel` in `vite.config.js`, so components are memoized automatically at build time. |

---

## Architecture

The app is a client-side rendered SPA. Every layer below runs **in the browser** except
the mock API:

```
        UI (Tailwind + src/components/ui primitives)
                        ↓
        Pages  (route-level components, lazy-loaded)
                        ↓
        Hooks + Zustand stores  (shared application state)
                        ↓
        src/services/api.js  (one Axios instance)
                        ↓
        Vite dev proxy:  /api/*  →  http://localhost:3001/*
                        ↓
        json-server  (REST endpoints)
                        ↓
        db.json  (data file on disk)
```

How to read this:

- **UI** — presentational pieces: `src/components/ui/*` (button, card, dialog, input,
  toast…) plus the shared layout (Navbar, Footer, Layout).
- **Pages** — one component per route. Pages own their local UI state (loading, error,
  filters, form submissions) and compose smaller components.
- **State** — anything shared between distant components goes into a Zustand store
  instead of being threaded through props (who is logged in, the profile cache, the
  favourites list, the theme). `src/hooks/` holds the two cross-cutting hooks.
- **Services** — `src/services/api.js` is the only place that knows about HTTP. No
  component imports Axios directly, so the base URL and request shape are defined once.
- **json-server** — turns `db.json` into REST endpoints (`GET /doctors`, `POST /appointments`, …).
- **db.json** — the single source of truth for doctor, appointment and user data.

Because everything except `db.json` lives in the browser, the app has no server-side
rendering, no server-side sessions, and no server-side validation.

---

## Project Structure

```
.
├── db.json                  # The mock database (doctors, appointments, users)
├── index.html               # HTML shell + pre-paint theme script (no dark-mode flash)
├── vite.config.js           # React + React Compiler + Tailwind plugins, /api dev proxy
├── .env.example             # Documented VITE_API_URL
└── src/
    ├── main.jsx             # Entry point — mounts <App /> into #root
    ├── App.jsx              # Wraps the router in the ToastProvider
    ├── index.css            # Tailwind import, light/dark CSS variables, keyframes
    │
    ├── routes/
    │   └── router.jsx       # Route table, lazy imports, Suspense and the route guard
    │
    ├── pages/               # One component per route
    │   ├── HomePage.jsx           # Landing page (hero, steps, features, CTA)
    │   ├── DoctorsPage.jsx        # Doctor catalogue: fetch, search, filter, paginate
    │   ├── DoctorDetailsPage.jsx  # /doctors/:id
    │   ├── BookAppointmentPage.jsx# /book and /book/:doctorId
    │   ├── AppointmentsPage.jsx   # List, reschedule link, cancel with confirmation
    │   ├── EditAppointmentPage.jsx# /appointments/:id/edit
    │   ├── ProfilePage.jsx        # Profile view / add / edit
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   └── NotFoundPage.jsx       # Catch-all 404
    │
    ├── components/
    │   ├── layout/          # Layout (page shell), Navbar, Footer
    │   ├── auth/            # ProtectedRoute (the route guard)
    │   ├── doctors/         # DoctorCard, DoctorList, DoctorFilters, DoctorAvatar, skeletons
    │   ├── appointments/    # AppointmentForm, AppointmentCard, AppointmentStatus, skeletons
    │   └── ui/              # Reusable primitives: button, card, input, select, label,
    │                        #   textarea, badge, alert, dialog, pagination, skeleton, toast
    │
    ├── stores/              # Zustand stores (global state)
    │   ├── useAuthStore.js      # Session: who is logged in (+ signup/login/logout)
    │   ├── useProfileStore.js   # Cache of the current user's profile
    │   ├── useFavoritesStore.js # Favourite doctor ids
    │   └── useThemeStore.js     # Light/dark theme
    │
    ├── hooks/
    │   ├── useDebounce.js       # Delays a fast-changing value (search input)
    │   └── useProfileSync.js    # Loads/clears the profile when the logged-in user changes
    │
    ├── services/
    │   └── api.js           # The single Axios instance + all API functions
    │
    └── lib/
        └── utils.js         # cn() — clsx + tailwind-merge
```

---

## Routing

Routing is defined in `src/routes/router.jsx` with `createBrowserRouter`. Every page is
wrapped in a shared `Layout` (Navbar + `<main>` + Footer) through a nested route, and
every page component is loaded with `React.lazy()` behind a `Suspense` fallback.

| Path | Page | Access |
| --- | --- | --- |
| `/` | HomePage — landing page | Public |
| `/doctors` | DoctorsPage — catalogue | Public |
| `/doctors/:id` | DoctorDetailsPage | Public |
| `/login` | LoginPage | Public |
| `/signup` | SignupPage | Public |
| `/book` | BookAppointmentPage — pick a doctor in the form | **Protected** |
| `/book/:doctorId` | BookAppointmentPage — doctor pre-selected | **Protected** |
| `/appointments` | AppointmentsPage | **Protected** |
| `/appointments/:id/edit` | EditAppointmentPage | **Protected** |
| `/profile` | ProfilePage | **Protected** |
| `*` | NotFoundPage | Public |

- **Public** routes render for anyone. The authenticated-only navigation links
  (My Appointments, Profile) are simply hidden from the Navbar while logged out.
- **Protected** routes are wrapped by the `ProtectedRoute` guard, which checks the auth
  store and redirects to `/login` if nobody is logged in — passing the blocked location
  along in router state so login can return the user to it.
- The guard sits **outside** the `Suspense` boundary for the page, so the code for a
  protected page is not even downloaded for a logged-out visitor.

---

## Authentication

> **This is demo authentication against `json-server`, not production security.**
> Accounts live in `db.json` and passwords are stored and compared as plain text.

### How signup works

1. The form is validated by React Hook Form (required fields, email pattern, minimum
   password length, password confirmation).
2. `useAuthStore.signup()` lower-cases and trims the email, then calls
   `findUserByEmail()` → `GET /users?email=...`. json-server filters by any field through
   query params, so this returns an array of matching accounts.
3. If an account already exists, the store returns
   `{ error: 'An account with this email already exists.' }` and the form displays it.
4. Otherwise `createUser()` issues `POST /users` with `{ name, email, password, phone: '' }`.
   The `name` from signup seeds the profile and `phone` starts empty.
5. The new user is logged in immediately — no second login step — and the session is
   persisted.

### How login works

1. `useAuthStore.login()` calls `findUserByEmail()` with the normalised email.
2. The password is compared against the stored value. "No such account" and "wrong
   password" produce the **same** message (`Invalid email or password.`) so the form
   does not reveal which emails are registered.
3. On success the store keeps only `{ id, name, email }` — the password is deliberately
   dropped by the `toSessionUser()` helper and never enters the session state.

### How the authenticated user is identified

By the `user` object in `useAuthStore` (id, name, email). `selectIsAuthenticated`
(`Boolean(state.user)`) is the single derived selector used by both the route guard and
the Navbar, so they can never disagree about whether someone is logged in.

### How authentication state is persisted

`useAuthStore` is wrapped in Zustand's `persist` middleware under the key
`medicare-auth-user`, with `partialize: (state) => ({ user: state.user })` so **only the
identity is written to `localStorage`**. Because `localStorage` reads are synchronous,
the store is rehydrated before the first render — which is why `ProtectedRoute` needs no
"checking…" loading state and a logged-in user is never briefly bounced to `/login` on
refresh. `App.jsx` has no async session bootstrap for the same reason.

### How logout works

`logout()` calls `useProfileStore.getState().clearProfile()` **first**, then sets
`user: null`. Clearing the profile is essential: the profile store is an in-memory cache,
so without this the next person to log in on the same browser could see the previous
user's name and phone. The Navbar's sign-out handler then shows a toast and navigates home.

### How protected routes work

`src/components/auth/ProtectedRoute.jsx` reads `selectIsAuthenticated`. If false it
renders `<Navigate to="/login" replace state={{ from: location }} />`; otherwise it
renders its children. Login and Signup read `location.state?.from?.pathname` (falling
back to `/`) and navigate there after success, so an interrupted flow resumes where it
left off. If an already-authenticated user opens `/login` or `/signup` directly, those
pages redirect away instead of showing the form.

---

## Profile System

### Where the profile data is stored

On the **user's own record** in the `users` collection of `db.json`:

```json
{
  "id": 3,
  "name": "Yousef Ali",
  "email": "yousefali@gmail.com",
  "password": "…",
  "phone": "+201022244455566"
}
```

`json-server` is the source of truth. Nothing about the profile is persisted in the
browser.

### How the profile belongs to a specific user

The profile fields are columns on that user's row, keyed by the user id. There is no
separate "profiles" collection and no client-side mapping to maintain — the record *is*
the profile. This is what makes each account's data independent.

### How the profile is loaded

`src/hooks/useProfileSync.js` is called from `Layout`, so it runs on **every route**
(the Navbar needs the profile state on public pages too). It watches
`useAuthStore(state => state.user?.id ?? null)` — the authenticated user's id — and:

| Situation | `userId` | Effect |
| --- | --- | --- |
| Login | appears | `loadProfile(userId)` → `GET /users/:id` |
| Page refresh | restored from `localStorage` | `loadProfile(userId)` |
| Switching user | changes | `loadProfile(newId)` |
| Logout | becomes `null` | `clearProfile()` |

One effect covers all four cases because all four are the same event: *the authenticated
user changed*.

`loadProfile` first resets the cache if the cached `userId` differs from the requested
one, so one user's details are never on screen while another's are loading. It then sets
`loading: true`, fetches, and fills `{ name, email, phone, userId }` — or sets
`error: 'network'` if the request fails.

### How profile updates are persisted

`useProfileStore.saveProfile(values)` calls `updateUser(userId, changes)` →
`PATCH /users/:id`. **PATCH rather than PUT** is deliberate: only the profile fields are
sent, so the stored password is left untouched. The store updates its cache *after* the
API call resolves, so the UI never shows a change `json-server` did not accept. Saving
while not authenticated returns `{ error: 'not-authenticated' }`.

### How profile completion is detected

`selectIsProfileComplete` — `Boolean(state.name.trim() && state.email.trim() && state.phone.trim())`.
It is a derived selector, so the Profile page (saved view vs. empty state) and the Navbar
(read dot) always agree. Note that a freshly signed-up user already has a name and email
from the account, so in practice the profile is incomplete simply because `phone` is
still empty.

### How the avatar initials work

`getInitials()` in `ProfilePage.jsx` trims the name, splits on whitespace, drops empty
segments, and takes the first letter of the first two words, upper-cased:
`"Yousef Ali"` → `YA`, `"  Ahmed   Mohamed "` → `AM`, `"John"` → `J`, and it returns an
empty string rather than throwing on empty input. The `DoctorAvatar` component uses its
own initials helper that additionally strips a leading `Dr.`.

### How the Navbar notification works

The Navbar subscribes to both `selectIsProfileComplete` and the store's `loading` flag:

```js
const profileComplete = useProfileStore(selectIsProfileComplete)
const profileLoading  = useProfileStore((state) => state.loading)
const showProfileDot  = !profileComplete && !profileLoading
```

The red dot next to "Profile" therefore appears only for a logged-in user whose profile
is genuinely incomplete, and it disappears on its own the moment the profile is saved —
no manual refresh and no extra state to keep in sync. Suppressing it while `loading` is
true stops a stale dot from flashing during login or a user switch.

---

## Data & API

### Axios configuration

`src/services/api.js` creates **one** Axios instance for the whole app:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

const unwrap = (response) => response.data
```

Every exported function returns a promise of the **response body** (via `unwrap`), not
the full Axios response, so callers work with plain data/arrays and use
`.then()/.catch()`. Components never import Axios themselves.

There is no request interceptor, no auth header and no global error interceptor — errors
propagate to the caller, and each page decides how to present them.

### json-server

`npm run api` runs `json-server db.json --port 3001`. It reads `db.json` and exposes
each top-level key as a REST collection, supporting filtering, sorting and pagination
through query parameters, and assigning ids automatically on `POST`.

### db.json

| Collection | Contents | Notes |
| --- | --- | --- |
| `doctors` | 50 doctors | Seeded data. Fields: `id`, `name`, `specialty`, `description`, `workingDays[]`, `slots[]`, `experienceYears`, `consultationFee`, `rating`, `phone`, `email`, `location`. Read-only in the app. |
| `users` | Registered accounts | Fields: `id`, `name`, `email`, `password`, `phone`. Written on signup and profile save. |
| `appointments` | Bookings | Currently empty in the committed file — a fresh run starts with no appointments. Fields: `id`, `patientName`, `email`, `phone`, `doctorId`, `date`, `time`, `note`, `status`. |

Because `json-server` writes back to `db.json`, signups and bookings survive an API
restart. Deleting the file's contents (or the file) resets the app to its seed state.

### CRUD operations

| Operation | Where it happens | HTTP |
| --- | --- | --- |
| List doctors | `DoctorsPage`, `BookAppointmentPage`, `AppointmentsPage`, `EditAppointmentPage` | `GET /doctors` |
| One doctor | `DoctorDetailsPage` | `GET /doctors/:id` |
| List appointments | `AppointmentsPage` | `GET /appointments` |
| One appointment | `EditAppointmentPage` | `GET /appointments/:id` |
| Create appointment | `BookAppointmentPage` | `POST /appointments` |
| Update appointment | `EditAppointmentPage` | `PUT /appointments/:id` |
| Delete appointment | `AppointmentsPage` (cancel) | `DELETE /appointments/:id` |
| Find account by email | login / signup | `GET /users?email=…` |
| Create account | signup | `POST /users` |
| Read one user (profile) | `useProfileStore.loadProfile` | `GET /users/:id` |
| Update profile | `useProfileStore.saveProfile` | `PATCH /users/:id` |

### How a frontend request reaches json-server

In development the app requests `/api/doctors`, not `http://localhost:3001/doctors`.
`vite.config.js` proxies it:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

So `/api/doctors` → `http://localhost:3001/doctors`. Routing the API through the dev
server's own origin is what avoids CORS during development. Note this proxy belongs to
the **dev server only** (`server.proxy`, not `preview.proxy`), so `npm run preview` does
not proxy `/api` — see [Notes & Limitations](#notes--limitations).

---

## State Management

Four Zustand stores, each with a single responsibility. Two are persisted to
`localStorage`; two are not.

### `useAuthStore` — "who is logged in"

| | |
| --- | --- |
| **State** | `user` — `{ id, name, email }` or `null` |
| **Actions** | `signup({name,email,password})`, `login({email,password})`, `logout()` |
| **Selectors** | `selectIsAuthenticated` |
| **Persisted** | Yes — `medicare-auth-user`, identity only (`partialize`) |

`signup` and `login` return `{ user }` on success or `{ error }` with a message the form
can display, rather than throwing — that keeps the pages free of try/catch and gives the
forms a uniform result shape. `logout` clears the profile store before clearing the user.

### `useProfileStore` — cache of the current user's profile

| | |
| --- | --- |
| **State** | `name`, `email`, `phone`, `userId`, `loading`, `error` |
| **Actions** | `loadProfile(userId)`, `saveProfile(values)`, `clearProfile()` |
| **Selectors** | `selectIsProfileComplete` |
| **Persisted** | **No** — deliberately in-memory only |

Not persisting this is a privacy decision: the data already lives on the server, and
keeping it out of `localStorage` means one user's contact details can never leak into
another user's browser session. The shape is kept flat (name/email/phone at the top
level) so the Navbar dot, the booking pre-fill and the completion selector all read it
directly.

### `useFavoritesStore` — favourite doctors

| | |
| --- | --- |
| **State** | `favorites` — an array of doctor **ids** |
| **Actions** | `toggleFavorite(doctorId)` (adds or removes), `isFavorite(doctorId)` |
| **Persisted** | Yes — `medicare-favorite-doctors` |

Storing ids instead of whole doctor objects keeps the payload tiny and means a favourite
can never render stale doctor data — the current data comes from the API, and the
favourites list only decides *which* doctors to show.

### `useThemeStore` — light / dark theme

| | |
| --- | --- |
| **State** | `theme` — `'light'` or `'dark'` |
| **Actions** | `toggleTheme()` |
| **Persisted** | Yes — `medicare-theme` |

`theme` starts from `window.matchMedia('(prefers-color-scheme: dark)')` on a first visit;
once the user toggles, the persisted explicit choice always wins. The store applies the
`dark` class to `<html>` and `index.css` swaps the CSS variables behind every Tailwind
colour token. `applyThemeClass()` is also called at module import time, and `index.html`
contains a tiny pre-paint script that mirrors the same logic — together these prevent a
light flash before a dark theme is applied.

Two pieces of state are intentionally **not** in a store:

- **Doctor/appointment lists** — fetched per page with `useState`, because nothing else
  needs them.
- **Search, specialty, favourites-view and page number** — local to `DoctorsPage`; they
  are UI state for one screen.

---

## Main Application Flows

### 1. Login

```
Login form (React Hook Form validation)
        ↓
useAuthStore.login()
        ↓
findUserByEmail()  →  Axios  →  GET /api/users?email=…
        ↓
json-server  →  db.json → users collection
        ↓
password compared  →  session user { id, name, email }
        ↓
persisted to localStorage ("medicare-auth-user")
        ↓
useProfileSync notices the new userId
        ↓
loadProfile(id)  →  GET /api/users/:id
        ↓
profile cache filled  →  Navbar dot recalculated, booking form pre-fills
        ↓
navigate to the originally requested page (or "/")
```

### 2. Signup

```
Signup form validation (incl. passwords match)
        ↓
useAuthStore.signup()  →  GET /users?email=…  (duplicate check)
        ↓
POST /users  →  db.json users collection (new id assigned)
        ↓
logged in immediately  →  success toast  →  redirect
```

### 3. Browsing doctors

```
/doctors mounts
        ↓
getDoctors()  →  GET /api/doctors  →  50 doctors
        ↓
skeleton grid while loading
        ↓
user types in the search box
        ↓
useDebounce waits 400 ms of silence
        ↓
filteredDoctors (name + specialty + favourites view)  →  useMemo
        ↓
paginated to 6 per page  →  DoctorList  →  DoctorCard each
        ↓
Pagination control + "Showing X–Y of Z doctors"
```

Changing the search text, the specialty or the All/Favorites view resets the page to 1,
so the user can never be stranded on a page that no longer exists for the new results.

### 4. Doctor details and booking

```
DoctorCard / "View details"  →  /doctors/:id
        ↓
getDoctorById(id)  →  GET /api/doctors/:id
        ↓
404 → "Doctor not found", other errors → retryable alert
        ↓
"Book Appointment"  →  /book/:id  (protected)
        ↓
getDoctors() to populate the doctor dropdown
        ↓
form pre-filled from the profile store; the doctor's own slots drive the time dropdown
        ↓
validation (required, email, phone, date not in the past)
        ↓
POST /api/appointments with status: "scheduled", doctorId coerced to a number
        ↓
success toast  →  navigate to /appointments
```

### 5. Favouriting a doctor

```
Heart button on DoctorCard or DoctorDetailsPage
        ↓
useFavoritesStore.toggleFavorite(doctorId)
        ↓
id added to / removed from the favorites array
        ↓
persisted to localStorage ("medicare-favorite-doctors")
        ↓
every subscribed heart re-renders (filled red when favourited)
        ↓
"Doctors page → Favorites" toggle filters the grid to those ids
```

On a card, the click handler calls `preventDefault()` and `stopPropagation()` so pressing
the heart never triggers the surrounding card navigation.

### 6. Managing appointments

```
/appointments mounts
        ↓
Promise.all([getAppointments(), getDoctors()])   ← doctor names come from the doctors list
        ↓
sorted newest first, skeleton stack while loading
        ↓
AppointmentCard: doctor avatar/name/specialty, status badge, details, actions
        ↓
Edit / Reschedule  →  /appointments/:id/edit
        ↓
GET /appointments/:id + GET /doctors, form pre-filled
        ↓
PUT /api/appointments/:id   →  success toast  →  back to the list
        ↓
Cancel  →  confirmation dialog  →  DELETE /api/appointments/:id
        ↓
removed from local state  →  success toast
```

### 7. Profile update

```
/profile mounts (Navbar dot may be showing)
        ↓
profile already in the store (loaded by useProfileSync) — or a skeleton while loading
        ↓
"Add Profile" / "Edit Profile"  →  the same validated form
        ↓
saveProfile(values)
        ↓
PATCH /api/users/:id  (only name/email/phone — the password is untouched)
        ↓
store cache updated from the response
        ↓
toast ("Profile saved." the first time, "Profile updated." afterwards)
        ↓
selectIsProfileComplete flips to true  →  the Navbar dot disappears
        ↓
the booking form now pre-fills with these details
```

### 8. Logout

```
"Log out" in the Navbar
        ↓
useAuthStore.logout()
        ↓
clearProfile()   ← first, so no cached profile can outlive the session
        ↓
user = null  →  persisted session removed from localStorage
        ↓
Navbar re-renders: private links and Log out disappear
        ↓
toast + navigate to "/"
```

---

## Performance / UX

Everything below is actually implemented in the code.

- **Route-level code splitting** — all ten pages are `React.lazy()` imports, so the
  initial bundle contains the layout and route table only, and each page's code is
  fetched on first visit. `npm run build` emits one chunk per page.
- **Suspense fallbacks** — each lazy route is wrapped in `<Suspense>` with a
  `PageFallback` skeleton that matches the page layout, so a chunk download shows a
  placeholder instead of a blank screen. The guard sits outside the boundary, so
  protected chunks are not downloaded for logged-out visitors at all.
- **React Compiler** — enabled in `vite.config.js` via `babel-plugin-react-compiler`, so
  component memoization is applied automatically at build time. That is why there is no
  manual `React.memo` anywhere in the codebase.
- **Debounced search** — `useDebounce(search, 400)` means the doctor filter runs once
  after the user pauses typing instead of on every keystroke. The input itself stays
  fully responsive because it is driven by the raw value.
- **Client-side pagination** — only 6 of the filtered doctors are rendered at a time, so
  the DOM stays small regardless of how many doctors come back from the API.
- **Memoized derivations** — `useMemo` for the filtered doctor list, the paginated slice,
  the specialty list, the doctor id → doctor map on the appointments page, and the sorted
  appointment list; `useCallback`/`useMemo` for the toast context value. This avoids
  recomputing (and re-rendering on) values that did not change.
- **Skeletons instead of spinners** — every placeholder mirrors the real component's
  layout, so there is no visible layout shift when data arrives.
- **No extra UI dependencies** — dialogs, toasts, pagination, skeletons and variants are
  small local components rather than a component library.
- **Deterministic avatars** — initials avatars avoid downloading any image assets.
- **Theme applied pre-paint** — the inline script in `index.html` sets the `dark` class
  before the app renders, eliminating the flash of the wrong theme.
- **CSS-only animation** — short keyframes in `index.css` (0.2–0.4 s), no animation
  library, plus a `prefers-reduced-motion` block that disables them.
- **Accessibility as UX** — labels, `aria-*` attributes on stateful controls, focus
  rings, and keyboard-dismissible dialogs.

---

## Installation

Requires **Node.js `^20.19.0` or `>=22.12.0`** (the range Vite 8 supports) and npm.

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure the API base URL
cp .env.example .env
```

No `.env` file is needed for normal local development — `VITE_API_URL` falls back to
`/api`, which the dev server proxies to json-server.

---

## Running the Project

You need **two terminals**: one for the mock API, one for the React app.

```bash
# Terminal 1 — mock REST API (json-server on port 3001)
npm run api

# Terminal 2 — React frontend (Vite dev server)
npm run dev
```

Then open the URL Vite prints — usually <http://localhost:5173>.

The doctors page is empty-looking (but not broken) if the API is not running: the app
shows its error state with a **Try again** button, which is the quickest way to confirm
both processes are up.

### Seeded accounts

The committed `db.json` contains sample accounts, e.g.:

| Email | Password |
| --- | --- |
| `demo@medicare.test` | `demo1234` |
| `yousef@medicare.test` | `demo1234` |

Or create your own account on the signup page.

### All scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (frontend) |
| `npm run api` | Start json-server on port 3001 (mock API) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

---

## Environment Variables

Only one variable is used, and it is read exactly once — in `src/services/api.js`.

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Base URL for the Axios instance |

- **Unset / `/api`** (default) — the app calls `/api/*` and the **Vite dev server**
  proxies those requests to `http://localhost:3001`, so no CORS setup is needed.
- **`http://localhost:3001`** — the app calls the API directly, bypassing the proxy. The
  API server must then allow cross-origin requests.

Vite only exposes variables prefixed with `VITE_` and inlines them **at build time**, so
a production build bakes in whatever value was set when `npm run build` ran. See
`.env.example`; `.env` itself is git-ignored. No secrets are required or stored.

---

## Notes / Limitations

This is a **training/demo project**, and its architecture has real limits worth stating
plainly.

**Authentication is not secure.**

- Passwords are stored as **plain text** in `db.json` and are returned by
  `GET /users`, so they are readable by anyone who can reach the API.
- Authentication is decided **entirely in the browser**. There is no token, no session
  cookie, no server-side check — the "logged in" flag is a `localStorage` entry, which a
  user can edit by hand to reach protected pages. Protected routes are a UX convenience,
  not an authorization boundary.
- The API has no authorization at all: any client can read or modify any collection.

**Data is not scoped to the user.**

- **Appointments have no `userId` field** and `GET /appointments` returns the whole
  collection, so "My appointments" actually lists *every* appointment in `db.json`
  regardless of who is logged in. The pre-filled patient details come from the profile,
  but the record itself is not linked to the account.
- **Favourites live in `localStorage`**, so they belong to the *browser*, not the account:
  two different users on the same browser share one favourites list, and they do not
  travel to another device.
- Editing the profile email changes the email on the `users` record, which is the same
  field login looks up — so the login email changes too. The session object already in
  `localStorage` keeps the previous name/email until the next login.

**Frontend-only data handling.**

- No server-side validation or constraints — the API happily accepts anything shaped
  correctly.
- Search matches the **doctor name only**; specialty is a separate dropdown.
- Filtering, search and pagination are all **client-side**, so the full doctor list is
  fetched in one request.
- No caching layer: each page mount re-fetches what it needs.
- Failed requests are handled generically per page. There is no retry/backoff policy, no
  request interceptor, and **no React error boundary** — an unexpected render error would
  blank the app.
- Cancelling an appointment **deletes** the record; it is irreversible and no history is
  kept. Only the `scheduled` status is ever written by the UI (the `completed` and
  `cancelled` badge styles exist but are not assigned anywhere).
- The appointments list is sorted newest-first by comparing the `date` + `time`
  strings (which works because both are stored in a sortable format).

**Deployment.**

- **Nothing is deployed.** The app runs locally with `npm run api` + `npm run dev`.
- The `/api` proxy is configured on Vite's **dev server** only, so `npm run preview` (and
  any static hosting of `dist/`) will **not** proxy `/api`. Serving a production build
  requires either building with `VITE_API_URL` pointing at a real, reachable API URL, or
  putting a reverse proxy in front of the static files.
- `json-server` is a mock server for development, not a production backend; it loads
  `db.json` into memory and writes the file back on changes, with no concurrency
  handling or durability guarantees.
- `json-server` is listed under `dependencies` rather than `devDependencies`.
- **No tests**: there is no test script or test framework configured (`npm run lint`
  is the only automated check).

---

## Possible Next Steps

Out of scope for this project, but the natural direction:

- A real backend with a database, **hashed** passwords (bcrypt/argon2) and proper
  sessions or JWTs, plus authorization so a user can only read and modify their own
  records.
- An explicit `userId` on appointments, so "My appointments" and favourites are genuinely
  per-account.
- Server-side search, filtering, pagination and validation.
- An Axios response interceptor for uniform error handling and a React error boundary.
- Tests (unit + end-to-end) and a CI pipeline.
- Deployment of both the frontend and a real API.
