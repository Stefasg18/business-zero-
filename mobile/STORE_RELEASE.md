# Business Zero — mobile store release

## Goal
Ship a standalone iOS and Android game, not a Telegram-only WebView.

## Native shell
Capacitor app id: `com.stefasg18.businesszero`
App name: `Бизнес с нуля`

## Store blockers before submission
1. **Authentication** — the current production backend trusts Telegram Mini App `initData`. The store build must also support a standalone account/session flow so the game works without Telegram being installed.
2. **Digital purchases** — Telegram Stars cannot be the only in-app purchase path in App Store / Google Play builds. Store builds need StoreKit / Google Play Billing (or an eligible regional alternative program).
3. **Minimum functionality** — do not publish a thin remote website wrapper. Bundle the game locally and add native app behavior (haptics, lifecycle handling, notifications, offline/error states, native purchase flow).
4. **Privacy / store metadata** — privacy policy URL, support URL/email, age-rating questionnaire, data-safety/privacy disclosures, screenshots, icon, description.
5. **Testing** — TestFlight for iOS; Play internal/closed testing. Personal Play developer accounts may have additional testing requirements before production.

## Local project setup
From `mobile/`:

```bash
npm install
npm run prepare:web
npx cap add android
npx cap add ios
npx cap sync
```

Android: open with `npm run android` and build an Android App Bundle (.aab).

iOS: open with `npm run ios`, select the Apple Developer team, archive with current Xcode / iOS SDK, then upload to App Store Connect.

## Release sequence
1. Add standalone native auth to backend and client.
2. Add StoreKit and Google Play Billing product mapping.
3. Add native app icon/splash and native lifecycle/error UI.
4. QA all core flows and Party Arena on physical iPhone + Android.
5. Create App Store Connect / Play Console listings.
6. Upload beta builds.
7. Fix review/test issues.
8. Submit production releases.
