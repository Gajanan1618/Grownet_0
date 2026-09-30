# GrowNet — Web

The GrowNet landing page: a two-sided farm marketplace front end, built with
React + Vite + Tailwind CSS.

## Design concept

- **Two doors, not one funnel.** The hero splits immediately into "I grow it"
  (farmer) and "I buy it" (buyer) — the two audiences never have to parse a
  generic nav to find their path.
- **The Mandi Board.** A scrolling live-price ticker echoes a real mandi price
  board — it's the page's one signature visual, doing double duty as an
  always-on crop listing.
- **Parchi cards.** Each crop listing is styled like a weighment slip
  (perforated top edge, dashed divider, mono-font pricing) with a rotated
  ink-stamp "Verified Farmer" badge — grounded in the actual visual language
  of an Indian mandi rather than a generic e-commerce card.

## Login & role selection

One login for everyone — phone + OTP, no separate farmer/buyer forms. New users
pick a role (farmer / buyer / both) after verifying; returning users skip straight
through. Auth, listings, requirements, offers and profile all call `grownet-api`
through `src/lib/api.js`. The session is restored on load via `GET /auth/me`.
In demo mode the API returns the OTP and the login screen shows it.

## Listing form

The "Continue to listing details" button in the Sell panel (bottom of page)
opens a full listing form once you're logged in — category, crop name,
variety, quantity/unit, price, minimum order, quality grade, harvest date,
village, certifications, up to 5 photos, and a description. Submitting adds
it live to the "Fresh Arrivals" grid via `src/context/ListingsContext.jsx` —
no page reload, no fake data swap, it's the same state the grid renders from.

## Side menu, profile & Kisaan Chat

The three-line button to the left of the logo opens a slide-in drawer
(`src/components/SideMenu.jsx`) with site navigation, a profile entry point,
and **Kisaan Chat** — a working two-pane chat (contact list + thread, send a
message and it appears immediately) modeled on `kisaan_chat.html`, using mock
contacts for now (`src/features/chat/chatData.js`).

The profile entry (also reachable from the header avatar menu once logged in)
opens `src/features/profile/ProfileModal.jsx`:
- **Complete your profile** checklist with a live progress bar (name, photo,
  verified email, village — each ticks off as you complete it)
- **Profile photo** upload (reads the file locally and previews it immediately)
- **Email verification** — enter an email, "send" a (simulated) verification
  link, then confirm it — same demo-mode pattern as the OTP login
- **Update profile** — edit name and village, saved back into the same user
  object the rest of the app reads from

## Buyer requirement board

The "Buyer Board" nav link (and the "Post a requirement instead" link under
the hero's buyer door) opens `src/components/RequirementBoardSection.jsx` —
the inverse of the listing flow: buyers post what they need (category,
quantity, max budget, urgency, delivery date), and any logged-in farmer can
click **Send Offer** on a card to respond. Both directions share the same
`RequirementsContext`, so posted requirements and offer counts update live,
the same pattern as the crop listings.

## Kisaan Chat, with real functionality

`src/features/chat/ChatModal.jsx` now includes: contact search, category
filter tabs, unread badges, a mandi price ticker/panel, quick-action buttons
(💰 send a payment card, 🌾 send a catalog card, 📷 photo), a working
call/video button (shows a toast — no real telephony yet, see the
architecture doc's Calling section for the Exotel/Twilio integration this
would plug into), and a typing indicator with a simulated auto-reply so a
conversation actually feels two-way.

## Profile, redesigned

`src/features/profile/ProfileModal.jsx` is now organized into clear
sections — Contact & Verification (email), Identity & Payouts (Aadhaar last
4 digits, UPI ID — required for farmers per the architecture doc's payout
flow), Business Details (farm/business name, optional GSTIN for business
buyers), and Basic Info (name, village). The completion checklist now
tracks all six fields with a live progress bar.

## Folder structure

```
src/
├─ components/      # shared UI (Header, SideMenu, CropCard, Modal, etc.)
├─ context/          # AuthContext (login/profile state), ListingsContext
├─ features/
│  ├─ landing/       # the landing page itself
│  ├─ auth/          # phone+OTP login, role selection
│  ├─ profile/        # profile completion, photo, email verification
│  ├─ chat/           # Kisaan Chat
│  └─ seller-market/  # the crop listing form
├─ data/             # seed/mock data; swap for API calls (src/api/) later
└─ index.css         # Tailwind + global rules
```

Each new page/feature should get its own folder under `src/features/` so it
can be edited without touching anything else — see the architecture doc for
the full backend module list this is meant to plug into.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Pushing this to GitHub

```bash
git init
git add .
git commit -m "Initial GrowNet landing page"
git branch -M main
git remote add origin https://github.com/<your-username>/grownet-web.git
git push -u origin main
```

Recommended repo hygiene once it's pushed:
- Protect the `main` branch (Settings → Branches) so changes go through a
  pull request instead of a direct push.
- Connect the repo to Vercel or Netlify for automatic preview deployments on
  every PR — you'll get a live URL to click through before merging anything.
- Use a branch per feature (`feature/buyer-market`, `fix/card-spacing`) so
  one change can never break another part of the site.

## Run (needs grownet-api running)

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev              # http://localhost:5173
npm run lint && npm run build
```

## Deploying (Netlify)

1. Push to GitHub, "Add new site" → "Import an existing project" on Netlify.
2. Build command `npm run build`, publish directory `dist`.
3. Set `VITE_API_URL` in Site settings → Environment variables to your Render API URL
   (e.g. `https://grownet-api.onrender.com/api`).
4. `public/_redirects` (already in this repo) makes client-side routing survive a page refresh.
