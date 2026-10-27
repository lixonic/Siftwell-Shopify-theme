# Set up product facts with Sidekick

For a first product family, use Sidekick in Shopify admin to turn existing supplier information into reusable specifications, compatibility details and parts sets. Review the facts, save the entries, then select their references on the products and variants that use them. Once the native definitions are in place, this route needs no spreadsheet importer or additional app.

Shopify documents Sidekick assistance for [creating and editing metaobject entries](https://help.shopify.com/en/manual/custom-data/metaobjects/creating-entries) and [filling product metafields](https://help.shopify.com/en/manual/custom-data/metafields/adding-values-to-metafields), with review before saving. The recipe below applies that assistance to Siftwell's existing fields. It has not been verified end to end in Sidekick with Siftwell, and does not promise automatic batch creation or variant-reference assignment.

The repeatable path is: **supply facts → review the draft → save reusable entries → select references → preview each variant**. Save the preparation instructions as a Sidekick skill when you are happy with the first result.

## Set up the fields once

Choose only the features your products need. Follow the existing guides to create their definitions, enable storefront access and add the relevant product blocks. Installing the theme does not create the data structure. Sidekick can guide you through setup; confirm the exact keys and types in Shopify before entering facts.

| Feature | Saved entries | Product and variant metafield |
| --- | --- | --- |
| [Specifications](product-specifications.md#create-the-specification-row-metaobject) | Specification row: one entry per code, label and value | `siftwell.specifications`: **list** of Specification row references |
| [Compatibility](product-compatibility.md#create-a-compatibility-profile) | Compatibility profile: requirements, exclusions, notes and reference | `siftwell.compatibility`: **single** Compatibility profile reference |
| [Included parts and extras](product-parts.md#create-one-reusable-parts-set) | Parts set: included items, required/optional extras and optional product references | `siftwell.parts`: **single** Parts set reference |

If you already use different mappings, follow the names and keys configured in your theme. Keep specification codes consistent across comparable products. Create variant definitions only where versions need their own data. Entries must be Active if the definition has an Active/Draft setting.

## Start with one family and its source facts

Open the product in Shopify admin and open Sidekick. Type `@` and select the actual product, so the conversation refers to the correct item. Identify each differing variant by its option values and its SKU if one exists. Open the exact variant in admin if its identity is unclear. You can also mention an existing metaobject or definition. [Shopify's context controls](https://help.shopify.com/en/manual/ai-powered-tools/sidekick/help-and-guidance#giving-sidekick-context-with-mentions-and-target-mode).

Paste the relevant supplier text or spreadsheet cells into the chat. Where document uploads are available, you can attach a supplier PDF or CSV. Some stores accept only image attachments; pasting the source text remains an alternative. For our XLSX examples, copy the relevant cells or export a working tab as CSV. [Sidekick attachments](https://help.shopify.com/en/manual/ai-powered-tools/sidekick/set-up#attaching-files-to-a-chat).

Replace the placeholders in this prompt and supply the source text:

```text
Prepare Siftwell product facts for the product I mentioned and these variants:
[option values and SKUs where available]. Use only the source information below.

Draft a table in chat first; do not change store data yet. Separate shared
product facts from variant differences. For each fact, show its source
excerpt and the product or variant it applies to.

Group the result into specifications, compatibility and parts. Preserve
units, quantities and specification codes. Separate included items,
required extras and optional extras. Do not infer fit or box contents from
a product name, image or voltage. List missing facts as questions.

Propose product defaults only for variants that can accurately inherit them.
Distinguish unknown facts from deliberate blank overrides. List any existing
saved entries that could be reused without changing them.

Source information:
[paste verified supplier text, revision and relevant page or row references]
```

Check the source excerpts and variant mapping before continuing. Keep unresolved facts in the questions list. A missing specification must not become a blank variant override unless you intend to hide that shared specification.

## Fill and review the saved entries

Go to **Content → Metaobjects**, open the relevant definition and choose **Add entry**. Ask Sidekick to fill the current form from the approved facts. Work through one entry at a time, reviewing the populated fields before clicking **Save**. If a field cannot be filled, enter the approved value in its native control. [Shopify's form assistance](https://help.shopify.com/en/manual/ai-powered-tools/sidekick/help-and-guidance#completing-forms-and-tasks-with-sidekick).

Use clear entry names such as “Workshop inflator — 24 V — parts” so you can find them later. Reuse an existing entry when its complete contents are accurate. Editing a shared entry can change every product that references it; create a separate entry when only one product or variant should differ.

### Specification row prompt

Repeat this for each approved row. Give an optional Entry name field a distinctive name if your definition includes it.

```text
Fill this new Specification row form with these approved values:
code: [stable code, for example input-voltage]
label: [approved label]
value: [approved value and units]

Keep the code unchanged. Do not fill an intentional blank label or value.
Do not edit existing entries or assign this row to a product yet.
Leave the completed form for my review and Save.
```

For a variant override, a blank label can inherit the shared label. A matching code with a deliberately blank value suppresses the shared row. A new code needs a label and value. Keep each list within 20 rows.

### Compatibility profile prompt

```text
Fill this new Compatibility profile form from these approved values:
entry_name: [distinctive internal name]
requirements: [one approved requirement per list item]
exclusions: [one approved exclusion per list item]
application_notes: [approved notes]
reference_url: [actual supplier reference URL, or leave empty]
reference_label: [accurate reference label, or leave empty]

Keep the approved empty fields empty. Do not invent a URL or claim verified
vehicle fit. This is the complete profile for [product or exact variant].
Do not edit existing profiles. Leave the form for my review and Save.
```

A variant profile replaces the whole product profile. Include all facts that apply to that variant; individual empty fields do not inherit. To deliberately show **Compatibility not confirmed**, use an Active profile containing only an Entry name. Keep requirements and exclusions within ten items each.

### Parts set prompt

```text
Fill this new Parts set form from these approved values:
entry_name: [distinctive internal name]
included_items: [one included item and quantity per list item]
required_extras: [one required, separately supplied item per list item]
optional_extras: [one optional item per list item]

This is the complete set for [product or exact variant]. Keep approved
empty lists empty. Leave required_products and optional_products unselected;
I will choose verified catalog products in Shopify's reference picker.
Do not infer suitability, edit existing sets or create products.
Leave the form for my review and Save.
```

Choose any linked extras in the native product-reference pickers after checking their suitability and availability. A typed product name or URL in a text list does not create a product reference. Keep each text or product list within ten items. A variant parts set replaces every shared list and product link.

## Link the entries to products and variants

Creating an entry does not display it on a product. In the product's **Metafields** section, select the shared entries using Shopify's pickers and save:

- **Specification rows:** select the shared row entries in the desired order.
- **Compatibility profile:** select one complete shared profile.
- **Parts set:** select one complete shared set.

Open each differing variant and select its overrides in that variant's metafields. A variant without an assignment inherits the shared product data. Leave an existing override in place unless you intend to change it. Clearing its reference restores inheritance.

For specifications, select only rows that override, suppress or add to the shared rows. For compatibility and parts, select a complete replacement profile or set. Use Shopify's picker to confirm the actual saved entries. If Sidekick offers to fill a supported reference field, review its selection against this same list before saving; do not assume a chat response has completed the assignment.

For many products that reuse the same sets, use [Shopify's metafield bulk editor](https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields) to reduce repeated selection. Keep product and variant assignments explicit.

## Walk through the inflator example

Use the [filled inflator XLSX](downloads/Siftwell-inflator-worked-example.xlsx) as a reading example alongside the [live walkthrough](product-specifications.md#try-the-live-auto-parts-preview). Its identifiers and facts are fictional; replace them for your own catalog. The [blank template](downloads/Siftwell-catalog-template.xlsx) is optional for organizing your source facts.

| Target | Specifications | Compatibility | Parts |
| --- | --- | --- | --- |
| Shared product | Input voltage 12 V, Connector DC plug, Rated output 150 W | Illustrative 12 V requirements | Complete illustrative 12 V set |
| 12 V variant | No new override | No new override | No new override |
| 24 V variant | Override voltage/output, suppress Connector, add Cable length | Entry-name-only profile, showing unknown | Complete 24 V set, without the shared tool-roll link |

On an existing catalog, “no new override” means keep the current assignment; clear it in Shopify only when you deliberately want inheritance. Do not copy the example's illustrative requirements into a real product.

Preview the product page and quick view, switch variants and open a direct variant URL. Confirm the correct facts appear, an unknown profile stays unknown, and 24 V does not retain the 12 V contents or links. For specification comparison, compare the exact variants from quick view.

## Reuse the instructions for the next family

After reviewing your first family, save the preparation instructions as a Sidekick skill through **Sidekick → + → Skills → New Skill**. Choose a shortcut such as `/siftwell-facts` and use the instructions below. When running it, select the skill or type its shortcut and provide the new product and supplier source. [Shopify's Sidekick skills guide](https://help.shopify.com/en/manual/ai-powered-tools/sidekick/skills).

```text
Prepare a review table of Siftwell specifications, compatibility and parts
for the explicitly selected product and variants, using supplied source
facts only. Show source excerpts, shared defaults, variant differences,
reusable existing entries and unresolved questions. Preserve codes, units
and quantities. Treat compatibility and parts overrides as complete sets.
Never infer fit, invent facts or turn an unknown fact into a blank override.
Do not modify existing shared entries or store data during preparation.
Ask for the product, variant identifiers or source facts if they are missing.
```

The skill reuses your preparation instructions. It does not create missing definitions or make facts trustworthy without review. For larger imports, retain the [optional spreadsheet workflow](catalog-data.md) or evaluate a suitable bulk-editing app. This guide covers assisted setup, not continuous supplier synchronization or verified fitment matching.
