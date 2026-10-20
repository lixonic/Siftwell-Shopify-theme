# Give product details a consistent home

Choose information that changes a buying decision. Siftwell shares five product-level fields across the product page, quick view and comparison.

Create these product metafield definitions in Shopify’s **Custom data / Metafields and metaobjects** area:

| Name | Namespace and key | Type |
| --- | --- | --- |
| Weight | `siftwell.weight` | Weight |
| Material | `siftwell.material` | Single line text |
| Fit | `siftwell.fit` | Single line text |
| Feature | `siftwell.feature` | Single line text |
| Best | `siftwell.best` | Single line text |

Fill the values on each product. Use consistent units and terms. The displayed weight is separate from shipping weight, and these fields do not change with a selected variant. Fit is your compatibility information; Best describes a suitable use. Neither field performs a compatibility check.

In **Theme settings → Product specifications**, set the namespace to `siftwell` and the five keys to `weight`, `material`, `fit`, `feature` and `best`. Add the **Product specifications** block to the product template. Existing fields can be mapped instead, using one shared namespace and the same types.

Empty fields disappear on product pages and in quick view. Comparison uses a dash for an individual missing value and omits a row when every selected product is empty. With no specifications, it shows vendor and product type. Translate visible labels through the theme content editor and values through your store’s translation tools.

Installing the theme does not create or populate metafield definitions.
