# Performance and accessibility

A customer should be able to find an item, understand its details and operate the store comfortably. Siftwell supports that through server-rendered pages, selective media loading and deliberate keyboard behavior.

## How the theme supports performance

- **Render useful content on the server.** Liquid supplies the page content and native Shopify forms. Deferred JavaScript enhances interactions without adding a frontend runtime framework.
- **Size images for their space.** Responsive image candidates let the browser choose an appropriate source. The initial product image receives high priority; secondary gallery thumbnails and below-the-fold imagery use lazy loading where appropriate.
- **Load richer media when requested.** Product video and 3D players wait behind a poster until the customer activates them.
- **Use the store's chosen fonts.** Shopify font settings supply the typography; font binaries are not bundled with the theme.

Catalog size, imagery, chosen fonts, app scripts and Shopify platform work all affect the result on an individual store. Audit again after adding your own content and apps.

## Recorded demo performance

The following measurements were recorded on **20 October 2026** against the populated **Auto 0.7.4 demo**, using Lighthouse 12.8.2, Chrome 155 and simulated mobile/desktop throttling with normal cold-cache settings. Storefront authentication was established before the scored navigation. Shopify platform resources were not blocked.

These are historical demo measurements. The MIT 0.8.0 export retains the measured shopping JavaScript, CSS and gallery implementation, but replaces metadata, font registration and several media icons. It has not received a fresh Lighthouse audit or a completed fresh-install verification.

| Page | Mobile median / 100 | Completed samples | Desktop median / 100 | Completed samples |
| --- | ---: | ---: | ---: | ---: |
| Home | 60 | 3 | 85 | 3 |
| Collection | 65 | 3 | 77 | 3 |
| Product | 63 | 3 | 86, provisional | 2 |

Medians include only runs without incomplete-load warnings. The full score set is shown below so the low results and unfinished loads remain visible. An asterisk marks a run with an incomplete-load warning; its score is excluded from the medians above.

| Device | Page | Performance scores, in run order |
| --- | --- | --- |
| Mobile | Home | 59, 65, 60 |
| Mobile | Collection | 65, 67, 65*, 64 |
| Mobile | Product | 63, 38, 66 |
| Desktop | Home | 85, 92, 71 |
| Desktop | Collection | 91, 75, 77 |
| Desktop | Product | 80*, 79*, 88, 84, 94* |

Of 21 recorded runs, 17 finished without load warnings. Host CPU calibration and network conditions varied substantially. Two header CSS corrections landed during the measurement batch and received separate visual checks; the batch is not an exact-package certification. Desktop product still needs a third completed sample. Shopify's standardized benchmark catalog was not audited, so these results do not establish formal benchmark qualification or a controlled speed improvement over an earlier version.

## Accessibility in the shopping experience

The source includes a skip link, semantic headings and landmarks, visible focus indicators, named controls, dialog focus handling, Escape behavior and reduced-motion styles. Native product and cart forms provide fallbacks for essential actions.

Observed Chromium checks on the Auto 0.7.4 demo covered:

- Keyboard opening and closing of the finder, bag, page popup and nested image zoom, with focus containment and return.
- Focus retention after catalog sorting and filtering, including a heading fallback when the active filter disappears.
- Focus moving to a remaining comparison control or back to the catalog when a comparison closes.
- Predictive-search keyboard state and Escape behavior; the result-count status region's markup was checked.
- Mobile account and bag controls at 320px and 390px, including pointer activation after the header-layer correction.
- Native required-email validation on the contact form, without sending a message.

**Lighthouse automated accessibility scored 100/100 in all 21 reports.** Four reports also carried incomplete-load warnings. An automated score does not cover every interaction or establish WCAG conformance, spoken announcements or compatibility with every browser.

Sampled contrast ratios for the demo's default palette were:

| Use | Contrast ratio |
| --- | ---: |
| Body text on the page | 14.86:1 |
| Secondary page text | 4.72:1 |
| Navigation text | 13.95:1 |
| Accent-button text | 5.33:1 |
| Form boundary against the page | 4.89:1 |

These samples do not cover arbitrary merchant colors or text placed over photography. Recheck contrast whenever you change the palette or images.

## Checks still to complete

Screen-reader speech, Safari, Firefox, iOS, physical touch devices and broader browser/version coverage remain unverified. Reduced-motion handling is present in code; an operating-system-setting runtime check remains open. Full template, failure-state, offline, no-JavaScript and editor-reinsertion coverage is incomplete.

Before launch, follow the shopping path with your content and apps using a keyboard, a screen reader and real phones. Check focus, zoom/reflow, form errors, dialog scrolling and motion preferences. Record the browser/device and exact steps when reporting a problem through [community support](../SUPPORT.md).
