# Mobile release readiness

Status: preparation in progress. Telegram production build remains separate.

## Already prepared
- Capacitor shell in `mobile/`.
- App id: `com.stefasg18.businesszero`.
- App name: `Бизнес с нуля`.
- Local web bundle preparation script.
- Android/iOS sync scripts.
- Draft Russian store listing.

## Must be finished before store submission

### 1. Standalone authentication — BLOCKER
Current server login is based on Telegram Mini App `initData`. Store builds must work without Telegram installed.

Target:
- guest/device account or email/social sign-in;
- secure server session;
- optional Telegram account linking;
- account restore on a new phone;
- deletion request flow.

### 2. Store purchases — BLOCKER FOR MONETIZATION
Telegram Stars remain only in the Telegram build.

Target:
- iOS: StoreKit / App Store In-App Purchase;
- Android: Google Play Billing;
- server-side purchase verification;
- product IDs mapped to game rewards;
- idempotent reward delivery;
- restore/acknowledge purchase handling.

### 3. Native quality
- app lifecycle/background restore;
- network-loss screen and retry;
- native haptics where useful;
- safe-area and keyboard QA;
- app icon and splash;
- no black screens after resume;
- physical-device QA for Party Arena multi-touch.

### 4. Privacy and account controls
- privacy policy;
- support contact;
- exact data inventory;
- Google Play Data safety form;
- Apple App Privacy answers;
- delete account/data path if an account is created.

### 5. Store assets
- 1024×1024 icon master;
- Google Play feature graphic;
- Android screenshots;
- iPhone screenshots;
- final descriptions and age-rating questionnaires.

### 6. Testing
- Android internal test;
- Android closed test if required for the developer account;
- iOS TestFlight;
- backend load/error tests;
- purchase sandbox tests;
- fresh install/update/account restore tests.

## Release rule
Do not merge store-specific authentication/purchase code into the Telegram production path until it is guarded by platform mode and tested. Telegram Stars, App Store IAP, and Play Billing must remain separate payment adapters over the same server-side game reward service.
