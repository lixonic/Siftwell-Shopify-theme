# Add customer reviews

Specifications explain what a product offers. Reviews add customers’ experience using it. Keep those two voices distinct and give reviews a quiet, useful place in the shopping path.

## Connect a review provider

Use a review app that supplies Shopify’s standard product rating and count fields and offers theme app blocks. The provider collects and manages reviews; Siftwell displays the supplied summary and gives the full widget a place in the product template.

Shopify’s own reviews are collected in Shop. Displaying Shop reviews on an online store uses a supported partner app; see [Shopify’s review-sync guide](https://help.shopify.com/en/manual/online-sales-channels/shop/product-reviews/sync-partner-apps). The retired standalone Shopify Product Reviews app is not required by Siftwell.

## Put the summary near the product title

In the theme editor, open a product template and add **Rating summary** inside the main product section. The clean default template places it after Title. Move or remove it to suit the product information.

The summary reads the app-maintained `reviews.rating` and `reviews.rating_count` product metafields. It appears only when both fields contain a valid positive rating and review count. Missing, zero-count or invalid data leaves no rating row. The theme does not collect reviews or manufacture an average.

If your app already supplies a star-summary block, use that or Siftwell’s **Rating summary** to avoid showing the same summary twice.

## Add the full review widget

Open **Customer reviews** below the main product section and add your provider’s app block. You can also add this section to a product template that does not have it. Turn off **Show section heading** when the app widget provides its own heading.

An empty Customer reviews section is hidden from shoppers. The editor shows a setup hint until you add an app block. The app controls review submission, moderation, verified-purchase labels, sorting and any customer photos.

## Choose where compact ratings appear

Under **Theme settings → Shopping tools**, use **Show ratings on product cards and quick view**. This controls the native summaries on those two surfaces; the product page’s Rating summary remains an independently editable block.

Fractional five-point ratings use partial star fills and a numeric average. Other positive rating scales show the numeric value and maximum without a five-star illustration. The accessible text states the average, scale and count; decorative stars are hidden from screen readers.

## Check with real review data

Review a product that has published reviews and one that has none. Compare the displayed count and average with the provider’s records. Check the product page, catalog and quick view on a phone and with a keyboard. Confirm the full widget loads and that the app handles submission and errors as intended.

The source includes rating-render checks and an app-slot fixture check. A real review-provider integration is still unverified; these checks do not establish review collection, moderation or Shop syndication. Installing the theme does not guarantee agent discovery or a search-ranking benefit.
