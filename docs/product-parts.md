# Included parts and required extras

Help customers answer “What comes in the box, and what else do I need to finish the job?” The optional **Included parts & extras** block separates **In the box**, **Required separately** and **Optional extras** on product pages and in quick view.

Start with one reusable saved set and fill only the lists you need. Products without details stay unchanged. Empty groups are hidden, so an absent required-extras list means information has not been supplied; it does not confirm that nothing else is needed. The merchant supplies the contents and the classification of extras. Product links do not establish compatibility or create a bundle.

## Prepare the facts with Sidekick

Use the [Sidekick workflow](product-data-sidekick.md) to turn supplier box contents into reviewed Parts set entries. Its [parts prompt](product-data-sidekick.md#fill-and-review-the-saved-entries) separates included items, required extras and optional additions. Choose verified product links and product/variant assignments in Shopify's reference pickers. Create a complete set for a differing variant; its empty lists do not inherit shared items. The XLSX examples below remain optional.

## Try the live preview

Open the [Workshop Inflator demo at 12 V](https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548018405). If prompted, enter visitor password **`siftwell`**. This fictional product is labelled **not for sale**, and both variants are sold out. All contents, quantities and requirements are illustrative.

1. Select **12 V** and find **Included parts & extras** below compatibility guidance. The version inherits the shared set: an illustrative inflator and hose, a separately supplied 12 V DC source and an optional catalog link.
2. Switch to **24 V**. Its complete variant set shows a 24 V inflator, heavy-duty hose, separately supplied 24 V DC source and optional work gloves. The 12 V wording and Canvas Tool Roll link disappear.
3. Switch back to **12 V** to restore its shared details. The Canvas Tool Roll is an existing catalog product used only to demonstrate a native link; storage suitability and compatibility have not been checked.
4. Open the [demo in the catalog](https://siftwell-theme.myshopify.com/collections/all?sort_by=created-descending), then select its image to open quick view. Switch versions there and check the same three groups.

The [direct 24 V link](https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548051173) also resolves its complete set on a full page load. The walkthrough demonstrates display and inheritance, rather than real box contents, verified matching or a bundle offer.

## Create one reusable parts set

In Shopify **Settings → Metafields and metaobjects**, create a metaobject definition named **Parts set**, with type **`parts_set`**. Use these exact field keys:

| Field name | Field key | Type | Use |
| --- | --- | --- | --- |
| Entry name | `entry_name` | Single line text | Required; use as the display name in Shopify. Not shown to shoppers. |
| Included items | `included_items` | List of single line text | Optional; one supplied item per entry, such as `Hose × 1`. |
| Required extras | `required_extras` | List of single line text | Optional; items needed separately, such as `Suitable power supply (not included)`. |
| Optional extras | `optional_extras` | List of single line text | Optional; useful additions, such as `Work gloves`. |
| Required products | `required_products` | List of product references | Optional; links to separately required products in your catalog. |
| Optional products | `optional_products` | List of product references | Optional; links to optional products in your catalog. |

Enable storefront access. If Active/Draft is enabled, make the entries you want to display Active. Web-page publishing is unnecessary. Keep quantities in the item text; no separate entry or quantity field is needed for each line. Text-only lists work without either product-reference field being populated.

The text and product links for an extras group appear together in that group's list. Avoid typing the same product again as a text item. The theme does not infer which text line corresponds to which product link or attach a quantity to a link.

Reuse a saved set only where all its contents and requirements are accurate. Changing a shared set changes every product and variant that references it. Use a distinct Entry name to distinguish sets in Shopify.

## Connect products and differing variants

1. Create a **product metafield definition** named Parts set with namespace/key **`siftwell.parts`**. Choose a **Metaobject reference** to Parts set, rather than a list.
2. Assign a saved set to a product. Its details apply to every variant that inherits them, so enter only shared facts here.
3. If versions differ, create the same **variant metafield definition**, with namespace/key **`siftwell.parts`**, restricted to Parts set. Variant setup is unnecessary when every version shares the same contents.
4. Create a complete saved set for each differing variant and assign it to that variant. Empty lists in an assigned variant set remain empty.
5. Make the definitions accessible to the storefront where that setting is offered.

Installing the theme does not create definitions, saved sets or product values. If you already have a suitable metaobject definition with these field keys and types, reuse it through the theme's namespace/key mapping. A different supplier spreadsheet or existing field structure needs mapping; the theme does not copy it automatically.

## Display the optional block

In **Theme settings → Included parts & extras**, leave **Show included parts and extras** enabled. Set **Parts metafield namespace** to `siftwell` and **Parts metafield key** to `parts`, or match your existing suitable definition.

Add **Included parts & extras** to each relevant product template. The source's default template places it after compatibility guidance, below the buying controls and specifications. Existing installed templates need the block added in the theme editor. Move or remove the block without changing its saved data.

Quick view uses the same mapping and selected-version details below the buying controls. The global switch controls both views. Empty output leaves no parts wrapper or extra spacing. Cards and comparison tables are unchanged.

## How versions and missing data behave

| Situation | Display |
| --- | --- |
| No saved set on the variant | Inherit the complete product set. |
| A set is assigned to the variant | Replace the entire product set, including its product links. |
| The assigned variant set is empty or inaccessible | Hide this block. Never restore another version's contents or extras. |
| A group is empty | Hide only that group. No “nothing else required” claim is made. |
| No saved set is configured | Hide the block without an empty-state prompt. |
| The selected option combination has no variant | Hide the block; no other version's details are shown. |
| The global switch is off | Hide the feature on product pages and in quick view. |

Clearing a variant's reference restores product inheritance. To deliberately withhold shared details for one version while you prepare its contents, assign an Active set containing only an Entry name.

The first ten entries of each text list and each product list are processed. Blank text, inaccessible product references and links to the product being viewed are omitted. Duplicate product links within a group appear once. If the same product is linked as both required and optional within those limits, it appears only under Required separately. Plain text and product titles are escaped.

Product references use Shopify's native product URLs. A link opens the product page, where the buyer can choose the correct variant and inspect current price and availability. This feature does not add extras to the bag, choose a linked product's variant, reserve stock, apply a bundle price or verify that an extra suits the selected version.

## Worked example

Download the [worked inflator example (.xlsx)](downloads/Siftwell-inflator-worked-example.xlsx) and open **Assignments** and **Parts** to see shared contents and a complete 24 V replacement set, including removal of the shared example product link. Use the [blank template (.xlsx)](downloads/Siftwell-catalog-template.xlsx) for your own verified contents. This is an optional data-entry prototype; importing needs developer assistance. See the [spreadsheet workflow and limits](catalog-data.md#download-the-template-and-inflator-example).

These fictional contents illustrate setup, not real product claims:

| List | Shared workshop inflator set | Complete 24 V variant set |
| --- | --- | --- |
| Included items | `12 V inflator × 1`; `Hose × 1` | `24 V inflator × 1`; `Heavy-duty hose × 1` |
| Required extras | `Suitable 12 V supply (not included)` | `Suitable 24 V supply (not included)` |
| Optional extras | Example tool-roll link; suitability unverified | Protective work gloves; supplied separately |

Assign the shared set to the product and the complete 24 V set to its differing variant. Switching to 24 V replaces every list; the 12 V supply and any shared product links must disappear. If an item has a verified suitable product in your catalog, you can add its native product reference to the appropriate extras group. Include any quantity or setup constraints in clear text.

## Check the buyer's question

Preview shared, overridden, unconfigured and empty variant sets on the product page and in quick view. Switch versions and open a direct variant URL without JavaScript. Check phone widths, keyboard access to product links, the global switch and an inaccessible reference.

Ask a buyer to identify two included items, something required separately and an optional extra. Confirm that the buyer can distinguish a product suggestion from verified compatibility. Test setup effort with one real product family before filling a whole catalog. Correct rendering does not establish fewer incomplete orders or improved conversion.

Translate saved text using Shopify's supported translation tools while preserving field keys. Translate fixed group labels through the theme content editor. Linked titles use the product's translated title where available.

## Optional spreadsheet setup

The [spreadsheet workflow](catalog-data.md) provides the template, filled example and developer-assisted export, preview and import companion for these existing sets. It has an initial inflator-demo test. You can also maintain the sets directly in Shopify. A merchant-facing editor, automatic supplier parsing and live spreadsheet sync remain unimplemented. Installation guides, bundles and verified matching remain separate work.

[Set up specifications](product-specifications.md) · [Explain compatibility](product-compatibility.md) · [Shopify metafields in Liquid](https://shopify.dev/docs/api/liquid/objects/metafield) · [Shopify metaobjects](https://shopify.dev/docs/api/liquid/objects/metaobject)
