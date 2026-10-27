# Changes

## 0.8.0-beta.1 — in preparation

- Add server-rendered JSON-LD properties for the selected variant's displayed specifications and compatibility guidance. Reuse the visible resolvers, preserve suppression and unknown states, and extend the existing native Product identity without replacing Shopify's product group or offers. Refresh the extension with the product section when variants change; removed or disabled blocks do not expose hidden facts.

- Document a Sidekick-assisted route for preparing supplier facts, reviewing native specification/compatibility/parts entries, selecting product and variant references and reusing preparation instructions as a Sidekick skill. Link it from all three feature guides and retain the optional XLSX downloads. This is guidance based on Shopify's documented capabilities, not a newly verified Sidekick integration.
- Add optional included-parts, required-extras and optional-extras lists to product pages and quick view. Use one reusable native parts set with optional product links and complete variant replacement. Hide empty groups and unconfigured blocks without spacing; linked extras do not establish compatibility or form a bundle. Document setup and keep the downloadable theme ZIP aligned with source.
- Document native parts-set setup and an illustrative, non-purchasable 12 V/24 V walkthrough showing shared details, complete version replacement and optional catalog-link navigation.
- Add a Google Sheets-compatible blank XLSX template, a fictional inflator worked example and a developer-assisted catalog companion for existing specification, compatibility and parts data. Link both workbooks from the relevant setup guides and explain shared/variant data and blank cells. This optional prototype has an initial inflator-demo test. Export current facts, validate XLSX/CSV, preview selected changes, create changed copies of shared entries and apply assignments with compare-and-set protection and private receipts. Native definitions and authenticated Shopify CLI setup remain prerequisites; merchant usability, supplier mappings and live Sheets sync are not established.

- Add editable compatibility profiles with variant-specific requirements, exclusions, notes and a reference on product pages and quick view. Replace whole profiles per variant; show an unknown state when the selected profile is inaccessible or its requirements, exclusions and notes are all empty. Keep unconfigured products hidden by default and provide an opt-in missing-information state. These details do not verify vehicle fit.
- Document native compatibility setup and a live, non-purchasable 12 V/24 V walkthrough. Explain that a profile is a saved set of product compatibility details: leaving requirements blank still allows supplied exclusions or notes to appear. Record merchant data setup and buyer interpretation as validation work.

- Add editable specification-row metaobject lists, selected-variant overrides and explicit row suppression while preserving legacy field mappings. Retain exact variants in quick-view comparison, with dynamic comparison rows and shared facts for unselected catalog picks.

- Add a configurable compact mobile shopping introduction: a short heading, native search and secondary shopping link. Keep the desktop photograph from loading at the compact mobile breakpoint.
- Add compact two-column collection links on phones.
- Hide recommendation comparison by default; related alternatives can opt in per section, while complementary cards keep it hidden. Add an editable recommendation heading.
- Publish a buyer-focused roadmap for auto parts, compatibility information, complete-job shopping and accurate catalog data for agentic commerce.

- Prepare the first MIT-licensed source distribution while keeping the Siftwell Auto design.
- Replace inherited metadata code and redraw media control/badge icons.
- Include clean defaults, the design-led merchant guide and community contribution/support information.
- Add optional, server-rendered rating summaries from Shopify’s standard review fields and a Customer reviews app section. Empty ratings and unconfigured review sections stay hidden from shoppers; real provider integration remains to be verified.

This version is not a tagged release. The fresh-install and essential shopping-path checks remain before beta release.
