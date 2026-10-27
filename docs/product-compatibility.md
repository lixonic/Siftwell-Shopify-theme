# Compatibility and requirements for the selected version

Auto-parts buyers need to establish whether a part works with their vehicle or equipment. Use **Compatibility & requirements** for merchant-supplied requirements, exclusions, application notes and a manufacturer reference. Keep concise facts visible beside the options and buying controls.

The block presents supplied information. It does not select a vehicle, match year/make/model, verify a source or confirm fit. Specifications such as voltage alone do not establish compatibility. A compatibility profile is a saved set of these details in Shopify that a merchant links to a product or variant.

## Try the live preview

Open the [Workshop Inflator demo at 12 V](https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548018405). If prompted, enter visitor password **`siftwell`**. This fictional product is sold out and labelled **not for sale**. All figures, prices and requirements are illustrative; the demo does not provide a verified vehicle match.

1. Select **12 V**. This variant inherits the product profile: a 12 V DC supply and matching DC accessory connection are required, and a 24 V supply is excluded. The notes explain that voltage alone does not establish vehicle fit.
2. Switch to **24 V**. Its intentionally empty variant profile replaces the product profile. **Compatibility not confirmed** appears, and the 12 V requirements, exclusion and reference disappear.
3. Open the [demo in the catalog](https://siftwell-theme.myshopify.com/collections/all?sort_by=created-descending), then select its image to open quick view. Switch between 12 V and 24 V there too. The compatibility guidance should follow the selected version in both quick view and the product page.

The empty 24 V profile demonstrates an honest unknown state. It does not establish that the product is compatible or incompatible with a particular vehicle or setup.

## Create a Compatibility profile

For data-entry examples, download the [worked inflator example (.xlsx)](downloads/Siftwell-inflator-worked-example.xlsx) and open **Assignments** and **Compatibility**. It shows a shared 12 V profile and an entry-name-only 24 V profile for the unknown state. Use the [blank template (.xlsx)](downloads/Siftwell-catalog-template.xlsx) for your own verified facts. The spreadsheet is optional, and importing still requires developer assistance. Read the [workflow and limits](catalog-data.md#download-the-template-and-inflator-example) before using it.

In Shopify **Settings → Metafields and metaobjects**, create a merchant-owned metaobject definition named **Compatibility profile**, with type **`compatibility_profile`**. Use these exact field keys:

| Field name | Field key | Type | Rule |
| --- | --- | --- | --- |
| Entry name | `entry_name` | Single line text | Required; use as the display name in Shopify |
| Requirements | `requirements` | List of single line text | Optional; one condition per item |
| Exclusions | `exclusions` | List of single line text | Optional; one unsuitable application per item |
| Application notes | `application_notes` | Multi-line text | Optional; precise supported applications and limitations |
| Reference URL | `reference_url` | URL | Optional; manufacturer manual or compatibility reference |
| Reference label | `reference_label` | Single line text | Optional; describes the linked document |

Enable storefront access. If Active/Draft is enabled, publish the entries you reference. Web-page publishing is unnecessary. Use verified information and an accurate reference label; the presence of a link does not mean Siftwell has verified it.

Keep the lists short. The theme renders the first ten requirements and first ten exclusions, omitting blank items. Notes and list items are escaped plain text. Only HTTP(S) reference URLs become links.

## Connect the profile to products and variants

1. Add a **product metafield definition** named Compatibility profile, namespace/key **`siftwell.compatibility`**. Choose a **Metaobject reference** to Compatibility profile, rather than a list.
2. Add the same definition for **variants**, with the same namespace/key and reference type.
3. Make both definitions accessible to the storefront where that setting is offered.
4. Create a profile containing the product's requirements, then select it in the product metafield. Shared information must be accurate for every variant that inherits it.
5. For any differing variant, create and select its complete profile. Include its applicable requirements, exclusions, notes and reference. An empty field in a variant profile stays empty; it does not inherit that field from the product profile.

Installing the theme does not create definitions, profiles or product values. Existing suitable definitions can be reused through the mapping settings below.

## Display it in the theme

In **Theme settings → Compatibility & requirements**, enable **Show compatibility guidance**. Keep **Compatibility metafield namespace** as `siftwell` and **Compatibility profile metafield key** as `compatibility`, or match your existing definitions.

Add the **Compatibility & requirements** block to each relevant product template. The source's default template places it below the buying controls and specifications, keeping the option-to-purchase path together. Existing installed templates need the block added in the theme editor. It can be moved or removed without altering your data.

Quick view uses the same mapping and selected-variant renderer, placed below the buying controls. The global switch controls both views. This first version does not add fit information to cards or comparison tables.

## Inheritance and honest unknown states

- **No variant profile:** inherit the product profile as a complete unit.
- **Variant profile selected:** replace the entire product profile. Do not carry across a missing exclusion or reference URL.
- **Selected profile with no requirements, exclusions or application notes, or an inaccessible profile:** show **Compatibility not confirmed**. A draft/unavailable reference must not silently restore the product's requirements.
- **No such option combination:** show no other variant's requirements. When compatibility guidance applies, show the unknown state.
- **No profile configured:** hide the block by default. Enable **Show an unknown state without a profile** when missing compatibility information should be explicit throughout the catalog.

Leaving Requirements empty alone does not trigger the unknown state when exclusions or application notes are present; the theme shows the supplied details. A reference link alone can still appear, but does not remove the unknown state. Merchants who have not set up any compatibility details get no block by default.

To mark a particular variant as awaiting information, create an active profile containing only an Entry name and assign it to that variant. That deliberately replaces the shared profile with an unknown state. Clearing the variant's reference restores inheritance, so do not clear it to mean “not confirmed”.

Populated profiles remind buyers to match the information to their vehicle or equipment and state that vehicle fit has not been checked. There is no automatic Compatible badge. A legacy Fit specification remains ordinary merchant-supplied text and does not override these rules.

## Check the buying decision

Preview a product with different versions. Switch options on the product page and in quick view; confirm that the context, requirements, exclusions and reference all belong to the selected version. Open a direct variant URL without JavaScript. Test an empty profile and an inaccessible reference. Check a product without a profile and the global off switch.

Ask a buyer to identify the required setup, an explicit exclusion and what they still need to confirm. Observe whether the reference helps them answer those questions. A working display does not prove fewer wrong orders or returns.

Translate profile text through Shopify's supported translation tools, keeping the underlying field keys unchanged. Fixed labels and unknown-state text can be translated through the theme content editor.

## Next: verified matching

Vehicle selection and verified fitment matching need suitable merchant-owned or licensed application data and a matching service. A saved vehicle, a supplied requirement or an AI recommendation does not establish fit. The current feature makes the known requirements and remaining uncertainty visible.

[Set up variant specifications](product-specifications.md) · [Shopify metaobjects](https://shopify.dev/docs/api/liquid/objects/metaobject)
