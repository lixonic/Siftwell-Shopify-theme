# Shopify theme ZIP

`Siftwell-0.8.0-beta.1.zip` contains the Shopify theme directories and the MIT notice in `assets/siftwell-license.txt`. Upload it through **Online Store → Themes** to configure a copy in your theme library. See the [setup guide](../getting-started.md) and [current project status](../known-limitations.md).

Documentation, demo screenshots, tooling, credentials and merchant data stay outside the ZIP. This download is excluded from its own theme package.

From the repository root, run `npm run package:download` to refresh it using Shopify CLI. `npm run validate` verifies its file list and bytes against the current source. The README download follows the main branch, so the package changes when maintainers update it.

## Optional catalog workbooks

- [Blank catalog template](Siftwell-catalog-template.xlsx): headers and guidance for your own specification, compatibility and parts data.
- [Worked inflator example](Siftwell-inflator-worked-example.xlsx): fictional shared and variant data showing overrides, suppression, an unknown compatibility state and complete parts-set replacement.

Both are original MIT-licensed workbooks, supplied separately from the theme ZIP. The worked example uses fictional handles, SKUs and set keys, with no live store identifiers or private export. Replace the example identifiers and facts before preparing changes for your store.

This optional prototype has an initial inflator-demo test. Opening or saving a workbook does not update Shopify. Imports require the developer-assisted companion and native definitions; read the [workflow and limitations](../catalog-data.md). The companion and workbooks are not uploaded as a Shopify theme or through Shopify's native product CSV importer.
