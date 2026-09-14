# MediCare — Medical Booking System

A single-patient medical appointment booking app built with **React + Vite**.
Patients browse doctors, search and filter by specialty, view doctor details,
book appointments, and manage (edit / reschedule / cancel) their appointments —
all backed by a local REST API.

This is the final individual project for the React Summer Training at ITI.

## Features

- **Doctors page (home)** — doctor list fetched from a REST API with reusable
  `DoctorCard` components
- **Search** — controlled search input filtering doctors by name
- **Specialty filter** — dropdown filtering by specialty
- **Doctor details** — dynamic route (`/doctors/:id`) with working days,
  available time slots, contact info and ratings
- **Appointment booking** — React Hook Form with full validation (required
  fields, email format, phone format, no past dates)
- **My appointments** — full appointment CRUD:
  - Create (`POST /appointments`)
  - Read (`GET /appointments`)
  - Update / reschedule (`PUT /appointments/:id`) via `/appointments/:id/edit`
  - Delete / cancel (`DELETE /appointments/:id`) with a confirmation dialog
- **Patient profile** — Zustand store (persisted to `localStorage`) that
  pre-fills the booking form
- **States** — loading skeletons, API error states with retry, empty states,
  and toast notifications for every successful/failed mutation
- **Responsive UI** — mobile navigation menu, responsive grids, works on
  desktop and mobile
- **404 page** for unknown routes

## Technologies

- [React 19](https://react.dev/) (functional components + hooks, React Compiler enabled)
- [React Router 7](https://reactrouter.com/) — routing, dynamic params, 404
- [Zustand 5](https://zustand.docs.pmnd.rs/) — global patient profile store
- [Axios](https://axios-http.com/) — REST API calls (centralized in `src/services/api.js`)
- [React Hook Form 7](https://react-hook-form.com/) — booking and profile forms
- [Tailwind CSS 4](https://tailwindcss.com/) + shadcn/ui-style components (`src/components/ui`)
- [json-server](https://github.com/typicode/json-server) — local REST API
- [Vite 8](https://vite.dev/) — dev server and production build

## Installation

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure the API base URL
cp .env.example .env
```

## Running the app

You need **two terminals**:

```bash
# Terminal 1 — start the REST API (json-server on port 3001)
npm run api

# Terminal 2 — start the React frontend (Vite dev server)
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

In development the frontend calls `/api/*` and the Vite dev server proxies
those requests to `http://localhost:3001` (see `vite.config.js`), so no CORS
setup is needed.

## Environment variables

| Variable       | Default | Description                                                    |
| -------------- | ------- | -------------------------------------------------------------- |
| `VITE_API_URL` | `/api`  | Base URL used by the Axios instance (`src/services/api.js`)     |

See `.env.example`. To call the API directly (bypassing the dev proxy), set
`VITE_API_URL=http://localhost:3001` — the API server must then allow CORS.

## API endpoints

`json-server` serves `db.json` (seed data: 10 doctors, 3 sample appointments).

| Method   | Endpoint               | Description            |
| -------- | ---------------------- | ---------------------- |
| `GET`    | `/doctors`             | List all doctors       |
| `GET`    | `/doctors/:id`         | Get one doctor         |
| `GET`    | `/appointments`        | List all appointments  |
| `POST`   | `/appointments`        | Create an appointment  |
| `PUT`    | `/appointments/:id`    | Update an appointment  |
| `DELETE` | `/appointments/:id`    | Delete an appointment  |

## Project structure

```
src/
├── components/
│   ├── layout/            # Navbar, Footer, Layout (shared shell)
│   ├── doctors/           # DoctorCard, DoctorFilters, DoctorList, DoctorAvatar
│   ├── appointments/      # AppointmentCard, AppointmentForm, AppointmentStatus
│   └── ui/                # shadcn/ui-style primitives (button, card, dialog, toast, ...)
├── pages/                 # Route-level pages
│   ├── DoctorsPage.jsx
│   ├── DoctorDetailsPage.jsx
│   ├── BookAppointmentPage.jsx
│   ├── AppointmentsPage.jsx
│   ├── EditAppointmentPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── services/api.js        # Centralized Axios instance + API functions
├── stores/useProfileStore.js  # Zustand patient profile store
├── routes/router.jsx      # React Router configuration (lazy-loaded routes)
├── lib/utils.js           # cn() class-merge helper
├── App.jsx
└── main.jsx
```

## Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Deployment notes

- The app depends on the local `json-server` API, which is **not** deployed
  anywhere. A deployed frontend would need a real, reachable API and
  `VITE_API_URL` set to that API's public URL at build time.
- This project has **not** been deployed; it runs locally via `npm run dev`
  + `npm run api`.
- `json-server` stores data in `db.json` in memory of the file — it is a
  development/mock server, not a production backend.
# MediCare-React
