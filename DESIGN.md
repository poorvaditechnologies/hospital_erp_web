# Design System — Ayurveda Clinic Dashboard

This app is used all day by front-desk staff and a clinic admin. It is a working tool, not a marketing site — prioritize legibility and density over decoration. Read this before building any UI, and follow it exactly rather than defaulting to generic dashboard-template patterns.

## Explicitly avoid

- Warm cream background with a terracotta/clay accent (a very common AI-generated-dashboard default)
- Identical rounded cards with a soft drop-shadow on every panel
- Gradient backgrounds or gradient buttons used as decoration
- Icon-in-a-colored-circle on every stat card
- Large border-radius (16px+) applied uniformly to everything
- ALL-CAPS section labels, tracked-out eyebrows above every heading

## Color tokens

Grounded in the subject matter: this is plant-medicine/clinical software, so the palette leans toward a muted herbal green (the one place we spend "boldness") and warm neutral paper tones — not a spa/wellness cliché, not a generic SaaS blue.

| Token | Hex | Use |
|---|---|---|
| `--bg-app` | `#F7F6F3` | Main content background |
| `--bg-surface` | `#FFFFFF` | Cards, panels, table rows |
| `--bg-sidebar` | `#1C1B18` | Sidebar background (the one dark, bold element) |
| `--text-primary` | `#211F1C` | Body text, headings |
| `--text-secondary` | `#6B6559` | Meta text, labels, timestamps |
| `--text-on-sidebar` | `#E9E7E1` | Sidebar text |
| `--border` | `#E4E1DA` | Hairline borders on cards/tables/inputs |
| `--accent-primary` | `#35513F` | Primary buttons, active nav item, links, key highlights |
| `--accent-primary-hover` | `#2A4232` | Hover state for primary |
| `--accent-muted` | `#A6752C` | Pending/due-soon status only — used sparingly |
| `--status-success` | `#3F6B4F` | Completed/paid |
| `--status-error` | `#B3462C` | Failed/overdue |

No gradients anywhere in the product. Color is used to carry status meaning (due, sent, failed), not for decoration.

## Typography

- Single family: **IBM Plex Sans** for everything — UI, headings, body. Two weights: 400 (body) and 600 (headings, labels, emphasis). Do not mix in a second display face.
- Table/numeric data (phone numbers, amounts, dates) uses tabular figures (`font-variant-numeric: tabular-nums`) so columns align.
- Type scale: 13px (meta/secondary), 14px (body/default UI), 16px (section headings), 20px (page titles). Keep it tight — this is a dense data tool, not an editorial page.
- Sentence case everywhere. No all-caps labels.

## Layout

```
┌──────────────┬─────────────────────────────────────────────┐
│              │  Clinic name          [search]      [user ▾]│
│   SIDEBAR    ├─────────────────────────────────────────────┤
│  (dark)      │                                              │
│  ─────────   │   Page title                                 │
│  Dashboard   │   ─────────────────────────────────────────  │
│  Patients    │                                              │
│  Visits      │   [content: tables, forms, stat rows]        │
│  Kit Orders  │                                              │
│  Templates   │                                              │
│  Reports     │                                              │
│  ─────────   │                                              │
│  Settings    │                                              │
│  Sign out    │                                              │
└──────────────┴─────────────────────────────────────────────┘
```

- Sidebar: fixed, ~232px wide, dark background, one accent-colored left-border or background tint on the active nav item — no icon-badges, no gradients.
- Top bar: thin, light background, just clinic name, a global patient search (by phone — this is the most common front-desk action), and a user menu. No hero banner, no welcome message with an illustration.
- Dashboard content: use plain bordered blocks in a simple grid for key numbers (today's visits, follow-ups due, pending kit orders) — a 1px `--border` outline, `--bg-surface` fill, no shadow, no icon circle. Let the number and label do the work.
- Tables are the primary content pattern (patients, visits, orders) — dense rows, hairline row dividers, sticky header, not card grids.
- Border radius: 6px on buttons/inputs/small elements, 8px max on larger containers (modals, the stat blocks). Never above that.
- Shadows: none by default. If a floating element (dropdown, modal) needs separation from the page, use a single subtle shadow (`0 2px 8px rgba(0,0,0,0.08)`), not the generic soft-grey-shadow-under-every-card pattern.

## Motion

- No hover animation or fade-in on every card/row.
- Use motion only for state changes that need to be shown: a row appearing after adding a patient, a toast confirming a WhatsApp send, a modal opening. Keep transitions short (150–200ms), no bounce/spring easing.

## Writing/copy in the UI

- Buttons say the exact action: "Send message", "Save patient", "Mark as shipped" — not "Submit".
- Empty states are instructional, not decorative: e.g. "No follow-ups due today" rather than an illustration with a vague caption.
- Errors state what happened and what to do: "This phone number is already registered to Rahul Sharma — open their record instead" rather than "Something went wrong".
