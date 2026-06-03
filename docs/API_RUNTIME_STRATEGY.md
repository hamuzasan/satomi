# SATOMI API Runtime Strategy

Last updated: 2026-06-03

SATOMI has two realistic runtime modes for the frontend.

## A. Browser/PWA Mode

In browser or PWA mode:

- the website runs from the production SATOMI domain
- relative `/api` routes work normally
- Supabase client can work normally against the deployed web origin
- service worker behavior remains relevant for installable web usage

This is the standard web-first runtime.

## B. Capacitor Remote URL Mode

In Capacitor remote URL mode:

- the Android app loads the production website URL
- the same Next.js app continues to render the UI
- the same API routes work through the deployed web origin
- native Android features communicate through the Capacitor bridge
- custom native plugins can send data into the web layer without changing the
  overall web-first architecture

This is the recommended Android direction for SATOMI because the product is
expected to need dynamic Next.js behavior, API routes, auth, AI extraction, and
later native Android features such as Smart Notification Intercept.

## Why Remote URL Mode Is Recommended

SATOMI is not a simple static brochure app. The product direction points toward:

- API routes
- authentication
- transaction CRUD
- AI-assisted extraction
- dynamic user data
- native Android plugin communication

Because of that, a remote production URL loaded by Capacitor is a better fit
than a static bundled export.

## Why Static Export Is Not Recommended

Static export mode is not recommended for current SATOMI because it will need:

- API routes
- auth
- AI extraction
- dynamic data

A static export would create unnecessary friction for these capabilities and
would not match the planned product architecture well.

## Practical Implication

The safest architecture is:

1. keep SATOMI as a strong deployed web app
2. keep PWA support healthy for open-web installability
3. let Capacitor wrap the production web experience later
4. expose native-only features through Capacitor plugins

This keeps the product web-first while still allowing native Android expansion.
