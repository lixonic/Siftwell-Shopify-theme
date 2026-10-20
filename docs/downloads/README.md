# Shopify theme ZIP

`Siftwell-0.8.0-beta.1.zip` contains the Shopify theme directories and the MIT notice in `assets/siftwell-license.txt`. Upload it through **Online Store → Themes** to configure a copy in your theme library. See the [setup guide](../getting-started.md) and [current project status](../known-limitations.md).

Documentation, demo screenshots, tooling, credentials and merchant data stay outside the ZIP. This download is excluded from its own theme package.

From the repository root, run `npm run package:download` to refresh it using Shopify CLI. `npm run validate` verifies its file list and bytes against the current source. The README download follows the main branch, so the package changes when maintainers update it.
