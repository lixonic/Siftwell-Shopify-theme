# Edit catalog facts in a spreadsheet

Maintaining useful facts should not require opening every product and every saved entry in Shopify. Start with a small product family, export the details already present and edit them in one workbook. Enter shared information once, then assign that saved set to the products that use it.

**This is an optional prototype with an initial inflator-demo test.** It supports the existing specification rows, compatibility details and included-parts sets. You can continue editing these facts directly in Shopify. You do not need a workbook, or all three features, to use the theme.

The Google Sheets-compatible workbooks organize data entry. Saving an XLSX does not update Shopify. Importing requires the developer-assisted companion, native definitions and authenticated Shopify CLI setup described below. A merchant-facing app and live Google Sheets connection are not included.

## Download the template and inflator example

| Download | Use it for |
| --- | --- |
| [Blank catalog template (.xlsx)](downloads/Siftwell-catalog-template.xlsx) | Start your own product family. It contains headers and instructions, with no sample assignments. Prefer filling it from an export of your existing facts. |
| [Worked inflator example (.xlsx)](downloads/Siftwell-inflator-worked-example.xlsx) | Learn the four tabs using fictional 12 V and 24 V versions. It uses example handles, SKUs and set keys, with no live store identifiers. |

Open either workbook in Excel, or import it into Google Sheets and download the completed copy as XLSX. Read the **Read me** tab before editing. The filled example is for learning: replace its example product handles, unique variant SKUs, linked-product handles and illustrative facts with your own verified data before making a plan. The example does not create products or variants.

In the worked example:

1. **Assignments:** the product row supplies shared sets. The 12 V row leaves its assignments blank; on a new setup it inherits the product sets. On an existing catalog, those blanks preserve any current overrides.
2. **Specifications:** the 24 V set changes voltage and output, suppresses Connector with a blank value and adds Cable length.
3. **Compatibility:** the 24 V set contains only an entry name. Assigning it deliberately replaces the shared 12 V profile with **Compatibility not confirmed**.
4. **Parts:** the 24 V set supplies complete replacement contents and extras. It omits the shared example tool-roll link, so that link does not carry over.

The [live inflator walkthrough](product-specifications.md#try-the-live-auto-parts-preview) shows the same display rules. All example figures and requirements are illustrative. A product link demonstrates navigation, not verified suitability.

## Choose the smallest useful workflow

For a few product or variant assignments, try [Shopify's native metafield bulk editor](https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields). It already presents selected products and metafields in a table. Reusing an existing saved set can be enough; you do not need this companion for every small edit.

For a product family with many facts or variant differences, the workbook keeps the entries and their assignments together. Shopify's native product CSV supports certain product metafield types and reference lists, but excludes variant metafields. A custom CSV column alone does not create the saved entries behind those references. [Shopify CSV capabilities](https://help.shopify.com/en/manual/products/import-export/using-csv).

## Edit four working tabs

| Tab | What you edit | What stays shared |
| --- | --- | --- |
| Assignments | Product handle, exported variant identifier or SKU, and the saved-set keys to use | Blank feature cells leave that assignment unchanged. A row without variant identifiers supplies shared product details. |
| Specifications | One row per set key and specification code, with its label and value | Repeat the same set key to group rows. Keep codes and units consistent across comparable items. |
| Compatibility | One row per saved set, with requirements, exclusions, notes and a reference | Assign the same key to every selected product or variant for which the complete set is accurate. |
| Parts | One row per saved set, with included items and required/optional extras | Quantities stay in item text. Product links use handles, one per line. |

Use a line break inside a cell for each list item. Keep the tab names and header row. Preserve variant identifiers and SKUs as text; a variant ID can be Shopify's full `gid://shopify/ProductVariant/...` identifier or its exact digits. The export uses full identifiers so spreadsheets cannot display them in scientific notation. The optional SKU must agree with the ID; a SKU alone must be unique within the product.

The blank workbook contains no demo records. Import it into Google Sheets or open it in Excel, then fill it from an export or paste verified supplier values into the relevant columns. Save the completed workbook as XLSX. You can instead export the four working tabs as UTF-8 `assignments.csv`, `specifications.csv`, `compatibility.csv` and `parts.csv`. Formulas are rejected in the four import tabs; paste the verified results as values.

## Keep blanks and version differences explicit

- A blank feature cell in **Assignments** means **leave Shopify unchanged**. Deleting a worksheet row does not delete the saved set or its assignment.
- Empty fields inside a selected Compatibility or Parts row belong to that complete set. A variant set replaces the entire product set. An entry-name-only set can deliberately withhold shared information, following the feature's existing empty-state rules.
- A blank specification value on a variant can deliberately suppress an existing shared code. A new variant code needs both a label and a value. Shared product specification rows need labels and values.
- Clearing an override to restore inheritance is done in Shopify in this first version. The companion does not delete entries or assignments.
- The theme processes up to 20 specification rows per set and ten lines per compatibility/parts list. The importer rejects excess entries rather than silently truncating them.

The companion displays supplied information. It does not infer compatibility, invent supplier facts, choose an extra's variant or create a bundle.

## Preview before saving

The preview lists the exact selected product or variant, existing facts, proposed facts and the number of new entries and changed assignments. A fresh export without edits should propose zero changes.

An edit to a shared set creates a changed copy and assigns it only to the selected rows. It does not modify the existing entry or its other users. Include every intended product in Assignments when a shared change should reach all of them. Unchanged entries are reused, and retries can reuse a previously created copy with identical content. New copies contain the supplied default-language values; translations on existing entries do not move to them. Keep translated sets in Shopify until you have a plan to recreate those translations on the copies.

The companion rechecks the plan against current catalog data before saving. Changed assignments use Shopify's compare-and-set protection, so an intervening change to the same metafield is rejected. The run saves its original facts and a receipt outside the theme repository, then verifies the requested data after import.

An import can span several API requests. If a later request fails, an earlier request may already have succeeded. Keep the receipt, inspect the reported state and create a fresh preview before retrying. The companion does not automatically roll back or delete entries. [Shopify compare-and-set behavior](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet).

## Developer setup and commands

Use Python 3.10 or newer and the authenticated official Shopify CLI with its supported Node.js version. The companion uses `shopify store execute`; older CLI versions without that command are unsupported. Credentials remain with Shopify CLI. Do not put Admin tokens in the workbook, browser, theme assets or public repository.

Create the native definitions once using the existing [specification](product-specifications.md), [compatibility](product-compatibility.md) and [parts](product-parts.md) guides. The companion validates keys, types, reference restrictions and storefront access. It expects the documented native types and the `specifications`, `compatibility` and `parts` keys in the namespace you select. Custom type names, per-feature key remapping and additional required definition fields need a later adapter. It does not create or migrate definitions.

The examples below run from a [checkout of the theme source](https://github.com/lixonic/Siftwell-Shopify-theme), which includes `scripts/catalog_data.py`. The companion is separate from the installable theme ZIP. Replace the store and product handles with your own. Keep the private working directory outside the public repository.

```sh
# Export current facts for one family. Repeat --handle for more products.
python3 scripts/catalog_data.py export \
  --store your-store.myshopify.com \
  --handle workshop-inflator \
  --out /private/catalog-inflators

# Check the workbook locally, without connecting to Shopify.
python3 scripts/catalog_data.py validate \
  --input /private/edited-catalog.xlsx

# Read current catalog data and create a proposed-change preview.
python3 scripts/catalog_data.py plan \
  --store your-store.myshopify.com \
  --input /private/edited-catalog.xlsx \
  --out /private/inflators-plan.json

# After reviewing the adjacent inflators-plan.md, apply that exact plan.
python3 scripts/catalog_data.py apply \
  --store your-store.myshopify.com \
  --plan /private/inflators-plan.json \
  --confirm FULL_PLAN_ID_PRINTED_BY_PLAN \
  --receipt /private/inflators-receipt.json
```

`--input` also accepts the directory containing all four CSV files. Use `--namespace` if the three documented keys live in another shared namespace. Use `--shopify /path/to/shopify` to select an existing CLI installation. `template --out /private/blank-catalog` creates header-only CSV files without a store connection. Exports and previews refuse to overwrite an existing output.

Export requires product, metafield-definition and metaobject read access. Import additionally requires the permissions to create metaobjects and update product/variant metafields. Grant only the scopes required by your store's chosen workflow. This companion does not change app permissions itself.

## What the first version covers

The companion supports up to 100 fetched product handles and 500 selected assignment rows per plan, with variant pagination and exact target resolution. It preserves product titles, descriptions, prices, inventory, publication settings and existing saved entries. It does not export or migrate the legacy five specification slots, translate content, populate sales-channel attribute mappings, parse arbitrary supplier files, synchronize Sheets continuously or provide a merchant-facing import app. Active linked catalog products still need their applicability and Online Store availability checked by the merchant.

The prototype has been checked with the fictional inflator, including an unchanged export, XLSX round trip and a targeted import followed by restoration of the original assignment. Local tests cover blank-cell preservation, duplicate targets/SKUs, stale previews, immutable shared entries and partial failures. This establishes the initial prototype behavior. It does not establish real merchant setup time or usability with supplier files.

[Product specifications](product-specifications.md) · [Compatibility details](product-compatibility.md) · [Included parts and extras](product-parts.md)
