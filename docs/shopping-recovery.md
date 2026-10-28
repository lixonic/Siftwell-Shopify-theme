# Keep shopping moving

Three improvements help shoppers continue from a product page, correct a bag selection and recover from an empty search. They use existing Shopify data; there are no additional product fields to enter.

## Mobile purchase bar

Open a product template in the theme editor and select **Product → Show mobile purchase bar**. It is on by default. Keep a Buy buttons block on that template.

On phones, the bar appears after the original Add to bag button scrolls above the screen. It shows the selected version and price. Add to bag submits the existing product form, including its quantity, customization and selling-plan choices. **Review options** returns to the selection controls. Availability and required fields still apply.

The bar stays hidden on desktop, without JavaScript and while a dialog is open. Test any app fields and custom purchase controls used by your store.

## Edit options in the bag

Eligible multi-variant lines show **Edit options** in both the drawer and cart page. Choose another version, then **Save options**, or cancel to keep the original. Saving carries the current quantity, customization properties and eligible selling plan into the new line. Shopify determines current prices, discounts and stock. If the version cannot accept the quantity or plan, the editor asks the shopper to review those choices.

Gift cards, bundles and linked child items are excluded. An ambiguous split cart line cannot be edited automatically. Combined listings cannot switch to a different product through this editor. Without JavaScript, Edit options opens the product page.

Replacement adds and verifies the new version before removing the original. Shopify does not make these requests atomic. A clearly reversible partial addition or rejected removal restores the earlier quantities. If another app or tab changes the cart, or the response cannot be verified, the shopper sees a request to review the refreshed bag. The theme does not guess or repeatedly resend an uncertain change.

## Undo removal

**Undo removal** restores the most recently removed eligible line, including its quantity, customization properties and selling plan. It remains available after removing the final item.

Undo lasts only on the current page until dismissed, used, replaced by another removal or cleared by a successful variant edit. Navigation and reloads clear it. Current stock, price and discount rules apply; the earlier price is not reserved. An uncertain restoration consumes the action to prevent a repeated click from adding the same quantity again. Review the bag if the update cannot be confirmed.

## Recover an empty search

A search with no results offers **Edit search**, **All products**, and, when filters are active, **Search without filters**. Removing filters preserves the query and search types. These links work without JavaScript.

The page also requests query, collection and product suggestions from Shopify predictive search. Only groups with returned suggestions appear. Short queries, unsupported languages, no suggestions or a failed request leave the ordinary recovery links available. Suggestions are discovery routes and do not verify fit or compatibility. No curated fallback list is required.

## Check the shopping path

1. On a phone, select a version and quantity, scroll below the original purchase button, use Review options and add from the bar. Check sold-out versions and required custom fields.
2. On both cart surfaces, change and cancel a version, remove and undo an item, and undo removal of the final item. Include the discounts, subscriptions, properties and quantity rules your store uses.
3. Search for a missing term and a query narrowed to zero by filters. Edit the query, clear filters and follow any returned suggestions. Repeat basic shopping with JavaScript disabled.

Automated source checks cover Liquid output, purchase-bar states, plan and quantity guards, stock rejection, partial additions, changing line keys and lost cart responses. A targeted demo browser check covered the mobile Add to bag and Review options actions, drawer removal/undo, query editing and filtered-search recovery. Live replacement of a purchasable multi-variant line, physical devices and app integration still need verification. These changes do not establish conversion uplift or activate agent sales channels.

Platform references: [Shopify Cart API](https://shopify.dev/docs/api/ajax/reference/cart), [predictive search](https://shopify.dev/docs/api/ajax/reference/predictive-search).
