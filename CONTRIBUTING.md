# Contributing to Siftwell

Start with a reproducible problem or a useful improvement to the shopping experience. The design favors clear choices, consistent product information and a restrained page.

For a bug, include the affected page type, browser/device, steps and expected versus observed behavior. Use a sample product and remove private store or customer details. Report vulnerabilities through [SECURITY.md](SECURITY.md).

For a pull request:

1. Describe the merchant or shopper problem.
2. Keep the change focused and preserve useful native forms, keyboard behavior and localization.
3. Add meaningful regression coverage when behavior changes.
4. Run `npm test` and `shopify theme check --path .`.
5. Include screenshots for visual changes and state any tests you could not run.

Only contribute material you have the right to distribute under this project's MIT license. Do not copy code from restricted Shopify themes or include customer exports, credentials, demo product media or dependency folders.

Use your own development store for storefront testing. Keep real orders, payments and customer messages out of a reproduction. Source checks do not substitute for testing the affected storefront behavior.
