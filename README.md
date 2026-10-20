# Siftwell

![Siftwell: Clear for people. Legible to agents. A desktop Auto storefront beside its mobile product page.](docs/images/siftwell-banner.jpg)

**A considered Shopify storefront for auto accessories and tools, built around clear choices.**

Siftwell brings the order of a well-kept workshop to a Shopify store. A steady sidebar keeps the catalog close. Open product areas, direct headings and purposeful color give practical products room to explain themselves.

Customers can search by name, start with a buying need or compare a short list of alternatives. Product specifications carry the same information across the product page, quick view and comparison.

## Why Siftwell fits the agentic era

When an assistant helps someone find a product, the storefront still has a job: make the choice understandable. Siftwell puts product facts, useful comparisons and familiar purchase controls close together, so the shopper can check the recommendation and decide with confidence.

| A clear foundation | What Siftwell provides |
| --- | --- |
| Product facts with a consistent home | Shopify product data and configurable metafields, shared across the product page, quick view and comparison. |
| Pages that carry meaning | Server-rendered Liquid, semantic headings and specification lists, plus Shopify-generated product JSON-LD for machine-readable metadata. |
| Familiar paths to a purchase | Native Shopify links and forms, enhanced with search, quick view and a cart drawer. The core shopping path retains useful HTML fallbacks. |
| Context for coding agents | [Architecture rules](AGENTS.md), [design intent](DESIGN.md), focused source checks and an MIT codebase that developers can inspect and adapt. |

This is our design approach to assisted shopping. Agent discovery, UCP transactions and AI sales-channel eligibility are provided by [Shopify's agentic commerce platform](https://shopify.dev/docs/agents); installing a theme does not enable those services or guarantee recommendations. Product JSON-LD uses Shopify's [structured_data filter](https://shopify.dev/docs/api/liquid/filters/structured_data), and the custom specification fields are not automatically added to every agent's catalog.

## See the theme

| A catalog with room to browse | Useful details without losing your place |
| --- | --- |
| ![Siftwell collection page with its steady sidebar, product grid and filters.](docs/images/collection-desktop.jpg) | ![Siftwell quick view with product imagery, price and consistent specifications.](docs/images/quick-view-desktop.jpg) |

Screenshots show the Auto demo with sample branding and content. The demo catalog and media are not included in the installable theme. [Image notes](docs/images/README.md).

## Project status

This repository prepares the first MIT-licensed beta, **0.8.0-beta.1**. No beta release has been tagged yet. Fresh-install and essential shopping-path checks remain before a packaged beta release. See [known limitations](docs/known-limitations.md).

Siftwell is a Shopify theme. Running a store still requires Shopify; this repository does not include or license Shopify's hosted services.

## Start here

- [The design approach](docs/design-philosophy.md)
- [Install and configure the theme](docs/getting-started.md)
- [Set up product specifications](docs/product-specifications.md)
- [Get help](SUPPORT.md)

The full merchant guide is also included in `docs/`. Preview it locally:

```sh
python3 -m http.server 8774 --bind 127.0.0.1 --directory docs
```

Then open `http://127.0.0.1:8774`. The guide is static and does not need an email service or build framework.

## Included

- Shopify JSON templates, editable sections and product/app blocks
- Predictive search, collection routes, filtering and a collection-based finder
- Optional comparison for up to three products
- Product media galleries, quick view and image zoom
- Shopify product forms, cart drawer and cart page
- Font, color, branding and localization settings

The finder opens collections you configure; it does not infer vehicle compatibility. Add your own catalog, photography, store policies and accurate fit information.

## Development

Use a current Shopify CLI, Node.js 22 or later and Python 3:

```sh
npm ci
npm test
shopify theme check --path .
shopify theme dev --path . --store YOUR-STORE.myshopify.com
```

Before building a theme ZIP, run `npm run validate` and `shopify theme package --path .`. Keep the included MIT notice in every distribution. A GitHub source archive contains project files and is different from a packaged Shopify theme ZIP.

Read [Contributing](CONTRIBUTING.md) before opening a pull request. Never commit a store password, Theme Access token, live merchant settings or customer data.

## License

[MIT](LICENSE). The source audit and the boundary between project code and Shopify services are described in [Provenance](PROVENANCE.md) and [Notices](NOTICES.md). Shopify and third-party brand names remain their owners' trademarks.
