# Specifications for the part the buyer selects

A socket set, electrical accessory and cleaning product need different facts. Siftwell supports editable specification rows for each product, with overrides for the selected variant. The same renderer supplies the product page, quick view and comparison.

Keep important facts beside the buying controls using the **Product specifications** block. Customers can read them without opening a tab. A small caption identifies the selected variant on products with options.

## Prepare the facts with Sidekick

For a first product family, use the [Sidekick workflow](product-data-sidekick.md) to prepare facts from supplier text, fill reviewed Specification row entries and reuse shared rows. Follow the [specification prompt](product-data-sidekick.md#fill-and-review-the-saved-entries), then select the saved row references on the product and any differing variants. The definitions below are a one-time setup; a spreadsheet importer is optional.

## Try the live auto-parts preview

Open the [Workshop Inflator demo](https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo). If prompted, enter visitor password **`siftwell`**. This fictional product is labelled **not for sale**; both versions have zero tracked stock and cannot be purchased. Its figures and prices demonstrate the theme, not verified performance or vehicle fit.

1. Select **12 V**: Input voltage is 12 V, Connector is DC plug and Rated output is 150 W.
2. Select **24 V**: Input voltage becomes 24 V, Rated output becomes 300 W, Connector disappears and Cable length appears as 2 m.
3. Open the [demo in the catalog](https://siftwell-theme.myshopify.com/collections/all?sort_by=created-descending), then select its image to open quick view. Select 12 V and press **Compare**; switch to 24 V and press **Compare** again. Close quick view and open **Compare products** to see both versions with separate names, prices, facts and links. A dash marks a fact absent from that version.

Direct variant links also work on a full page load: [12 V](https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548018405) · [24 V](https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548051173).

## Choose the information that changes the decision

| Product family | Useful examples |
| --- | --- |
| Electrical accessories | Input voltage, connector, rated output, cable length |
| Workshop tools | Drive size, torque range, included sizes, battery platform |
| Care products | Capacity, suitable surfaces, dilution, application method |

These are examples, not supplied product claims. Enter verified information for your own catalog. The feature displays your facts; it does not check vehicle compatibility, infer missing facts or alter shipping weight.

## Keep an existing five-field setup

Existing **Theme settings → Product specifications** mappings continue to work. The default namespace is `siftwell` and keys are `weight`, `material`, `fit`, `feature` and `best`. Use a Weight metafield for weight and text fields for the others.

To override one of these values for a variant, create a **variant metafield definition** with the same namespace, key and type, then fill it on that variant. A populated variant field overrides its product field. An absent or empty variant field inherits the shared product value. Empty resolved values disappear. Translate the five labels through the theme content editor.

The flexible rows below provide custom labels, ordering and explicit per-variant suppression.

## Create the Specification row metaobject

In Shopify **Settings → Metafields and metaobjects**, add a metaobject definition named **Specification row**. Admin wording can vary. Add these fields with the exact field keys:

| Field name | Field key | Type | Rule |
| --- | --- | --- | --- |
| Code | `code` | Single line text | Required; stable identity such as `input-voltage` |
| Label | `label` | Single line text | Buyer-facing name, such as Input voltage |
| Value | `value` | Multi-line text | Plain facts and units, such as 12 V |

Keep Label and Value optional so a variant override can inherit a label or intentionally suppress a row. For easier selection in Shopify, optionally add a single-line **Entry name** field with key `entry_name` and use it as the definition's display name. Give entries distinct names such as “Demo — Input voltage — 12 V” and “Demo — Input voltage — 24 V”. The theme reads only Code, Label and Value. Enable storefront access. If the definition has an Active/Draft status, publish the entries you reference. Web-page publishing is not needed.

Use unique lowercase codes with hyphens. A code must mean the same thing wherever it is used: `input-voltage` should not mean output voltage on another product. Comparison joins facts by code. Translations may change labels and values, but should keep codes unchanged.

## Connect lists to products and variants

1. Add a **product metafield definition** named Specification rows, namespace and key **`siftwell.specifications`**. Choose a **List of metaobject references**, restricted to Specification row.
2. Add the equivalent **variant metafield definition**, using the same namespace, key, list type and definition.
3. Make both definitions accessible to the storefront where that setting is offered.
4. In **Theme settings → Product specifications**, keep **Metafield namespace** as `siftwell` and **Specification rows metafield key** as `specifications`. Existing definitions can use a different shared namespace/key through these settings.
5. Add the **Product specifications** block to your product template. Quick view and comparison use the same mapping automatically.

Installing the theme does not create definitions, entries or values. Prefer existing suitable Shopify standard definitions for your wider product-data setup; these row references organize the theme's display and do not automatically map facts into every sales or AI channel.

## Worked example: 12 V and 24 V versions

For a spreadsheet version, download the [worked inflator example (.xlsx)](downloads/Siftwell-inflator-worked-example.xlsx) and open **Assignments** and **Specifications**. The shared rows and 24 V overrides below use the same rules. The [blank template (.xlsx)](downloads/Siftwell-catalog-template.xlsx) is for your own data. This optional prototype requires developer assistance to import; see the [spreadsheet workflow](catalog-data.md#download-the-template-and-inflator-example). It covers flexible specification rows, not the legacy five fields.

Create separate row entries, then select them in the appropriate product or variant list. A product list establishes order and shared facts:

| Product row code | Label | Value |
| --- | --- | --- |
| `input-voltage` | Input voltage | 12 V |
| `connector` | Connector | DC plug |
| `rated-output` | Rated output | 150 W |

On the **24 V variant**, select override entries:

| Variant row code | Label | Value | Result |
| --- | --- | --- | --- |
| `input-voltage` | Leave blank | 24 V | Replaces the value and retains Input voltage |
| `connector` | Leave blank | Leave blank | Hides the shared connector row |
| `rated-output` | Rated output | 300 W | Replaces the shared value |
| `cable-length` | Cable length | 2 m | Adds a new row at the end |

The figures illustrate setup only. A product-level value is an intentional fallback for every variant without an override; use it only when that fallback is accurate. Add an override to every variant that differs. Removing an override restores inheritance. A missing variant fact does not establish fit.

A populated product row list replaces the five legacy slots for that product. Clearing the list restores the legacy setup. If the product keeps legacy slots, a variant row with the matching code (`weight`, `material`, `fit`, `feature` or `best`) can override or suppress that slot, and new codes append.

## How selection and comparison behave

- Product pages and quick view resolve the selected variant's rows when options change. Variant URLs also resolve on a full page load without JavaScript. A combination that does not exist shows no specifications for another variant.
- A catalog Compare checkbox selects the product's **shared facts**. It does not silently select a version of a configurable product.
- Compare in quick view selects the **exact variant**, showing its option name, base variant price, facts and variant URL. Two versions can occupy two of the three comparison slots. Changing options does not rewrite an earlier comparison pick.
- Products with options still use **Choose options** to reach their purchase controls. Specification comparison does not compare subscription plans, quantity-price tiers or prove compatibility.
- Shared rows keep product order; new variant rows append in variant-list order. The first 20 entries of each list are processed. Keep codes unique: the first occurrence wins. Empty labels/values hide standalone rows; a matching blank variant value suppresses the shared row.
- Comparison includes the union of available row codes, with a dash for a missing value. With no specifications it retains the vendor/type fallback. Keep labels, meanings and units consistent across comparable items.

## Server-rendered facts and JSON-LD

A direct product URL with `?variant=ID` includes that version's resolved specifications in the initial HTML. JavaScript switching requests another server-rendered product section. The product page also supplies the displayed specifications as JSON-LD [PropertyValue entries](https://schema.org/PropertyValue), attached to the selected variant's existing Shopify Product identity. The same resolver applies inherited labels, overrides, suppressed rows, ordering and limits in both formats.

Only facts from a Product specifications block present on that product template are included. Shopify's native product group, variant identifiers, offers, prices and availability remain intact. The extra JSON-LD describes the selected version, not every version's custom facts at once. Use exact variant links when sharing a recommendation. Additional structured facts do not guarantee indexing, a rich result or use by an assistant.

## Check your setup

Preview a product with two materially different variants. Change options on the product page and in quick view; confirm the caption and facts change together. Open a direct variant URL. Compare both variants and check names, values and links. Check a product with no custom rows to confirm the old fields remain usable.

If rows are missing, check storefront access, entry status, list type, exact field keys and populated labels/values. Check the namespace/key mapping and the product-template block. An empty variant override may be deliberately hiding a row. A product row list replaces the legacy list rather than adding to it.

Translate metaobject labels and values with Shopify's supported translation tools. Keep codes stable. Use consistent units and document uncertainty rather than entering a reassuring but unverified fit claim.

[Add compatibility requirements and exclusions](product-compatibility.md) · [Shopify metafield definitions](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions) · [Metaobjects in Liquid](https://shopify.dev/docs/api/liquid/objects/metaobject) · [Variant handling](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)
