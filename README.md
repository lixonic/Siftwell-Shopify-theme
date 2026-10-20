# Siftwell

**A considered storefront for auto accessories and tools.**

Siftwell brings the order of a well-kept workshop to a Shopify store. A steady sidebar keeps the catalog close. Open product areas, direct headings and purposeful color give practical products room to explain themselves.

Customers can search by name, start with a buying need or compare a short list of alternatives. Product specifications carry the same information across the product page, quick view and comparison.

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
