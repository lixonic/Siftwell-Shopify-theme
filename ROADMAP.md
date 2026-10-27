# Siftwell roadmap

Updated 27 October 2026. Siftwell is an MIT-licensed theme for auto parts, accessories and tools. Priorities follow the buyer's decision: find the right item, establish what is known about fit, understand the differences and finish the job.

The hypothesis is that accurate information and clear next steps will help both shoppers and shopping assistants make better recommendations and purchase decisions. Confidence, conversion and return improvements remain hypotheses to test with real stores.

## Delivered in the current source

- **Compact mobile shopping introduction.** A short, editable shopping heading, native product search and a secondary finder/shop link replace the tall slogan and photograph on phones. The desktop composition stays available. Compact collection links bring the catalog closer.
- **Recommendations with a clear purpose.** Recommendation cards no longer inherit comparison by default. Related recommendations can opt into comparison when they contain genuine alternatives; complementary recommendations keep comparison hidden. Merchants can give each section an accurate heading.
- **Variant-aware specifications.** Editable product row lists, selected-variant overrides, explicit row suppression and legacy five-field support now share one renderer across product pages, quick view and comparison. Quick-view comparison retains the selected variant; catalog comparison uses shared product facts. [Merchant setup and worked example](docs/product-specifications.md).
- **Compatibility & requirements.** Saved sets of product compatibility details use native product/variant profiles to display requirements, exclusions, application notes and a reference. Variant profiles replace the complete shared profile. Unconfigured products stay hidden by default; an assigned profile with no requirements, exclusions or notes shows Compatibility not confirmed. Empty requirements alone do not hide available notes or exclusions. This interface does not perform vehicle matching. [Setup guide and live walkthrough](docs/product-compatibility.md#try-the-live-preview).
- **Included parts and required extras.** One reusable saved set separates box contents, required extras and optional additions on product pages and in quick view. Native product links are optional; a differing variant replaces the entire set. Empty groups and unconfigured products leave no block or spacing. The merchant supplies applicability; these links do not verify compatibility or create bundles. [Setup guide and live walkthrough](docs/product-parts.md#try-the-live-preview).
- **Spreadsheet setup prototype.** A Google Sheets-compatible XLSX template and developer-assisted companion export current facts, validate XLSX/CSV, preview changes and apply selected assignments. Changed shared entries are copied rather than edited in place. Existing native definitions and authenticated Shopify CLI access are required; this is not a merchant app or live Sheets sync. [Workflow and limits](docs/catalog-data.md).
- **Existing foundations.** Native Shopify product/cart flows, quick view, optional three-product comparison, semantic server-rendered pages, Shopify product structured data and review-app insertion points.

The first MIT beta still needs the fresh-install and essential shopping-path release gate. Source checks and individual demo checks do not establish every checkout, device, app or market configuration.

## Continue one feature at a time

Specifications, compatibility guidance and included parts with required/optional extras are implemented in the current source. Validate whether merchants can supply and maintain useful details before expanding those interfaces. The theme does not fill missing compatibility facts or infer fit from a product title, voltage or AI recommendation.

**Easier catalog data setup has an optional prototype.** The blank XLSX, fictional inflator worked example and developer-assisted import companion are implemented in the current source. They export existing facts, reuse shared details and preview selected changes. The initial inflator-demo test is complete for this checkpoint. Real supplier-column mapping, merchant setup effort and ongoing maintenance can be evaluated later with an actual product family. Begin with Shopify's native bulk editor for small assignment changes. The companion covers variant metafields and saved-entry creation that a native product CSV alone does not complete. A merchant-facing editor, automatic supplier parsing and live spreadsheet sync remain unimplemented. [Spreadsheet workflow and downloads](docs/catalog-data.md), [Shopify CSV capabilities](https://help.shopify.com/en/manual/products/import-export/using-csv), [native metafield bulk editing](https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields).

For the first product family, the [Sidekick-assisted setup guide](docs/product-data-sidekick.md) documents a native route: prepare supplied facts, review entry forms, select product/variant references and reuse the preparation instructions as a Sidekick skill. This combines Shopify's documented assistance with the existing Siftwell data model; it is not an end-to-end tested Sidekick integration. Keep the workbook/importer optional and defer a separate merchant editor while this documented route is evaluated.

Test whether buyers can identify box contents and remaining requirements, and whether merchants can prepare accurate data with less effort. Installation guidance, bundles, saved project lists and verified matching remain separate work.

## Understand the buying situation

| Buying situation | Question to answer | Product direction |
| --- | --- | --- |
| The buyer knows the part | Can I find the exact item or variant quickly? | Useful names, visible identifiers, native search and clear availability |
| A novice DIY buyer | Does this fit my setup, and can I install it? | Requirements, exclusions, manuals, required tools and an honest unknown state |
| An experienced buyer or enthusiast | What meaningful difference justifies this version? | Category-specific facts, consistent units and relevant alternatives |
| A buyer using an installer | Can I confirm this choice with someone and get it when needed? | Exact-variant links, accurate pickup/delivery information and practical support |
| A buyer preparing a project | What is included and what else must I buy? | Required versus optional components and complete-job checklists |
| A buyer arriving from an assistant | Can I verify the recommendation against current facts? | Clear product-page arrivals, exact variants, live commerce information and traceable policies |

These situations are design hypotheses, not fixed personality types. Scrolling to recommendations does not establish that a customer has decided to purchase.

## Next: verify the foundation and the decision

1. **Finish the beta gate.** Verify a fresh installation and essential shopping paths, including keyboard and no-JavaScript fallbacks. Extend real browser, physical-device, screen-reader and review-provider coverage. Keep unresolved checks in [known limitations](docs/known-limitations.md).
2. **Evaluate the mobile introduction.** Test finding a known product and starting from a buying need on narrow phones. Check search, collection-link understanding, first-product visibility and task completion. A smaller hero alone is not evidence that customers find suitable products.
3. **Verify recommendation relevance.** Curate alternatives separately from accessories and general discovery. Check that labels explain the relationship, comparison has a common buying question and accessories do not imply unverified compatibility.
4. **Make comparison explain its next step.** Test selection-to-open behavior and improve selected-item feedback. Explore an explicit “Compare with this product” flow with the current product visibly included. That flow is planned, not implemented by the recommendation checkbox setting.

## Then: build confidence in the exact item

### Validate variant-aware specifications

The display and inheritance feature is implemented. Next, test setup with real merchant catalogs, check that codes and units remain consistent across comparable products, and evaluate whether buyers can identify the differences that matter. Add concise specification summaries to cards only when their value is demonstrated. Channel-specific catalog mappings remain a separate integration task.

### Compatibility with explicit evidence

Requirements, exclusions, application notes, references and unknown states are implemented in the compatibility block and demonstrated with illustrative 12 V/24 V variants. Next, validate merchant setup and buyer interpretation with real catalogs:

- Start with one product family. Check where verified requirements, exclusions, notes and references already exist, and how the merchant keeps them current. Evaluate mappings to existing suitable fields before asking for duplicate data entry.
- Test setup with a sparsely populated catalog. No assigned profile means no block by default. An assigned but empty or inaccessible profile shows an unknown state; the catalog-wide missing-information setting remains opt-in. Leaving requirements blank alone still displays any supplied exclusions or notes. No storefront behaviour change is needed for an untouched catalog.
- Ask buyers to identify the selected version's requirements, an exclusion and what still needs confirmation. Test whether they understand that an unknown state means information is missing, rather than a verified compatible or incompatible result.

Add provider-backed vehicle/configuration matching only when the application data and service are suitable. A saved vehicle is context, not evidence of fit. Do not treat separate year, make and model lists as valid combinations.

The theme supplies the interface and integration contract. Merchants supply owned or licensed fitment data; larger catalogs may need a dedicated index or app. ACES and PIES integrations must respect reference-data licensing. [Auto Care ACES](https://www.autocare.org/aces), [Auto Care PIES](https://www.autocare.org/pies).

### Complete-job information

Included-parts and required/optional-extras displays are implemented. The hypothesis is that distinguishing what is supplied from what still needs buying can reduce uncertainty about completing a job. Test whether buyers can identify the box contents and any remaining requirements; do not assume fewer incomplete-kit purchases without evidence. Validate the spreadsheet/import prototype with real merchant data before expanding the data model.

Follow with installation requirements, manuals, warranty and returns as separate additions. Use real fulfillment data or clearly qualified delivery estimates. Evaluate installation questions, incomplete-kit purchases and wrong-fit returns.

### Saved decisions and project lists

Explore guest shortlists that retain exact variants and refresh price and availability. Add project checklists when repeated project shopping is demonstrated. Account sync, shared/private lists, alerts and collaborative editing need a backing service. Native Shopify cart state remains authoritative.

## Agentic commerce: dependable facts before an assistant

- **Audit product identity and content.** Check representative products for descriptive titles, genuine identifiers where applicable, precise options, useful images, original copy, important constraints and current policies.
- **Check what each channel receives.** A custom specification visible in Liquid is not automatically a distinct catalog attribute in every AI channel. Review supported Shopify Catalog mappings and previews; validate rendered product/variant structured data for consistency.
- **Use Shopify's managed discovery.** Shopify supplies Catalog, agent commerce services and managed discovery files. Keep those defaults unless an evidenced store requirement calls for an extension. Repository AGENTS.md is coding-agent context, not a channel integration.
- **Maintain answers from customer questions.** Document Shopify Knowledge Base setup and use unanswered questions, support inquiries and failed searches to identify missing facts. Theme FAQs and agent knowledge sources remain separate until synchronization is implemented and verified.
- **Explore an optional grounded assistant.** After the facts are dependable, prototype answers that cite approved product/policy sources, retrieve live price and availability, use verified matching for fit and hand unresolved questions to a person. Credentials and model/service logic belong in a backend. Shopping must work when that service is unavailable.

Channel availability and transaction behavior depend on Shopify's store/service configuration. Installing Siftwell does not guarantee eligibility, ranking or autonomous checkout. [Shopify Catalog and discovery](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/products), [product-data guidance](https://help.shopify.com/en/manual/shopify-catalog/optimizing-products), [managed discovery](https://shopify.dev/docs/storefronts/themes/architecture/templates/agents-md-liquid).

## How priorities will be validated

Begin with formative mobile and desktop sessions across novice DIY, experienced, project and installer-assisted buying situations. Test exact-item search, variant/fit interpretation, meaningful comparison and complete-job understanding. Small sessions diagnose friction; they do not establish conversion uplift.

Where instrumentation is available, evaluate failed searches and recovery, comparison selection-to-open rates, saved-item return visits, purchases, support questions and return reasons. Use appropriate consent and measure contribution after returns rather than add-to-cart counts alone. AI referrers capture only part of assistant-influenced shopping.

Use controlled comparisons where traffic supports them. Otherwise report task outcomes without claiming causation. Platform changes, merchant data quality and catalog mix can change the order of work.

## Research behind the direction

- [AAPEX's 2026 survey](https://www.aapexshow.com/blog/state-of-the-aftermarket-2026/) informs the focus on quality, price and availability together; it reports professionals' observations of customers.
- [SEMA's 2026 findings](https://www.sema.org/news-media/press-release/sema-market-research-road-culture-continues-drive-consumer-spending) inform project/use-based accessory discovery.
- [Baymard's recommendation research](https://baymard.com/research-articles/product-page-suggestions) distinguishes alternatives from supplementary purchases.
- [Baymard's comparison research](https://baymard.com/research-articles/provide-comparison-features) supports meaningful specification comparison while documenting mobile limitations.
- [Adobe's July 2026 US retail findings](https://business.adobe.com/blog/us-consumers-are-embracing-llms-to-make-travel-plans) inform the researched-arrival hypothesis; they are not automotive-specific causal evidence.

Much of this evidence concerns North America or broad US retail. Validate it against the merchant's actual geography, customers and catalog before adding service dependencies.
