# SATOMI Android Notification Reading Plan

Last updated: 2026-06-03

## Feature Name

Smart Notification Intercept

## Goal

Help users capture transaction candidates from selected financial app
notifications without auto-saving them.

The feature is meant to reduce manual entry, not silently create records.

## Android Technical Basis

- Android native API: `NotificationListenerService`
- Requires explicit Notification Access enabled by the user in Android settings
- Needs a custom Capacitor plugin

## Planned Architecture

Flow:

`SATOMI Web UI`
-> `Capacitor bridge`
-> `Custom Android plugin`
-> `NotificationListenerService`
-> `user-approved source package filter`
-> `notification payload parser`
-> `sanitized transaction candidate`
-> `web-layer pending preview`
-> `TransactionPreviewCard`
-> `user confirms`
-> `save transaction`

## Consent And Access

- Notification access is sensitive and must be opt-in.
- The app must explain clearly why access is needed.
- Access must be enabled explicitly by the user in Android settings.
- The user must be able to revoke access any time.
- SATOMI should expose a clear in-app on/off control and source-app selection UI.

## Data Filtering Rules

- The plugin should filter source packages based on apps selected by the user.
- Example allowed sources later may include selected e-wallet or banking apps.
- SATOMI must not read unrelated private notifications when filtering can avoid
  them.
- SATOMI must not read or store OTP, password, or PIN content.
- Notification-derived transaction data should be minimized to only what is
  needed for preview and confirmation.

## Parsing Rules

- Parsing should be local where possible.
- AI should only receive sanitized transaction text if needed.
- Raw notification content should not be shipped broadly by default.
- Parsing should aim to extract:
  - possible amount
  - possible merchant/source
  - possible timestamp
  - possible transaction direction

## UX Rules

- Notification-derived transactions must stay as pending preview until the user
  confirms.
- The app must show a preview before saving.
- Users must be able to edit category, pocket, amount, or description before
  saving.
- The feature should allow ignoring or dismissing a candidate cleanly.

## Policy And Privacy Risks

- Notification reading is sensitive.
- The app must clearly explain why notification access is needed.
- User consent and transparency are required.
- The app should not hide, block, or manipulate notifications.
- The app should not read unrelated private notifications.
- This may require careful Play Store policy review before publishing.

## Not In Scope Yet

This plan does not:

- implement the custom Capacitor plugin
- create native Android source files
- connect backend persistence
- connect AI extraction
