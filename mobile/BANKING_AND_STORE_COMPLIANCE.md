# Banking and store compliance notes

This file is a release checklist, not tax or legal advice.

## Google Play
- Developer account identity and merchant payout setup are separate concepts.
- A monetized Play app needs a merchant payments profile and verified payout method.
- The merchant bank account must be in the same country/region as the merchant payments profile, except limited EEA/SEPA cases handled under Google's rules.
- Do not create a foreign merchant profile with a fictitious address or use a bank account that does not belong to the lawful account holder/business arrangement.
- Do not finalize the merchant profile until the country, physical address, tax status, and matching bank account are settled; changing the merchant-profile country later is difficult and may require a new profile/account transfer.
- A Russian-located payout bank account currently cannot be used for Google Play seller monetization.
- A free Play release can be prepared independently of monetization.

## Apple
- Individual Apple Developer enrollment should use the developer's own supported payment method.
- Paid apps/IAP require the Paid Apps Agreement, banking information, and tax forms in App Store Connect.
- Use a bank account that can legally receive Apple payouts and whose holder details can be verified.

## Russian resident compliance to check before using a foreign account
- notification to the Russian tax authority about opening/closing/changing details of a foreign financial account when applicable;
- annual movement reporting when applicable;
- tax reporting of income and foreign-source income as applicable;
- currency-control restrictions for specific operations;
- local KYC, tax-residency and source-of-funds requirements in the bank's country.

## Safe release strategy
1. Finish the game and standalone authentication.
2. Publish/test as a free app first if banking/merchant setup is not ready.
3. Add store billing only after a lawful merchant country + physical address + matching payout bank account are confirmed.
4. Keep all store receipts and bank/tax records.
