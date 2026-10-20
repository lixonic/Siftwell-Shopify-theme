# Start with your catalog

Siftwell is preparing its first MIT beta. No release has been tagged yet. Evaluate the source in a development store before using it for a live shop.

## Install a packaged theme

Use the Shopify theme ZIP from a tagged release when one is available. GitHub’s automatically generated source archive includes development files and is not the installation package.

In Shopify, open **Online Store → Themes** and use the ZIP upload option. Open the uploaded copy in the theme editor. Keep your previous theme while you configure and review the new one.

Developers can clone this repository, run `npm ci` and `npm test`, then use `shopify theme check --path .` and `shopify theme dev --path . --store YOUR-STORE.myshopify.com`. Build the installation ZIP with `shopify theme package --path .`.

## Make the first choices

1. Add your logo under **Theme settings → Brand**.
2. Connect your main menu in **Header**.
3. Give **Shopping hero** a short heading and an image that shows what you sell.
4. Choose collections for **Collection links**, **Shopping workspace** and **Product finder**.
5. Arrange product information around the purchase choices.
6. Set up [product specifications](product-specifications.md) when they help customers compare.

The included preset is for auto accessories and tools. Add your own product content and licensed photographs. Catalog data, demo media, payments, shipping, taxes and store policies are not supplied by the theme.

## Review your store

Find a product from the home page, inspect its options, add it to the bag and change its quantity. Repeat on a phone and with a keyboard. Check empty results, long titles and your own apps. Use Shopify’s test payment setup for any test checkout; never enter real payment information for a test.

Read [known limitations](known-limitations.md) and [community support](../SUPPORT.md) before publishing.
