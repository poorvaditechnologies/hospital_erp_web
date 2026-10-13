# Webapp — Frontend Guide

Vite + React + TypeScript.

**Read `DESIGN.md` in this folder before building any UI.** It has the exact color tokens, type, and layout rules for this product — follow it instead of default dashboard-template patterns.

## Stack

- Vite + React + TypeScript
- Tailwind CSS — configure the tokens from `DESIGN.md` as Tailwind theme values (don't hardcode hex codes inline)
- `shadcn/ui` for base primitives (button, input, dialog, dropdown) — customize them to match `DESIGN.md`, don't ship the default shadcn look untouched
- `TanStack Query` for all server data fetching/caching
- `React Hook Form` + `zod` for forms
- `React Router` for routing
- No test framework set up yet — don't add one unless asked

## Folder structure

```
webapp/
  src/
    pages/            one folder per route (Dashboard/, Patients/, Visits/, KitOrders/, Templates/, Settings/)
    components/
      layout/          Sidebar.tsx, TopBar.tsx, AppLayout.tsx
      ui/              shadcn primitives, customized per DESIGN.md
      shared/           reusable non-primitive components (PatientSearch, StatusBadge, etc.)
    hooks/              custom hooks, TanStack Query hooks per resource (usePatients.ts, useVisits.ts)
    lib/                api client, auth context, utils
    types/              shared TS types (mirror backend types where practical)
  DESIGN.md
  .env.example
```

## Conventions

- **Data fetching:** every API resource gets a `use<Resource>` hook wrapping TanStack Query — pages never call `fetch`/`axios` directly.
- **Forms:** define a `zod` schema per form, reuse it for both `React Hook Form` validation and to type the submit payload.
- **Layout:** every authenticated page renders inside `AppLayout` (sidebar + top bar), per the wireframe in `DESIGN.md`. Don't build one-off page layouts.
- **Role-based UI:** hide/disable admin-only actions (template creation, staff management, settings) based on the logged-in user's role — but never rely on this alone for security; the backend enforces it too.
- **Componentize by role of the piece, not just to reduce duplication:** a `PatientTable`, `VisitForm`, `TemplateSendDialog` etc. should each do one clear job.
- **No inline hex colors or arbitrary Tailwind values** for anything covered by a token in `DESIGN.md` — use the theme config so a future rebrand is a one-file change.
- **Loading/empty/error states are required for every data view**, written per the tone guidance in `DESIGN.md` (instructional, not decorative).

## Out of scope for now

- Automated tests
- Dark mode (single light theme for now — revisit if a clinic asks)
- Mobile app — this is a desktop-first tool for front-desk use, but keep pages responsive down to tablet width since some clinics may use one
