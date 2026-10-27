window.SIFTWELL_DOCS = [
  {
    "id": "design-philosophy",
    "group": "Start with Siftwell",
    "title": "Start with Siftwell",
    "lead": "An open-source Shopify theme for auto accessories and tools, built to help customers find what they need, understand the details and compare their options.",
    "sections": [
      {
        "title": "Build around the buying decision",
        "html": "<p>Siftwell suits catalogs where fit, materials and intended use help someone choose. It gives customers a few useful ways into the products:</p><ul><li><strong>Search by name.</strong> Product search gives someone who knows the item a direct starting point.</li><li><strong>Start with a need.</strong> Collection links and the product finder can begin with a job such as Road trips or Garage projects.</li><li><strong>Compare the options.</strong> Quick view opens product details from the catalog, and optional comparison puts up to three products side by side.</li></ul><p>Choose the collections behind each route. The finder follows your choices; accurate vehicle-fit information belongs in your product content.</p>"
      },
      {
        "title": "Enter useful details once",
        "html": "<p>Choose editable specification rows for each product family, with selected-variant overrides. The existing Weight, Material, Fit, Feature and Best setup also remains supported. Product pages, quick view and comparison share the same renderer.</p><p>Use the same units and terms across similar products. A specific fit description or material is more useful than another promotional sentence.</p><figure class=\"guide-preview\"><a href=\"images/quick-view-desktop.jpg\"><img src=\"images/quick-view-desktop.jpg\" alt=\"Siftwell quick view showing a socket set, price and five product specifications beside the catalog.\" width=\"1309\" height=\"909\" loading=\"lazy\"></a><figcaption>The Auto demo shows the shared specification fields in quick view. Sample branding, products and media are for illustration.</figcaption></figure><p><a href=\"?page=specifications\">Set up product specifications →</a></p>"
      },
      {
        "title": "Keep the catalog in view",
        "html": "<p>A steady desktop sidebar keeps product groups close. Open product areas, direct headings and restrained color give practical items room to explain themselves. On a phone, navigation moves into a drawer while account and bag controls stay in the header.</p><p>Build on that order: a few recognizable categories, a clear overview photograph and one useful thought at a time. Add a section when it answers a customer’s question.</p><p><a href=\"?page=performance-accessibility\">Read about performance and accessibility →</a></p>"
      },
      {
        "title": "Make the source your own",
        "html": "<p>Use Shopify’s theme editor to arrange sections, product blocks, branding, colors and fonts. The MIT-licensed source also lets developers adapt the theme and share improvements while keeping the license notice.</p><p>If a developer works with a coding agent, the repository includes architecture rules and design intent to guide changes. This gives the agent context for preserving the storefront’s structure and behavior.</p><p><a href=\"https://github.com/lixonic/Siftwell-Shopify-theme\">Explore the source →</a> · <a href=\"?page=presets\">Shape your identity →</a></p>"
      },
      {
        "title": "When shopping starts with an assistant",
        "html": "<p>A customer may arrive with a recommendation already in mind. Siftwell’s role is to help them inspect it: clear product facts, visible options and useful comparisons. Its pages use semantic HTML and Shopify-generated product structured data.</p><p>Shopify provides the agent commerce channels and transaction services. Availability depends on the store and service setup; installing Siftwell does not activate those channels. <a href=\"https://shopify.dev/docs/agents\">Read Shopify’s agent commerce guide</a>.</p>"
      },
      {
        "title": "Build your first shopping path",
        "html": "<p>Start with a small catalog, connect one buying need to a collection, then follow a product through to the bag. Siftwell’s first MIT beta is in preparation; evaluate it in a development store and read <a href=\"?page=release-status\">the current project status</a> before planning a launch.</p><p>Explore the <a href=\"https://siftwell-theme.myshopify.com/\">Auto demo</a> with visitor password <code>siftwell</code> to see the layout and product details in context.</p><div class=\"article-links\"><a href=\"?page=getting-started\">Plan your first shopping path →</a><a href=\"?page=installation\">Try Siftwell →</a><a href=\"?page=specifications\">Set up shared specifications →</a><a href=\"?page=presets\">Make the design yours →</a></div>"
      }
    ]
  },
  {
    "id": "roadmap",
    "group": "Start with Siftwell",
    "title": "Roadmap: confident parts shopping",
    "lead": "Priorities for auto parts, accessories and tools: finding the right item, understanding fit and verifying a recommendation.",
    "sections": [
      {
        "title": "What the current source provides",
        "html": "<p>Updated 27 October 2026. The compact mobile introduction brings search and collection routes closer to the first products. Recommendation comparison is off by default, with an opt-in for related alternatives and no comparison on complementary cards. Existing foundations include native commerce, quick view, editable, variant-aware specifications and Shopify-generated product structured data.</p><p>The first MIT beta still needs its fresh-install and essential shopping-path release gate. A smaller hero and source checks do not prove a conversion improvement.</p><p>Saved compatibility details now show selected-variant requirements, exclusions, notes and a reference. Unconfigured products stay hidden by default. An assigned profile with no requirements, exclusions or notes, or an inaccessible profile, shows Compatibility not confirmed. Empty requirements alone still allow supplied notes or exclusions to appear. This interface does not perform vehicle matching. <a href=\"?page=compatibility#try-the-live-preview\">Follow the setup and live walkthrough →</a></p><p>Optional included-parts and required/optional-extras lists are implemented in the current source. One saved set can be reused, a variant replaces the complete set and empty output leaves no gap. Native product links do not establish compatibility or create a bundle. <a href=\"?page=parts\">Set up box contents and extras →</a></p>"
      },
      {
        "title": "Continue one feature at a time",
        "html": "<p>Specifications, compatibility guidance and included parts with required/optional extras are implemented in the current source. Validate whether merchants can supply and maintain useful details before expanding those interfaces. The theme does not fill missing compatibility facts or infer fit from a product title, voltage or AI recommendation.</p>\n<p><strong>Easier catalog data setup has an optional prototype.</strong> The blank XLSX, fictional inflator worked example and developer-assisted import companion are implemented in the current source. They export existing facts, reuse shared details and preview selected changes. The initial inflator-demo test is complete for this checkpoint. Real supplier-column mapping, merchant setup effort and ongoing maintenance can be evaluated later with an actual product family. Begin with Shopify&#39;s native bulk editor for small assignment changes. The companion covers variant metafields and saved-entry creation that a native product CSV alone does not complete. A merchant-facing editor, automatic supplier parsing and live spreadsheet sync remain unimplemented. <a href=\"?page=catalog-data\">Spreadsheet workflow and downloads</a>, <a href=\"https://help.shopify.com/en/manual/products/import-export/using-csv\">Shopify CSV capabilities</a>, <a href=\"https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields\">native metafield bulk editing</a>.</p>\n<p>For the first product family, the <a href=\"?page=sidekick\">Sidekick-assisted setup guide</a> documents a native route: prepare supplied facts, review entry forms, select product/variant references and reuse the preparation instructions as a Sidekick skill. This combines Shopify&#39;s documented assistance with the existing Siftwell data model; it is not an end-to-end tested Sidekick integration. Keep the workbook/importer optional and defer a separate merchant editor while this documented route is evaluated.</p>\n<p>Test whether buyers can identify box contents and remaining requirements, and whether merchants can prepare accurate data with less effort. Installation guidance, bundles, saved project lists and verified matching remain separate work.</p>\n"
      },
      {
        "title": "Design around the buyer’s question",
        "html": "<ul><li><strong>Known part:</strong> find the exact item or variant through useful names, identifiers and search.</li><li><strong>DIY buyer:</strong> understand requirements, exclusions, installation and required tools.</li><li><strong>Experienced buyer:</strong> compare meaningful category-specific differences.</li><li><strong>Installer-assisted purchase:</strong> share an exact choice and check fulfillment.</li><li><strong>Project purchase:</strong> distinguish included parts, required extras and optional additions.</li><li><strong>Arrival from an assistant:</strong> verify the recommendation against current facts.</li></ul><p>These are buying situations to test, not fixed shopper personality types.</p>"
      },
      {
        "title": "Next priorities",
        "html": "<ol><li>Finish fresh-install and essential shopping-path checks, and extend browser, device, screen-reader and review-provider coverage.</li><li>Test the mobile introduction and recommendation relevance with real buyers.</li><li>Explore an explicit Compare with this product flow for genuine alternatives, with the current product visibly included.</li><li>Validate the editable, variant-aware specifications with real merchant catalogs and buyer tasks.</li><li>Validate compatibility setup with sparse catalogs and existing merchant data. Ask buyers to distinguish missing information from a verified fit result; add matching only with suitable application data and services.</li><li>Validate the spreadsheet template and developer-assisted import prototype with a real product family and supplier data. Check native bulk editing for small changes, and test setup effort before building a merchant-facing editor.</li><li>Validate box-content and required/optional-extra understanding, then evaluate installation, delivery, warranty and returns separately.</li><li>Explore exact-variant shortlists and complete-job project checklists.</li></ol>"
      },
      {
        "title": "Prepare for assisted and agentic shopping",
        "html": "<p>Prioritize accurate identifiers, descriptions, options, constraints and policies. Check what supported Shopify Catalog mappings and previews actually receive; displaying a custom metafield does not establish inclusion in every agent’s catalog.</p><p>Retain Shopify’s managed discovery files and commerce services. Repository AGENTS.md helps coding agents extend the source; it does not activate a sales channel. Use customer questions and Shopify Knowledge Base setup to identify missing facts.</p><p>An optional assistant comes after dependable data. It would need approved sources, live price/availability, verified matching, a backend for credentials and an unresolved-question handoff. Cross-device saves, alerts and shared/private lists also require a backing service.</p>"
      },
      {
        "title": "Measure useful decisions",
        "html": "<p>Test exact-item search, variant and fit interpretation, meaningful comparison and complete-job understanding. Where instrumentation is available, evaluate search recovery, comparison selection-to-open rates, saved-item return visits, purchases, support questions and return reasons. Use consent-aware measurement; AI referrers capture only part of assistant-influenced shopping.</p><p>Small sessions reveal friction rather than proving revenue uplift. Much of the supporting research is North American or broad US retail, so validate priorities against your own market.</p><p><a href=\"https://github.com/lixonic/Siftwell-Shopify-theme/blob/main/ROADMAP.md\">Read the complete roadmap and research sources →</a></p>"
      }
    ]
  },
  {
    "id": "getting-started",
    "group": "Start with Siftwell",
    "title": "Build your first shopping path",
    "lead": "Connect a buying need to a useful product choice, then follow it through to the bag.",
    "sections": [
      {
        "title": "Choose one buying need",
        "html": "<p>Begin with a job your customers recognize: preparing for a road trip, keeping the interior tidy or working in the garage. Create a collection with a small set of relevant products. Give it a label that describes what someone will find.</p><p>Use that collection in your main menu, activity links or product finder. A useful route starts with the products behind the label.</p>"
      },
      {
        "title": "Prepare products people can compare",
        "html": "<p>Add clear product names, prices, available options and photographs in Shopify. Use a short description to explain the item’s purpose, then record the details that affect a choice in <a href=\"?page=specifications\">product specifications</a>.</p><p>Keep fit information precise and use consistent units. The theme displays the values you provide; it does not establish vehicle compatibility.</p>"
      },
      {
        "title": "Connect the path in the editor",
        "html": "<ol><li>Open Siftwell in the theme editor.</li><li>Add your logo in <strong>Theme settings → Brand</strong> and connect your main menu in <strong>Header</strong>.</li><li>Give <strong>Shopping hero</strong> a desktop heading and useful image. Enable <strong>Compact mobile shopping intro</strong> and set <strong>Mobile shopping heading</strong> to describe your catalog.</li><li>Choose collections for <strong>Collection links</strong>, <strong>Shopping workspace</strong> and <strong>Product finder</strong>.</li><li>Open the product template and arrange its options, purchase controls and <strong>Product specifications</strong> block.</li><li>Keep catalog comparison when it helps customers choose. Recommendation cards hide it by default; opt in only for related alternatives, not accessories.</li></ol>"
      },
      {
        "title": "Read it as a customer",
        "html": "<p>Start at the home page. Find two relevant items, inspect quick view and compare their details. Open a product, choose its options, add it to the bag and adjust the quantity. Repeat on a phone and with a keyboard.</p><p>Check that each label, image and next step makes sense. Configure shipping, returns and payments in Shopify, and use your store’s test payment setup for checkout testing.</p><div class=\"article-links\"><a href=\"?page=installation\">Try the theme →</a><a href=\"?page=homepage\">Build the home page →</a></div>"
      }
    ]
  },
  {
    "id": "installation",
    "group": "Start with Siftwell",
    "title": "Install Siftwell",
    "lead": "Evaluate the theme with your catalog, then prepare a copy for your store.",
    "sections": [
      {
        "title": "Get the theme",
        "html": "<p><a href=\"https://raw.githubusercontent.com/lixonic/Siftwell-Shopify-theme/main/docs/downloads/Siftwell-0.8.0-beta.1.zip\">Download theme ZIP</a> and add it to your Shopify theme library. The download contains the theme files; GitHub’s source archive also includes development and documentation files.</p><p>Developers can <a href=\"https://github.com/lixonic/Siftwell-Shopify-theme#development\">work from the source with Shopify’s development tools</a>. Read <a href=\"?page=release-status\">the current project status</a> before planning a launch.</p>"
      },
      {
        "title": "Add the theme to your library",
        "html": "<p>In <strong>Online Store → Themes</strong>, use the ZIP upload option to add the theme ZIP to your library. Open that copy in the theme editor and begin with <a href=\"?page=getting-started\">one complete shopping path</a>.</p><p>Keep your previous theme while you configure and review the new copy. GitHub’s source archive includes project files and is different from this packaged Shopify theme ZIP.</p>"
      },
      {
        "title": "Bring your products and identity",
        "html": "<p>The Siftwell preset supplies a layout for auto accessories and tools. Add your own products, collections, licensed photographs and store information. Demo screenshots illustrate the design; their branding and catalog are not included.</p><p>Add your logo, choose the navigation and connect product specifications. Preview an item with real content rather than designing around empty placeholders.</p>"
      },
      {
        "title": "Check before publishing",
        "html": "<p>Review the home page, collection, product, search, bag and information pages. Test your own apps and review both a phone layout and a large screen. Confirm Shopify’s shipping and payment configuration using the appropriate test setup.</p><p>Publish after you have reviewed the shopping path and the version’s known limitations.</p><div class=\"article-links\"><a href=\"?page=getting-started\">Build the first path →</a><a href=\"?page=faq\">Read common questions →</a></div>"
      }
    ]
  },
  {
    "id": "presets",
    "group": "Start with Siftwell",
    "title": "Shape your identity",
    "lead": "Keep the catalog clear while making the storefront feel like your brand.",
    "sections": [
      {
        "title": "Start with the Siftwell preset",
        "html": "<p>Siftwell starts with one layout for auto accessories and tools. Its steady sidebar, open product areas, strong headings and warm action color suit catalogs where details help people choose.</p><p>Begin with your product groups and the information customers need. Use Shopify’s theme editor to arrange the content around those decisions.</p>"
      },
      {
        "title": "Choose type by role",
        "html": "<p>Use <strong>Theme settings → Typography</strong> to choose the Body font, Heading font and Caption font. Give headings a clear hierarchy, keep descriptions comfortable to read and let captions carry secondary details.</p><p>Preview actual product names, prices and specifications. Keep enough of each name to distinguish similar items.</p>"
      },
      {
        "title": "Keep color purposeful",
        "html": "<p>In <strong>Theme settings → Colors</strong>, pair each background with readable text. Use the accent for meaningful actions and selected states. Check product details, sale prices, links and focused controls after changing a palette.</p><p>Adjust Page width and Corner radius in <strong>Layout</strong>, then use the same treatment throughout the store.</p>"
      },
      {
        "title": "Choose images with a shared point of view",
        "html": "<p>Give product cards a consistent crop, background and sense of scale. Use product-page images to show close details and the item in use. Keep headings and buttons as editable text rather than placing them inside photographs.</p><p>Developers can also adapt the MIT source. A coding agent can use the repository’s architecture and design guidance when extending the theme.</p><div class=\"article-links\"><a href=\"?page=design-philosophy\">Start with Siftwell →</a><a href=\"?page=navigation\">Add branding and navigation →</a></div>"
      }
    ]
  },
  {
    "id": "navigation",
    "group": "Build your store",
    "title": "Navigation and branding",
    "lead": "Make the store easy to recognize and easy to move through.",
    "sections": [
      {
        "title": "Give the brand one clear place",
        "html": "<p>In <strong>Theme settings → Brand</strong>, choose your Logo and Favicon. If you use the text identity instead, set the Text logo and optional Logo suffix. Preview the result against the navigation background.</p>"
      },
      {
        "title": "Keep the main menu useful",
        "html": "<p>Select a menu in <strong>Header → Menu</strong>. Start with broad product groups or buying needs. Siftwell supports up to three levels, but use extra levels only when they make a busy catalog easier to understand.</p><p>Select an <strong>About page</strong> in Header to give customers a short introduction without losing their place in the catalog.</p>"
      },
      {
        "title": "Carry the same order onto a phone",
        "html": "<p>On smaller screens, the main menu opens in a drawer. The account control and bag stay in the header. Use short menu labels and check that nested categories remain easy to follow.</p>"
      },
      {
        "title": "Finish with practical information",
        "html": "<p>Choose a menu in <strong>Footer</strong> for helpful pages. Configure store policies in Shopify, then review the displayed policy links and payment icons. Add newsletter signup or country and language choices when they serve your store.</p>"
      }
    ]
  },
  {
    "id": "homepage",
    "group": "Build your store",
    "title": "Build the home page",
    "lead": "Introduce the store, offer a useful direction and let the catalog do the rest.",
    "sections": [
      {
        "title": "Make one clear introduction",
        "html": "<p>In <strong>Shopping hero</strong>, write a short heading and one supporting thought. Choose an image that establishes what you sell or how it is used. Leave room for the words rather than filling every part of the frame.</p><p>The hero includes product search and a route into the finder. Customers can search by name or begin with a buying need.</p>"
      },
      {
        "title": "Start shopping sooner on a phone",
        "html": "<p>Keep <strong>Shopping hero → Compact mobile shopping intro</strong> enabled for a short mobile introduction. Set <strong>Mobile shopping heading</strong> to describe your catalog; blank uses the translated Auto parts &amp; accessories label. Search appears first, followed by a secondary Help me choose link. With the finder disabled, that link opens all products.</p><p>The desktop heading, description and photograph remain available on larger screens. Compact mode hides those elements on phones and does not request the desktop photograph. Turn it off when a different catalog needs the larger introduction.</p>"
      },
      {
        "title": "Give collection links a purpose",
        "html": "<p>Use <strong>Collection links</strong> for a few recognizable routes through the store. Choose a real collection for each link. Daily driving or Garage tools works best when its products belong together for a clear reason.</p><p>Keep <strong>Collection links → Compact links on mobile</strong> enabled for two columns of short links. This uses your existing collections and labels; it does not create categories or verify fit.</p>"
      },
      {
        "title": "Bring the products into view",
        "html": "<p>Use <strong>Shopping workspace</strong> for a catalog with sorting and filters. Choose the collection, product count and filter settings. Use <strong>Featured collection</strong> when you want a simpler product selection in another part of the page.</p><p>Let the product imagery carry the grid. Avoid repeating introductory text between every shopping section.</p>"
      },
      {
        "title": "Add a section to answer a question",
        "html": "<p>Image with text can explain a use or material. Rich text can introduce a service. Featured product can give a key item more room. Add these when the information earns its place.</p><p>Reorder sections in the editor, then read the page from top to bottom. Each section should move the customer toward a more informed choice.</p><div class=\"article-links\"><a href=\"?page=product-finder\">Guide customers by need →</a><a href=\"?page=collections\">Organize the catalog →</a></div>"
      }
    ]
  },
  {
    "id": "product-finder",
    "group": "Build your store",
    "title": "Configure the product finder",
    "lead": "Turn a buying need into a useful collection.",
    "sections": [
      {
        "title": "Choose the routes first",
        "html": "<p>Create a small set of Shopify collections around real tasks or occasions. Decide what belongs in each before writing the finder labels. Keep the choices distinct enough that a customer can recognize a starting point.</p>"
      },
      {
        "title": "Connect each choice",
        "html": "<ol><li>Open <strong>Product finder</strong> in the theme editor.</li><li>Write the Question.</li><li>Add a <strong>Collection choice</strong> block.</li><li>Select its Collection and enter a short Label.</li><li>Repeat for the other useful routes, then preview each choice.</li></ol>"
      },
      {
        "title": "Be precise about fit",
        "html": "<p>The finder opens the collection you select. It does not check a vehicle, calculate compatibility or make a technical recommendation. Put essential fit information in your product content and filters.</p>"
      },
      {
        "title": "Use it when it helps",
        "html": "<p>To remove the finder, turn off <strong>Theme settings → Shopping tools → Enable product finder</strong>. The hero then links directly to shopping.</p><p>A small, familiar catalog may need only search and a clear main menu.</p>"
      }
    ]
  },
  {
    "id": "products",
    "group": "Build your store",
    "title": "Build a useful product page",
    "lead": "Show what the product is, why it suits the task and what the customer needs to choose.",
    "sections": [
      {
        "title": "Arrange the information around the decision",
        "html": "<p>Open a product template in the editor. Keep Title, Price, Variant picker, Quantity selector and Buy buttons close together. Place Product specifications where a customer can compare the important details, then use Description for explanation and care.</p><p>These are separate blocks. Add a relevant app block or Custom Liquid when your store needs it, and preview the result with real content.</p><div class=\"article-links\"><a href=\"?page=specifications\">Set up specifications →</a></div>"
      },
      {
        "title": "Make options understandable",
        "html": "<p>Set up options, prices and availability on the product in Shopify. Give options names that customers recognize. Add a variant image when appearance changes. Shopify color or image swatches are used when available.</p>"
      },
      {
        "title": "Build a considered gallery",
        "html": "<p>Add and reorder images, uploaded video, YouTube or Vimeo links and supported 3D media in the product’s Media area. Start with a clear overview, then show scale, useful details and the product in use.</p><p>Customers can move through thumbnails and open image zoom. Select Zoom out to fit an enlarged image back into the viewer, then Close to return. The same gallery is used in quick view and Featured product.</p><p>3D and View in your space depend on the model and device support. Check the experience on the devices your customers use.</p>"
      },
      {
        "title": "Show relevant buying details",
        "html": "<p>Use Pickup availability when locations are configured in Shopify. Selling plans, gift-card recipients and accelerated checkout need the matching product or store setup. The Buy buttons block includes <strong>Show accelerated checkout</strong> and <strong>Show gift card recipient form</strong>.</p><p>Add related or complementary products when they offer a useful next step. Keep compatibility claims in the product information.</p><p><a href=\"?page=reviews\">Add app-supplied ratings and customer reviews →</a></p>"
      },
      {
        "title": "Explain what is in the box",
        "html": "<p>Add the optional <strong>Included parts &amp; extras</strong> block to separate supplied items, required extras and optional additions. Use one saved set with quantity text and optional product links. Keep shared details accurate for every inheriting variant; a differing variant replaces the whole set.</p><p>Empty groups remain hidden. A missing group does not confirm that no extra items are needed, and a linked product does not verify compatibility. <a href=\"?page=parts\">Follow the parts-set setup guide →</a></p>"
      }
    ]
  },
  {
    "id": "specifications",
    "group": "Build your store",
    "title": "Variant-aware product specifications",
    "lead": "Give each product family the right facts, and keep those facts aligned with the version a customer selects.",
    "sections": [
      {
        "title": "Keep the facts beside the buying controls",
        "html": "<p>A socket set, electrical accessory and cleaning product need different facts. Siftwell supports editable specification rows for each product, with overrides for the selected variant. The same renderer supplies the product page, quick view and comparison.</p>\n<p>Keep important facts beside the buying controls using the <strong>Product specifications</strong> block. Customers can read them without opening a tab. A small caption identifies the selected variant on products with options.</p><p><a href=\"?page=compatibility\">Add compatibility requirements and exclusions →</a></p>"
      },
      {
        "title": "Prepare the facts with Sidekick",
        "html": "<p>For a first product family, use the <a href=\"?page=sidekick\">Sidekick workflow</a> to prepare facts from supplier text, fill reviewed Specification row entries and reuse shared rows. Follow the <a href=\"?page=sidekick#fill-and-review-the-saved-entries\">specification prompt</a>, then select the saved row references on the product and any differing variants. The definitions below are a one-time setup; a spreadsheet importer is optional.</p>"
      },
      {
        "title": "Try the live auto-parts preview",
        "html": "<p>Open the <a href=\"https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo\">Workshop Inflator demo</a>. If prompted, enter visitor password <strong><code>siftwell</code></strong>. This fictional product is labelled <strong>not for sale</strong>; both versions have zero tracked stock and cannot be purchased. Its figures and prices demonstrate the theme, not verified performance or vehicle fit.</p>\n<ol><li>Select <strong>12 V</strong>: Input voltage is 12 V, Connector is DC plug and Rated output is 150 W.</li><li>Select <strong>24 V</strong>: Input voltage becomes 24 V, Rated output becomes 300 W, Connector disappears and Cable length appears as 2 m.</li><li>Open the <a href=\"https://siftwell-theme.myshopify.com/collections/all?sort_by=created-descending\">demo in the catalog</a>, then select its image to open quick view. Select 12 V and press <strong>Compare</strong>; switch to 24 V and press <strong>Compare</strong> again. Close quick view and open <strong>Compare products</strong> to see both versions with separate names, prices, facts and links. A dash marks a fact absent from that version.</li></ol>\n<p>Direct variant links also work on a full page load: <a href=\"https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548018405\">12 V</a> · <a href=\"https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548051173\">24 V</a>.</p>"
      },
      {
        "title": "Choose the information that changes the decision",
        "html": "<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Product family</th>\n<th>Useful examples</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Electrical accessories</td>\n<td>Input voltage, connector, rated output, cable length</td>\n</tr>\n<tr>\n<td>Workshop tools</td>\n<td>Drive size, torque range, included sizes, battery platform</td>\n</tr>\n<tr>\n<td>Care products</td>\n<td>Capacity, suitable surfaces, dilution, application method</td>\n</tr>\n</tbody></table></div>\n<p>These are examples, not supplied product claims. Enter verified information for your own catalog. The feature displays your facts; it does not check vehicle compatibility, infer missing facts or alter shipping weight.</p>"
      },
      {
        "title": "Keep an existing five-field setup",
        "html": "<p>Existing <strong>Theme settings → Product specifications</strong> mappings continue to work. The default namespace is <code>siftwell</code> and keys are <code>weight</code>, <code>material</code>, <code>fit</code>, <code>feature</code> and <code>best</code>. Use a Weight metafield for weight and text fields for the others.</p>\n<p>To override one of these values for a variant, create a <strong>variant metafield definition</strong> with the same namespace, key and type, then fill it on that variant. A populated variant field overrides its product field. An absent or empty variant field inherits the shared product value. Empty resolved values disappear. Translate the five labels through the theme content editor.</p>\n<p>The flexible rows below provide custom labels, ordering and explicit per-variant suppression.</p>"
      },
      {
        "title": "Create the Specification row metaobject",
        "html": "<p>In Shopify <strong>Settings → Metafields and metaobjects</strong>, add a metaobject definition named <strong>Specification row</strong>. Admin wording can vary. Add these fields with the exact field keys:</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Field name</th>\n<th>Field key</th>\n<th>Type</th>\n<th>Rule</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Code</td>\n<td><code>code</code></td>\n<td>Single line text</td>\n<td>Required; stable identity such as <code>input-voltage</code></td>\n</tr>\n<tr>\n<td>Label</td>\n<td><code>label</code></td>\n<td>Single line text</td>\n<td>Buyer-facing name, such as Input voltage</td>\n</tr>\n<tr>\n<td>Value</td>\n<td><code>value</code></td>\n<td>Multi-line text</td>\n<td>Plain facts and units, such as 12 V</td>\n</tr>\n</tbody></table></div>\n<p>Keep Label and Value optional so a variant override can inherit a label or intentionally suppress a row. For easier selection in Shopify, optionally add a single-line <strong>Entry name</strong> field with key <code>entry_name</code> and use it as the definition's display name. Give entries distinct names such as “Demo — Input voltage — 12 V” and “Demo — Input voltage — 24 V”. The theme reads only Code, Label and Value. Enable storefront access. If the definition has an Active/Draft status, publish the entries you reference. Web-page publishing is not needed.</p>\n<p>Use unique lowercase codes with hyphens. A code must mean the same thing wherever it is used: <code>input-voltage</code> should not mean output voltage on another product. Comparison joins facts by code. Translations may change labels and values, but should keep codes unchanged.</p>"
      },
      {
        "title": "Connect lists to products and variants",
        "html": "<ol>\n<li>Add a <strong>product metafield definition</strong> named Specification rows, namespace and key <strong><code>siftwell.specifications</code></strong>. Choose a <strong>List of metaobject references</strong>, restricted to Specification row.</li>\n<li>Add the equivalent <strong>variant metafield definition</strong>, using the same namespace, key, list type and definition.</li>\n<li>Make both definitions accessible to the storefront where that setting is offered.</li>\n<li>In <strong>Theme settings → Product specifications</strong>, keep <strong>Metafield namespace</strong> as <code>siftwell</code> and <strong>Specification rows metafield key</strong> as <code>specifications</code>. Existing definitions can use a different shared namespace/key through these settings.</li>\n<li>Add the <strong>Product specifications</strong> block to your product template. Quick view and comparison use the same mapping automatically.</li>\n</ol>\n<p>Installing the theme does not create definitions, entries or values. Prefer existing suitable Shopify standard definitions for your wider product-data setup; these row references organize the theme&#39;s display and do not automatically map facts into every sales or AI channel.</p>"
      },
      {
        "title": "Worked example: 12 V and 24 V versions",
        "html": "<p>For a spreadsheet version, download the <a href=\"downloads/Siftwell-inflator-worked-example.xlsx\">worked inflator example (.xlsx)</a> and open <strong>Assignments</strong> and <strong>Specifications</strong>. The shared rows and 24 V overrides below use the same rules. The <a href=\"downloads/Siftwell-catalog-template.xlsx\">blank template (.xlsx)</a> is for your own data. This optional prototype requires developer assistance to import; see the <a href=\"?page=catalog-data#download-the-template-and-inflator-example\">spreadsheet workflow</a>. It covers flexible specification rows, not the legacy five fields.</p>\n<p>Create separate row entries, then select them in the appropriate product or variant list. A product list establishes order and shared facts:</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Product row code</th>\n<th>Label</th>\n<th>Value</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>input-voltage</code></td>\n<td>Input voltage</td>\n<td>12 V</td>\n</tr>\n<tr>\n<td><code>connector</code></td>\n<td>Connector</td>\n<td>DC plug</td>\n</tr>\n<tr>\n<td><code>rated-output</code></td>\n<td>Rated output</td>\n<td>150 W</td>\n</tr>\n</tbody></table></div>\n<p>On the <strong>24 V variant</strong>, select override entries:</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Variant row code</th>\n<th>Label</th>\n<th>Value</th>\n<th>Result</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>input-voltage</code></td>\n<td>Leave blank</td>\n<td>24 V</td>\n<td>Replaces the value and retains Input voltage</td>\n</tr>\n<tr>\n<td><code>connector</code></td>\n<td>Leave blank</td>\n<td>Leave blank</td>\n<td>Hides the shared connector row</td>\n</tr>\n<tr>\n<td><code>rated-output</code></td>\n<td>Rated output</td>\n<td>300 W</td>\n<td>Replaces the shared value</td>\n</tr>\n<tr>\n<td><code>cable-length</code></td>\n<td>Cable length</td>\n<td>2 m</td>\n<td>Adds a new row at the end</td>\n</tr>\n</tbody></table></div>\n<p>The figures illustrate setup only. A product-level value is an intentional fallback for every variant without an override; use it only when that fallback is accurate. Add an override to every variant that differs. Removing an override restores inheritance. A missing variant fact does not establish fit.</p>\n<p>A populated product row list replaces the five legacy slots for that product. Clearing the list restores the legacy setup. If the product keeps legacy slots, a variant row with the matching code (<code>weight</code>, <code>material</code>, <code>fit</code>, <code>feature</code> or <code>best</code>) can override or suppress that slot, and new codes append.</p>"
      },
      {
        "title": "How selection and comparison behave",
        "html": "<ul>\n<li>Product pages and quick view resolve the selected variant&#39;s rows when options change. Variant URLs also resolve on a full page load without JavaScript. A combination that does not exist shows no specifications for another variant.</li>\n<li>A catalog Compare checkbox selects the product&#39;s <strong>shared facts</strong>. It does not silently select a version of a configurable product.</li>\n<li>Compare in quick view selects the <strong>exact variant</strong>, showing its option name, base variant price, facts and variant URL. Two versions can occupy two of the three comparison slots. Changing options does not rewrite an earlier comparison pick.</li>\n<li>Products with options still use <strong>Choose options</strong> to reach their purchase controls. Specification comparison does not compare subscription plans, quantity-price tiers or prove compatibility.</li>\n<li>Shared rows keep product order; new variant rows append in variant-list order. The first 20 entries of each list are processed. Keep codes unique: the first occurrence wins. Empty labels/values hide standalone rows; a matching blank variant value suppresses the shared row.</li>\n<li>Comparison includes the union of available row codes, with a dash for a missing value. With no specifications it retains the vendor/type fallback. Keep labels, meanings and units consistent across comparable items.</li>\n</ul>"
      },
      {
        "title": "Check your setup",
        "html": "<p>Preview a product with two materially different variants. Change options on the product page and in quick view; confirm the caption and facts change together. Open a direct variant URL. Compare both variants and check names, values and links. Check a product with no custom rows to confirm the old fields remain usable.</p>\n<p>If rows are missing, check storefront access, entry status, list type, exact field keys and populated labels/values. Check the namespace/key mapping and the product-template block. An empty variant override may be deliberately hiding a row. A product row list replaces the legacy list rather than adding to it.</p>\n<p>Translate metaobject labels and values with Shopify&#39;s supported translation tools. Keep codes stable. Use consistent units and document uncertainty rather than entering a reassuring but unverified fit claim.</p>\n<p><a href=\"https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions\">Shopify metafield definitions</a> · <a href=\"https://shopify.dev/docs/api/liquid/objects/metaobject\">Metaobjects in Liquid</a> · <a href=\"https://shopify.dev/docs/storefronts/themes/product-merchandising/variants\">Variant handling</a></p>"
      }
    ]
  },
  {
    "id": "compatibility",
    "group": "Build your store",
    "title": "Compatibility & requirements",
    "lead": "Show requirements, exclusions and references for the selected version, with an explicit unknown state when details are missing.",
    "sections": [
      {
        "title": "Help buyers check their setup",
        "html": "<p>Auto-parts buyers need to establish whether a part works with their vehicle or equipment. Use <strong>Compatibility &amp; requirements</strong> for merchant-supplied requirements, exclusions, application notes and a manufacturer reference. Keep concise facts visible beside the options and buying controls.</p>\n<p>The block presents supplied information. It does not select a vehicle, match year/make/model, verify a source or confirm fit. Specifications such as voltage alone do not establish compatibility. A compatibility profile is a saved set of these details in Shopify that a merchant links to a product or variant.</p>\n"
      },
      {
        "title": "Prepare the facts with Sidekick",
        "html": "<p>Use the <a href=\"?page=sidekick\">Sidekick workflow</a> to organize verified requirements, exclusions and references, then fill reviewed Compatibility profile entries. Keep missing facts explicit. Select the saved product and variant references in Shopify, remembering that each variant profile replaces the whole shared profile. The guide includes a <a href=\"?page=sidekick#fill-and-review-the-saved-entries\">copyable profile prompt</a>; it does not verify fit.</p>"
      },
      {
        "title": "Try the live preview",
        "html": "<p>Open the <a href=\"https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548018405\">Workshop Inflator demo at 12 V</a>. If prompted, enter visitor password <strong><code>siftwell</code></strong>. This fictional product is sold out and labelled <strong>not for sale</strong>. All figures, prices and requirements are illustrative; the demo does not provide a verified vehicle match.</p>\n<ol><li>Select <strong>12 V</strong>. This variant inherits the product profile: a 12 V DC supply and matching DC accessory connection are required, and a 24 V supply is excluded. The notes explain that voltage alone does not establish vehicle fit.</li><li>Switch to <strong>24 V</strong>. Its intentionally empty variant profile replaces the product profile. <strong>Compatibility not confirmed</strong> appears, and the 12 V requirements, exclusion and reference disappear.</li><li>Open the <a href=\"https://siftwell-theme.myshopify.com/collections/all?sort_by=created-descending\">demo in the catalog</a>, then select its image to open quick view. Switch between 12 V and 24 V there too. The compatibility guidance should follow the selected version in both quick view and the product page.</li></ol>\n<p>The empty 24 V profile demonstrates an honest unknown state. It does not establish that the product is compatible or incompatible with a particular vehicle or setup.</p>\n"
      },
      {
        "title": "Create a Compatibility profile",
        "html": "<p>For data-entry examples, download the <a href=\"downloads/Siftwell-inflator-worked-example.xlsx\">worked inflator example (.xlsx)</a> and open <strong>Assignments</strong> and <strong>Compatibility</strong>. It shows a shared 12 V profile and an entry-name-only 24 V profile for the unknown state. Use the <a href=\"downloads/Siftwell-catalog-template.xlsx\">blank template (.xlsx)</a> for your own verified facts. The spreadsheet is optional, and importing still requires developer assistance. Read the <a href=\"?page=catalog-data#download-the-template-and-inflator-example\">workflow and limits</a> before using it.</p>\n<p>In Shopify <strong>Settings → Metafields and metaobjects</strong>, create a merchant-owned metaobject definition named <strong>Compatibility profile</strong>, with type <strong><code>compatibility_profile</code></strong>. Use these exact field keys:</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Field name</th>\n<th>Field key</th>\n<th>Type</th>\n<th>Rule</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Entry name</td>\n<td><code>entry_name</code></td>\n<td>Single line text</td>\n<td>Required; use as the display name in Shopify</td>\n</tr>\n<tr>\n<td>Requirements</td>\n<td><code>requirements</code></td>\n<td>List of single line text</td>\n<td>Optional; one condition per item</td>\n</tr>\n<tr>\n<td>Exclusions</td>\n<td><code>exclusions</code></td>\n<td>List of single line text</td>\n<td>Optional; one unsuitable application per item</td>\n</tr>\n<tr>\n<td>Application notes</td>\n<td><code>application_notes</code></td>\n<td>Multi-line text</td>\n<td>Optional; precise supported applications and limitations</td>\n</tr>\n<tr>\n<td>Reference URL</td>\n<td><code>reference_url</code></td>\n<td>URL</td>\n<td>Optional; manufacturer manual or compatibility reference</td>\n</tr>\n<tr>\n<td>Reference label</td>\n<td><code>reference_label</code></td>\n<td>Single line text</td>\n<td>Optional; describes the linked document</td>\n</tr>\n</tbody></table></div>\n<p>Enable storefront access. If Active/Draft is enabled, publish the entries you reference. Web-page publishing is unnecessary. Use verified information and an accurate reference label; the presence of a link does not mean Siftwell has verified it.</p>\n<p>Keep the lists short. The theme renders the first ten requirements and first ten exclusions, omitting blank items. Notes and list items are escaped plain text. Only HTTP(S) reference URLs become links.</p>"
      },
      {
        "title": "Connect the profile to products and variants",
        "html": "<ol>\n<li>Add a <strong>product metafield definition</strong> named Compatibility profile, namespace/key <strong><code>siftwell.compatibility</code></strong>. Choose a <strong>Metaobject reference</strong> to Compatibility profile, rather than a list.</li>\n<li>Add the same definition for <strong>variants</strong>, with the same namespace/key and reference type.</li>\n<li>Make both definitions accessible to the storefront where that setting is offered.</li>\n<li>Create a profile containing the product&#39;s requirements, then select it in the product metafield. Shared information must be accurate for every variant that inherits it.</li>\n<li>For any differing variant, create and select its complete profile. Include its applicable requirements, exclusions, notes and reference. An empty field in a variant profile stays empty; it does not inherit that field from the product profile.</li>\n</ol>\n<p>Installing the theme does not create definitions, profiles or product values. Existing suitable definitions can be reused through the mapping settings below.</p>\n"
      },
      {
        "title": "Display it in the theme",
        "html": "<p>In <strong>Theme settings → Compatibility &amp; requirements</strong>, enable <strong>Show compatibility guidance</strong>. Keep <strong>Compatibility metafield namespace</strong> as <code>siftwell</code> and <strong>Compatibility profile metafield key</strong> as <code>compatibility</code>, or match your existing definitions.</p>\n<p>Add the <strong>Compatibility &amp; requirements</strong> block to each relevant product template. The source&#39;s default template places it below the buying controls and specifications, keeping the option-to-purchase path together. Existing installed templates need the block added in the theme editor. It can be moved or removed without altering your data.</p>\n<p>Quick view uses the same mapping and selected-variant renderer, placed below the buying controls. The global switch controls both views. This first version does not add fit information to cards or comparison tables.</p>\n"
      },
      {
        "title": "Inheritance and honest unknown states",
        "html": "<ul>\n<li><strong>No variant profile:</strong> inherit the product profile as a complete unit.</li>\n<li><strong>Variant profile selected:</strong> replace the entire product profile. Do not carry across a missing exclusion or reference URL.</li>\n<li><strong>Selected profile with no requirements, exclusions or application notes, or an inaccessible profile:</strong> show <strong>Compatibility not confirmed</strong>. A draft/unavailable reference must not silently restore the product&#39;s requirements.</li>\n<li><strong>No such option combination:</strong> show no other variant&#39;s requirements. When compatibility guidance applies, show the unknown state.</li>\n<li><strong>No profile configured:</strong> hide the block by default. Enable <strong>Show an unknown state without a profile</strong> when missing compatibility information should be explicit throughout the catalog.</li>\n</ul>\n<p>Leaving Requirements empty alone does not trigger the unknown state when exclusions or application notes are present; the theme shows the supplied details. A reference link alone can still appear, but does not remove the unknown state. Merchants who have not set up any compatibility details get no block by default.</p>\n<p>To mark a particular variant as awaiting information, create an active profile containing only an Entry name and assign it to that variant. That deliberately replaces the shared profile with an unknown state. Clearing the variant&#39;s reference restores inheritance, so do not clear it to mean “not confirmed”.</p>\n<p>Populated profiles remind buyers to match the information to their vehicle or equipment and state that vehicle fit has not been checked. There is no automatic Compatible badge. A legacy Fit specification remains ordinary merchant-supplied text and does not override these rules.</p>\n"
      },
      {
        "title": "Check the buying decision",
        "html": "<p>Preview a product with different versions. Switch options on the product page and in quick view; confirm that the context, requirements, exclusions and reference all belong to the selected version. Open a direct variant URL without JavaScript. Test an empty profile and an inaccessible reference. Check a product without a profile and the global off switch.</p>\n<p>Ask a buyer to identify the required setup, an explicit exclusion and what they still need to confirm. Observe whether the reference helps them answer those questions. A working display does not prove fewer wrong orders or returns.</p>\n<p>Translate profile text through Shopify&#39;s supported translation tools, keeping the underlying field keys unchanged. Fixed labels and unknown-state text can be translated through the theme content editor.</p>\n"
      },
      {
        "title": "Next: verified matching",
        "html": "<p>Vehicle selection and verified fitment matching need suitable merchant-owned or licensed application data and a matching service. A saved vehicle, a supplied requirement or an AI recommendation does not establish fit. The current feature makes the known requirements and remaining uncertainty visible.</p>\n<p><a href=\"?page=specifications\">Set up variant specifications</a> · <a href=\"https://shopify.dev/docs/api/liquid/objects/metaobject\">Shopify metaobjects</a></p>\n"
      }
    ]
  },
  {
    "id": "parts",
    "group": "Build your store",
    "title": "Included parts and required extras",
    "lead": "Explain what comes in the box, what is needed separately and which additions are optional.",
    "sections": [
      {
        "title": "Separate the supplied items from extras",
        "html": "<p>Help customers answer “What comes in the box, and what else do I need to finish the job?” The optional <strong>Included parts &amp; extras</strong> block separates <strong>In the box</strong>, <strong>Required separately</strong> and <strong>Optional extras</strong> on product pages and in quick view.</p>\n<p>Start with one reusable saved set and fill only the lists you need. Products without details stay unchanged. Empty groups are hidden, so an absent required-extras list means information has not been supplied; it does not confirm that nothing else is needed. The merchant supplies the contents and the classification of extras. Product links do not establish compatibility or create a bundle.</p>"
      },
      {
        "title": "Prepare the facts with Sidekick",
        "html": "<p>Use the <a href=\"?page=sidekick\">Sidekick workflow</a> to turn supplier box contents into reviewed Parts set entries. Its <a href=\"?page=sidekick#fill-and-review-the-saved-entries\">parts prompt</a> separates included items, required extras and optional additions. Choose verified product links and product/variant assignments in Shopify&#39;s reference pickers. Create a complete set for a differing variant; its empty lists do not inherit shared items. The XLSX examples below remain optional.</p>"
      },
      {
        "title": "Try the live preview",
        "html": "<p>Open the <a href=\"https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548018405\">Workshop Inflator demo at 12 V</a>. If prompted, enter visitor password <strong><code>siftwell</code></strong>. This fictional product is labelled <strong>not for sale</strong>, and both variants are sold out. All contents, quantities and requirements are illustrative.</p>\n<ol>\n<li>Select <strong>12 V</strong> and find <strong>Included parts &amp; extras</strong> below compatibility guidance. The version inherits the shared set: an illustrative inflator and hose, a separately supplied 12 V DC source and an optional catalog link.</li>\n<li>Switch to <strong>24 V</strong>. Its complete variant set shows a 24 V inflator, heavy-duty hose, separately supplied 24 V DC source and optional work gloves. The 12 V wording and Canvas Tool Roll link disappear.</li>\n<li>Switch back to <strong>12 V</strong> to restore its shared details. The Canvas Tool Roll is an existing catalog product used only to demonstrate a native link; storage suitability and compatibility have not been checked.</li>\n<li>Open the <a href=\"https://siftwell-theme.myshopify.com/collections/all?sort_by=created-descending\">demo in the catalog</a>, then select its image to open quick view. Switch versions there and check the same three groups.</li>\n</ol>\n<p>The <a href=\"https://siftwell-theme.myshopify.com/products/siftwell-specifications-demo?variant=67876548051173\">direct 24 V link</a> also resolves its complete set on a full page load. The walkthrough demonstrates display and inheritance, rather than real box contents, verified matching or a bundle offer.</p>"
      },
      {
        "title": "Create one reusable parts set",
        "html": "<p>In Shopify <strong>Settings → Metafields and metaobjects</strong>, create a metaobject definition named <strong>Parts set</strong>, with type <strong><code>parts_set</code></strong>. Use these exact field keys:</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Field name</th>\n<th>Field key</th>\n<th>Type</th>\n<th>Use</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Entry name</td>\n<td><code>entry_name</code></td>\n<td>Single line text</td>\n<td>Required; use as the display name in Shopify. Not shown to shoppers.</td>\n</tr>\n<tr>\n<td>Included items</td>\n<td><code>included_items</code></td>\n<td>List of single line text</td>\n<td>Optional; one supplied item per entry, such as <code>Hose × 1</code>.</td>\n</tr>\n<tr>\n<td>Required extras</td>\n<td><code>required_extras</code></td>\n<td>List of single line text</td>\n<td>Optional; items needed separately, such as <code>Suitable power supply (not included)</code>.</td>\n</tr>\n<tr>\n<td>Optional extras</td>\n<td><code>optional_extras</code></td>\n<td>List of single line text</td>\n<td>Optional; useful additions, such as <code>Work gloves</code>.</td>\n</tr>\n<tr>\n<td>Required products</td>\n<td><code>required_products</code></td>\n<td>List of product references</td>\n<td>Optional; links to separately required products in your catalog.</td>\n</tr>\n<tr>\n<td>Optional products</td>\n<td><code>optional_products</code></td>\n<td>List of product references</td>\n<td>Optional; links to optional products in your catalog.</td>\n</tr>\n</tbody></table></div>\n<p>Enable storefront access. If Active/Draft is enabled, make the entries you want to display Active. Web-page publishing is unnecessary. Keep quantities in the item text; no separate entry or quantity field is needed for each line. Text-only lists work without either product-reference field being populated.</p>\n<p>The text and product links for an extras group appear together in that group&#39;s list. Avoid typing the same product again as a text item. The theme does not infer which text line corresponds to which product link or attach a quantity to a link.</p>\n<p>Reuse a saved set only where all its contents and requirements are accurate. Changing a shared set changes every product and variant that references it. Use a distinct Entry name to distinguish sets in Shopify.</p>"
      },
      {
        "title": "Connect products and differing variants",
        "html": "<ol>\n<li>Create a <strong>product metafield definition</strong> named Parts set with namespace/key <strong><code>siftwell.parts</code></strong>. Choose a <strong>Metaobject reference</strong> to Parts set, rather than a list.</li>\n<li>Assign a saved set to a product. Its details apply to every variant that inherits them, so enter only shared facts here.</li>\n<li>If versions differ, create the same <strong>variant metafield definition</strong>, with namespace/key <strong><code>siftwell.parts</code></strong>, restricted to Parts set. Variant setup is unnecessary when every version shares the same contents.</li>\n<li>Create a complete saved set for each differing variant and assign it to that variant. Empty lists in an assigned variant set remain empty.</li>\n<li>Make the definitions accessible to the storefront where that setting is offered.</li>\n</ol>\n<p>Installing the theme does not create definitions, saved sets or product values. If you already have a suitable metaobject definition with these field keys and types, reuse it through the theme&#39;s namespace/key mapping. A different supplier spreadsheet or existing field structure needs mapping; the theme does not copy it automatically.</p>"
      },
      {
        "title": "Display the optional block",
        "html": "<p>In <strong>Theme settings → Included parts &amp; extras</strong>, leave <strong>Show included parts and extras</strong> enabled. Set <strong>Parts metafield namespace</strong> to <code>siftwell</code> and <strong>Parts metafield key</strong> to <code>parts</code>, or match your existing suitable definition.</p>\n<p>Add <strong>Included parts &amp; extras</strong> to each relevant product template. The source&#39;s default template places it after compatibility guidance, below the buying controls and specifications. Existing installed templates need the block added in the theme editor. Move or remove the block without changing its saved data.</p>\n<p>Quick view uses the same mapping and selected-version details below the buying controls. The global switch controls both views. Empty output leaves no parts wrapper or extra spacing. Cards and comparison tables are unchanged.</p>"
      },
      {
        "title": "How versions and missing data behave",
        "html": "<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Situation</th>\n<th>Display</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>No saved set on the variant</td>\n<td>Inherit the complete product set.</td>\n</tr>\n<tr>\n<td>A set is assigned to the variant</td>\n<td>Replace the entire product set, including its product links.</td>\n</tr>\n<tr>\n<td>The assigned variant set is empty or inaccessible</td>\n<td>Hide this block. Never restore another version&#39;s contents or extras.</td>\n</tr>\n<tr>\n<td>A group is empty</td>\n<td>Hide only that group. No “nothing else required” claim is made.</td>\n</tr>\n<tr>\n<td>No saved set is configured</td>\n<td>Hide the block without an empty-state prompt.</td>\n</tr>\n<tr>\n<td>The selected option combination has no variant</td>\n<td>Hide the block; no other version&#39;s details are shown.</td>\n</tr>\n<tr>\n<td>The global switch is off</td>\n<td>Hide the feature on product pages and in quick view.</td>\n</tr>\n</tbody></table></div>\n<p>Clearing a variant&#39;s reference restores product inheritance. To deliberately withhold shared details for one version while you prepare its contents, assign an Active set containing only an Entry name.</p>\n<p>The first ten entries of each text list and each product list are processed. Blank text, inaccessible product references and links to the product being viewed are omitted. Duplicate product links within a group appear once. If the same product is linked as both required and optional within those limits, it appears only under Required separately. Plain text and product titles are escaped.</p>\n<p>Product references use Shopify&#39;s native product URLs. A link opens the product page, where the buyer can choose the correct variant and inspect current price and availability. This feature does not add extras to the bag, choose a linked product&#39;s variant, reserve stock, apply a bundle price or verify that an extra suits the selected version.</p>"
      },
      {
        "title": "Worked example",
        "html": "<p>Download the <a href=\"downloads/Siftwell-inflator-worked-example.xlsx\">worked inflator example (.xlsx)</a> and open <strong>Assignments</strong> and <strong>Parts</strong> to see shared contents and a complete 24 V replacement set, including removal of the shared example product link. Use the <a href=\"downloads/Siftwell-catalog-template.xlsx\">blank template (.xlsx)</a> for your own verified contents. This is an optional data-entry prototype; importing needs developer assistance. See the <a href=\"?page=catalog-data#download-the-template-and-inflator-example\">spreadsheet workflow and limits</a>.</p>\n<p>These fictional contents illustrate setup, not real product claims:</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>List</th>\n<th>Shared workshop inflator set</th>\n<th>Complete 24 V variant set</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Included items</td>\n<td><code>12 V inflator × 1</code>; <code>Hose × 1</code></td>\n<td><code>24 V inflator × 1</code>; <code>Heavy-duty hose × 1</code></td>\n</tr>\n<tr>\n<td>Required extras</td>\n<td><code>Suitable 12 V supply (not included)</code></td>\n<td><code>Suitable 24 V supply (not included)</code></td>\n</tr>\n<tr>\n<td>Optional extras</td>\n<td>Example tool-roll link; suitability unverified</td>\n<td>Protective work gloves; supplied separately</td>\n</tr>\n</tbody></table></div>\n<p>Assign the shared set to the product and the complete 24 V set to its differing variant. Switching to 24 V replaces every list; the 12 V supply and any shared product links must disappear. If an item has a verified suitable product in your catalog, you can add its native product reference to the appropriate extras group. Include any quantity or setup constraints in clear text.</p>"
      },
      {
        "title": "Check the buyer's question",
        "html": "<p>Preview shared, overridden, unconfigured and empty variant sets on the product page and in quick view. Switch versions and open a direct variant URL without JavaScript. Check phone widths, keyboard access to product links, the global switch and an inaccessible reference.</p>\n<p>Ask a buyer to identify two included items, something required separately and an optional extra. Confirm that the buyer can distinguish a product suggestion from verified compatibility. Test setup effort with one real product family before filling a whole catalog. Correct rendering does not establish fewer incomplete orders or improved conversion.</p>\n<p>Translate saved text using Shopify&#39;s supported translation tools while preserving field keys. Translate fixed group labels through the theme content editor. Linked titles use the product&#39;s translated title where available.</p>"
      },
      {
        "title": "Optional spreadsheet setup",
        "html": "<p>The <a href=\"?page=catalog-data\">spreadsheet workflow</a> provides the template, filled example and developer-assisted export, preview and import companion for these existing sets. It has an initial inflator-demo test. You can also maintain the sets directly in Shopify. A merchant-facing editor, automatic supplier parsing and live spreadsheet sync remain unimplemented. Installation guides, bundles and verified matching remain separate work.</p>\n<p><a href=\"?page=specifications\">Set up specifications</a> · <a href=\"?page=compatibility\">Explain compatibility</a> · <a href=\"https://shopify.dev/docs/api/liquid/objects/metafield\">Shopify metafields in Liquid</a> · <a href=\"https://shopify.dev/docs/api/liquid/objects/metaobject\">Shopify metaobjects</a></p>"
      }
    ]
  },
  {
    "id": "sidekick",
    "group": "Build your store",
    "title": "Set up product facts with Sidekick",
    "lead": "Supply source facts once, review reusable entries and select their product and variant references in Shopify.",
    "sections": [
      {
        "title": "Use the facts you already have",
        "html": "<p>For a first product family, use Sidekick in Shopify admin to turn existing supplier information into reusable specifications, compatibility details and parts sets. Review the facts, save the entries, then select their references on the products and variants that use them. Once the native definitions are in place, this route needs no spreadsheet importer or additional app.</p>\n<p>Shopify documents Sidekick assistance for <a href=\"https://help.shopify.com/en/manual/custom-data/metaobjects/creating-entries\">creating and editing metaobject entries</a> and <a href=\"https://help.shopify.com/en/manual/custom-data/metafields/adding-values-to-metafields\">filling product metafields</a>, with review before saving. The recipe below applies that assistance to Siftwell&#39;s existing fields. It has not been verified end to end in Sidekick with Siftwell, and does not promise automatic batch creation or variant-reference assignment.</p>\n<p>The repeatable path is: <strong>supply facts → review the draft → save reusable entries → select references → preview each variant</strong>. Save the preparation instructions as a Sidekick skill when you are happy with the first result.</p>"
      },
      {
        "title": "Set up the fields once",
        "html": "<p>Choose only the features your products need. Follow the existing guides to create their definitions, enable storefront access and add the relevant product blocks. Installing the theme does not create the data structure. Sidekick can guide you through setup; confirm the exact keys and types in Shopify before entering facts.</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Feature</th>\n<th>Saved entries</th>\n<th>Product and variant metafield</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"?page=specifications#create-the-specification-row-metaobject\">Specifications</a></td>\n<td>Specification row: one entry per code, label and value</td>\n<td><code>siftwell.specifications</code>: <strong>list</strong> of Specification row references</td>\n</tr>\n<tr>\n<td><a href=\"?page=compatibility#create-a-compatibility-profile\">Compatibility</a></td>\n<td>Compatibility profile: requirements, exclusions, notes and reference</td>\n<td><code>siftwell.compatibility</code>: <strong>single</strong> Compatibility profile reference</td>\n</tr>\n<tr>\n<td><a href=\"?page=parts#create-one-reusable-parts-set\">Included parts and extras</a></td>\n<td>Parts set: included items, required/optional extras and optional product references</td>\n<td><code>siftwell.parts</code>: <strong>single</strong> Parts set reference</td>\n</tr>\n</tbody></table></div>\n<p>If you already use different mappings, follow the names and keys configured in your theme. Keep specification codes consistent across comparable products. Create variant definitions only where versions need their own data. Entries must be Active if the definition has an Active/Draft setting.</p>"
      },
      {
        "title": "Start with one family and its source facts",
        "html": "<p>Open the product in Shopify admin and open Sidekick. Type <code>@</code> and select the actual product, so the conversation refers to the correct item. Identify each differing variant by its option values and its SKU if one exists. Open the exact variant in admin if its identity is unclear. You can also mention an existing metaobject or definition. <a href=\"https://help.shopify.com/en/manual/ai-powered-tools/sidekick/help-and-guidance#giving-sidekick-context-with-mentions-and-target-mode\">Shopify&#39;s context controls</a>.</p>\n<p>Paste the relevant supplier text or spreadsheet cells into the chat. Where document uploads are available, you can attach a supplier PDF or CSV. Some stores accept only image attachments; pasting the source text remains an alternative. For our XLSX examples, copy the relevant cells or export a working tab as CSV. <a href=\"https://help.shopify.com/en/manual/ai-powered-tools/sidekick/set-up#attaching-files-to-a-chat\">Sidekick attachments</a>.</p>\n<p>Replace the placeholders in this prompt and supply the source text:</p>\n<pre><code class=\"language-text\">Prepare Siftwell product facts for the product I mentioned and these variants:\n[option values and SKUs where available]. Use only the source information below.\n\nDraft a table in chat first; do not change store data yet. Separate shared\nproduct facts from variant differences. For each fact, show its source\nexcerpt and the product or variant it applies to.\n\nGroup the result into specifications, compatibility and parts. Preserve\nunits, quantities and specification codes. Separate included items,\nrequired extras and optional extras. Do not infer fit or box contents from\na product name, image or voltage. List missing facts as questions.\n\nPropose product defaults only for variants that can accurately inherit them.\nDistinguish unknown facts from deliberate blank overrides. List any existing\nsaved entries that could be reused without changing them.\n\nSource information:\n[paste verified supplier text, revision and relevant page or row references]\n</code></pre>\n<p>Check the source excerpts and variant mapping before continuing. Keep unresolved facts in the questions list. A missing specification must not become a blank variant override unless you intend to hide that shared specification.</p>"
      },
      {
        "title": "Fill and review the saved entries",
        "html": "<p>Go to <strong>Content → Metaobjects</strong>, open the relevant definition and choose <strong>Add entry</strong>. Ask Sidekick to fill the current form from the approved facts. Work through one entry at a time, reviewing the populated fields before clicking <strong>Save</strong>. If a field cannot be filled, enter the approved value in its native control. <a href=\"https://help.shopify.com/en/manual/ai-powered-tools/sidekick/help-and-guidance#completing-forms-and-tasks-with-sidekick\">Shopify&#39;s form assistance</a>.</p>\n<p>Use clear entry names such as “Workshop inflator — 24 V — parts” so you can find them later. Reuse an existing entry when its complete contents are accurate. Editing a shared entry can change every product that references it; create a separate entry when only one product or variant should differ.</p>\n<h3>Specification row prompt</h3>\n<p>Repeat this for each approved row. Give an optional Entry name field a distinctive name if your definition includes it.</p>\n<pre><code class=\"language-text\">Fill this new Specification row form with these approved values:\ncode: [stable code, for example input-voltage]\nlabel: [approved label]\nvalue: [approved value and units]\n\nKeep the code unchanged. Do not fill an intentional blank label or value.\nDo not edit existing entries or assign this row to a product yet.\nLeave the completed form for my review and Save.\n</code></pre>\n<p>For a variant override, a blank label can inherit the shared label. A matching code with a deliberately blank value suppresses the shared row. A new code needs a label and value. Keep each list within 20 rows.</p>\n<h3>Compatibility profile prompt</h3>\n<pre><code class=\"language-text\">Fill this new Compatibility profile form from these approved values:\nentry_name: [distinctive internal name]\nrequirements: [one approved requirement per list item]\nexclusions: [one approved exclusion per list item]\napplication_notes: [approved notes]\nreference_url: [actual supplier reference URL, or leave empty]\nreference_label: [accurate reference label, or leave empty]\n\nKeep the approved empty fields empty. Do not invent a URL or claim verified\nvehicle fit. This is the complete profile for [product or exact variant].\nDo not edit existing profiles. Leave the form for my review and Save.\n</code></pre>\n<p>A variant profile replaces the whole product profile. Include all facts that apply to that variant; individual empty fields do not inherit. To deliberately show <strong>Compatibility not confirmed</strong>, use an Active profile containing only an Entry name. Keep requirements and exclusions within ten items each.</p>\n<h3>Parts set prompt</h3>\n<pre><code class=\"language-text\">Fill this new Parts set form from these approved values:\nentry_name: [distinctive internal name]\nincluded_items: [one included item and quantity per list item]\nrequired_extras: [one required, separately supplied item per list item]\noptional_extras: [one optional item per list item]\n\nThis is the complete set for [product or exact variant]. Keep approved\nempty lists empty. Leave required_products and optional_products unselected;\nI will choose verified catalog products in Shopify&#39;s reference picker.\nDo not infer suitability, edit existing sets or create products.\nLeave the form for my review and Save.\n</code></pre>\n<p>Choose any linked extras in the native product-reference pickers after checking their suitability and availability. A typed product name or URL in a text list does not create a product reference. Keep each text or product list within ten items. A variant parts set replaces every shared list and product link.</p>"
      },
      {
        "title": "Link the entries to products and variants",
        "html": "<p>Creating an entry does not display it on a product. In the product&#39;s <strong>Metafields</strong> section, select the shared entries using Shopify&#39;s pickers and save:</p>\n<ul>\n<li><strong>Specification rows:</strong> select the shared row entries in the desired order.</li>\n<li><strong>Compatibility profile:</strong> select one complete shared profile.</li>\n<li><strong>Parts set:</strong> select one complete shared set.</li>\n</ul>\n<p>Open each differing variant and select its overrides in that variant&#39;s metafields. A variant without an assignment inherits the shared product data. Leave an existing override in place unless you intend to change it. Clearing its reference restores inheritance.</p>\n<p>For specifications, select only rows that override, suppress or add to the shared rows. For compatibility and parts, select a complete replacement profile or set. Use Shopify&#39;s picker to confirm the actual saved entries. If Sidekick offers to fill a supported reference field, review its selection against this same list before saving; do not assume a chat response has completed the assignment.</p>\n<p>For many products that reuse the same sets, use <a href=\"https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields\">Shopify&#39;s metafield bulk editor</a> to reduce repeated selection. Keep product and variant assignments explicit.</p>"
      },
      {
        "title": "Walk through the inflator example",
        "html": "<p>Use the <a href=\"downloads/Siftwell-inflator-worked-example.xlsx\">filled inflator XLSX</a> as a reading example alongside the <a href=\"?page=specifications#try-the-live-auto-parts-preview\">live walkthrough</a>. Its identifiers and facts are fictional; replace them for your own catalog. The <a href=\"downloads/Siftwell-catalog-template.xlsx\">blank template</a> is optional for organizing your source facts.</p>\n<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Target</th>\n<th>Specifications</th>\n<th>Compatibility</th>\n<th>Parts</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Shared product</td>\n<td>Input voltage 12 V, Connector DC plug, Rated output 150 W</td>\n<td>Illustrative 12 V requirements</td>\n<td>Complete illustrative 12 V set</td>\n</tr>\n<tr>\n<td>12 V variant</td>\n<td>No new override</td>\n<td>No new override</td>\n<td>No new override</td>\n</tr>\n<tr>\n<td>24 V variant</td>\n<td>Override voltage/output, suppress Connector, add Cable length</td>\n<td>Entry-name-only profile, showing unknown</td>\n<td>Complete 24 V set, without the shared tool-roll link</td>\n</tr>\n</tbody></table></div>\n<p>On an existing catalog, “no new override” means keep the current assignment; clear it in Shopify only when you deliberately want inheritance. Do not copy the example&#39;s illustrative requirements into a real product.</p>\n<p>Preview the product page and quick view, switch variants and open a direct variant URL. Confirm the correct facts appear, an unknown profile stays unknown, and 24 V does not retain the 12 V contents or links. For specification comparison, compare the exact variants from quick view.</p>"
      },
      {
        "title": "Reuse the instructions for the next family",
        "html": "<p>After reviewing your first family, save the preparation instructions as a Sidekick skill through <strong>Sidekick → + → Skills → New Skill</strong>. Choose a shortcut such as <code>/siftwell-facts</code> and use the instructions below. When running it, select the skill or type its shortcut and provide the new product and supplier source. <a href=\"https://help.shopify.com/en/manual/ai-powered-tools/sidekick/skills\">Shopify&#39;s Sidekick skills guide</a>.</p>\n<pre><code class=\"language-text\">Prepare a review table of Siftwell specifications, compatibility and parts\nfor the explicitly selected product and variants, using supplied source\nfacts only. Show source excerpts, shared defaults, variant differences,\nreusable existing entries and unresolved questions. Preserve codes, units\nand quantities. Treat compatibility and parts overrides as complete sets.\nNever infer fit, invent facts or turn an unknown fact into a blank override.\nDo not modify existing shared entries or store data during preparation.\nAsk for the product, variant identifiers or source facts if they are missing.\n</code></pre>\n<p>The skill reuses your preparation instructions. It does not create missing definitions or make facts trustworthy without review. For larger imports, retain the <a href=\"?page=catalog-data\">optional spreadsheet workflow</a> or evaluate a suitable bulk-editing app. This guide covers assisted setup, not continuous supplier synchronization or verified fitment matching.</p>"
      }
    ]
  },
  {
    "id": "catalog-data",
    "group": "Build your store",
    "title": "Edit catalog facts in a spreadsheet",
    "lead": "An optional prototype with a blank template, a worked inflator example and developer-assisted imports.",
    "sections": [
      {
        "title": "Maintain the facts once",
        "html": "<p>Maintaining useful facts should not require opening every product and every saved entry in Shopify. Start with a small product family, export the details already present and edit them in one workbook. Enter shared information once, then assign that saved set to the products that use it.</p>\n<p>For your first family, start with the <a href=\"?page=sidekick\">Sidekick-assisted setup</a>: supply existing facts, review the entries and select their references in Shopify. Once native definitions are in place, that route uses no spreadsheet importer or additional app. Use this workbook workflow when preparing a batch or keeping a separate working copy is useful.</p>\n<p><strong>This is an optional prototype with an initial inflator-demo test.</strong> It supports the existing specification rows, compatibility details and included-parts sets. You can continue editing these facts directly in Shopify. You do not need a workbook, or all three features, to use the theme.</p>\n<p>The Google Sheets-compatible workbooks organize data entry. Saving an XLSX does not update Shopify. Importing requires the developer-assisted companion, native definitions and authenticated Shopify CLI setup described below. A merchant-facing app and live Google Sheets connection are not included.</p>"
      },
      {
        "title": "Download the template and inflator example",
        "html": "<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Download</th>\n<th>Use it for</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"downloads/Siftwell-catalog-template.xlsx\">Blank catalog template (.xlsx)</a></td>\n<td>Start your own product family. It contains headers and instructions, with no sample assignments. Prefer filling it from an export of your existing facts.</td>\n</tr>\n<tr>\n<td><a href=\"downloads/Siftwell-inflator-worked-example.xlsx\">Worked inflator example (.xlsx)</a></td>\n<td>Learn the four tabs using fictional 12 V and 24 V versions. It uses example handles, SKUs and set keys, with no live store identifiers.</td>\n</tr>\n</tbody></table></div>\n<p>Open either workbook in Excel, or import it into Google Sheets and download the completed copy as XLSX. Read the <strong>Read me</strong> tab before editing. The filled example is for learning: replace its example product handles, unique variant SKUs, linked-product handles and illustrative facts with your own verified data before making a plan. The example does not create products or variants.</p>\n<p>In the worked example:</p>\n<ol>\n<li><strong>Assignments:</strong> the product row supplies shared sets. The 12 V row leaves its assignments blank; on a new setup it inherits the product sets. On an existing catalog, those blanks preserve any current overrides.</li>\n<li><strong>Specifications:</strong> the 24 V set changes voltage and output, suppresses Connector with a blank value and adds Cable length.</li>\n<li><strong>Compatibility:</strong> the 24 V set contains only an entry name. Assigning it deliberately replaces the shared 12 V profile with <strong>Compatibility not confirmed</strong>.</li>\n<li><strong>Parts:</strong> the 24 V set supplies complete replacement contents and extras. It omits the shared example tool-roll link, so that link does not carry over.</li>\n</ol>\n<p>The <a href=\"?page=specifications#try-the-live-auto-parts-preview\">live inflator walkthrough</a> shows the same display rules. All example figures and requirements are illustrative. A product link demonstrates navigation, not verified suitability.</p>"
      },
      {
        "title": "Choose the smallest useful workflow",
        "html": "<p>For guided entry from supplier text, use <a href=\"?page=sidekick\">Sidekick</a>. The guide provides preparation instructions, prompts for the three native entry types and an optional reusable Sidekick skill. Product and variant reference selection remains an explicit reviewed step.</p>\n<p>For a few product or variant assignments, try <a href=\"https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields\">Shopify&#39;s native metafield bulk editor</a>. It already presents selected products and metafields in a table. Reusing an existing saved set can be enough; you do not need this companion for every small edit.</p>\n<p>For a product family with many facts or variant differences, the workbook keeps the entries and their assignments together. Shopify&#39;s native product CSV supports certain product metafield types and reference lists, but excludes variant metafields. A custom CSV column alone does not create the saved entries behind those references. <a href=\"https://help.shopify.com/en/manual/products/import-export/using-csv\">Shopify CSV capabilities</a>.</p>"
      },
      {
        "title": "Edit four working tabs",
        "html": "<div class=\"table-wrap\"><table>\n<thead>\n<tr>\n<th>Tab</th>\n<th>What you edit</th>\n<th>What stays shared</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Assignments</td>\n<td>Product handle, exported variant identifier or SKU, and the saved-set keys to use</td>\n<td>Blank feature cells leave that assignment unchanged. A row without variant identifiers supplies shared product details.</td>\n</tr>\n<tr>\n<td>Specifications</td>\n<td>One row per set key and specification code, with its label and value</td>\n<td>Repeat the same set key to group rows. Keep codes and units consistent across comparable items.</td>\n</tr>\n<tr>\n<td>Compatibility</td>\n<td>One row per saved set, with requirements, exclusions, notes and a reference</td>\n<td>Assign the same key to every selected product or variant for which the complete set is accurate.</td>\n</tr>\n<tr>\n<td>Parts</td>\n<td>One row per saved set, with included items and required/optional extras</td>\n<td>Quantities stay in item text. Product links use handles, one per line.</td>\n</tr>\n</tbody></table></div>\n<p>Use a line break inside a cell for each list item. Keep the tab names and header row. Preserve variant identifiers and SKUs as text; a variant ID can be Shopify&#39;s full <code>gid://shopify/ProductVariant/...</code> identifier or its exact digits. The export uses full identifiers so spreadsheets cannot display them in scientific notation. The optional SKU must agree with the ID; a SKU alone must be unique within the product.</p>\n<p>The blank workbook contains no demo records. Import it into Google Sheets or open it in Excel, then fill it from an export or paste verified supplier values into the relevant columns. Save the completed workbook as XLSX. You can instead export the four working tabs as UTF-8 <code>assignments.csv</code>, <code>specifications.csv</code>, <code>compatibility.csv</code> and <code>parts.csv</code>. Formulas are rejected in the four import tabs; paste the verified results as values.</p>"
      },
      {
        "title": "Keep blanks and version differences explicit",
        "html": "<ul>\n<li>A blank feature cell in <strong>Assignments</strong> means <strong>leave Shopify unchanged</strong>. Deleting a worksheet row does not delete the saved set or its assignment.</li>\n<li>Empty fields inside a selected Compatibility or Parts row belong to that complete set. A variant set replaces the entire product set. An entry-name-only set can deliberately withhold shared information, following the feature&#39;s existing empty-state rules.</li>\n<li>A blank specification value on a variant can deliberately suppress an existing shared code. A new variant code needs both a label and a value. Shared product specification rows need labels and values.</li>\n<li>Clearing an override to restore inheritance is done in Shopify in this first version. The companion does not delete entries or assignments.</li>\n<li>The theme processes up to 20 specification rows per set and ten lines per compatibility/parts list. The importer rejects excess entries rather than silently truncating them.</li>\n</ul>\n<p>The companion displays supplied information. It does not infer compatibility, invent supplier facts, choose an extra&#39;s variant or create a bundle.</p>"
      },
      {
        "title": "Preview before saving",
        "html": "<p>The preview lists the exact selected product or variant, existing facts, proposed facts and the number of new entries and changed assignments. A fresh export without edits should propose zero changes.</p>\n<p>An edit to a shared set creates a changed copy and assigns it only to the selected rows. It does not modify the existing entry or its other users. Include every intended product in Assignments when a shared change should reach all of them. Unchanged entries are reused, and retries can reuse a previously created copy with identical content. New copies contain the supplied default-language values; translations on existing entries do not move to them. Keep translated sets in Shopify until you have a plan to recreate those translations on the copies.</p>\n<p>The companion rechecks the plan against current catalog data before saving. Changed assignments use Shopify&#39;s compare-and-set protection, so an intervening change to the same metafield is rejected. The run saves its original facts and a receipt outside the theme repository, then verifies the requested data after import.</p>\n<p>An import can span several API requests. If a later request fails, an earlier request may already have succeeded. Keep the receipt, inspect the reported state and create a fresh preview before retrying. The companion does not automatically roll back or delete entries. <a href=\"https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet\">Shopify compare-and-set behavior</a>.</p>"
      },
      {
        "title": "Developer setup and commands",
        "html": "<p>Use Python 3.10 or newer and the authenticated official Shopify CLI with its supported Node.js version. The companion uses <code>shopify store execute</code>; older CLI versions without that command are unsupported. Credentials remain with Shopify CLI. Do not put Admin tokens in the workbook, browser, theme assets or public repository.</p>\n<p>Create the native definitions once using the existing <a href=\"?page=specifications\">specification</a>, <a href=\"?page=compatibility\">compatibility</a> and <a href=\"?page=parts\">parts</a> guides. The companion validates keys, types, reference restrictions and storefront access. It expects the documented native types and the <code>specifications</code>, <code>compatibility</code> and <code>parts</code> keys in the namespace you select. Custom type names, per-feature key remapping and additional required definition fields need a later adapter. It does not create or migrate definitions.</p>\n<p>The examples below run from a <a href=\"https://github.com/lixonic/Siftwell-Shopify-theme\">checkout of the theme source</a>, which includes <code>scripts/catalog_data.py</code>. The companion is separate from the installable theme ZIP. Replace the store and product handles with your own. Keep the private working directory outside the public repository.</p>\n<pre><code class=\"language-sh\"># Export current facts for one family. Repeat --handle for more products.\npython3 scripts/catalog_data.py export \\\n  --store your-store.myshopify.com \\\n  --handle workshop-inflator \\\n  --out /private/catalog-inflators\n\n# Check the workbook locally, without connecting to Shopify.\npython3 scripts/catalog_data.py validate \\\n  --input /private/edited-catalog.xlsx\n\n# Read current catalog data and create a proposed-change preview.\npython3 scripts/catalog_data.py plan \\\n  --store your-store.myshopify.com \\\n  --input /private/edited-catalog.xlsx \\\n  --out /private/inflators-plan.json\n\n# After reviewing the adjacent inflators-plan.md, apply that exact plan.\npython3 scripts/catalog_data.py apply \\\n  --store your-store.myshopify.com \\\n  --plan /private/inflators-plan.json \\\n  --confirm FULL_PLAN_ID_PRINTED_BY_PLAN \\\n  --receipt /private/inflators-receipt.json\n</code></pre>\n<p><code>--input</code> also accepts the directory containing all four CSV files. Use <code>--namespace</code> if the three documented keys live in another shared namespace. Use <code>--shopify /path/to/shopify</code> to select an existing CLI installation. <code>template --out /private/blank-catalog</code> creates header-only CSV files without a store connection. Exports and previews refuse to overwrite an existing output.</p>\n<p>Export requires product, metafield-definition and metaobject read access. Import additionally requires the permissions to create metaobjects and update product/variant metafields. Grant only the scopes required by your store&#39;s chosen workflow. This companion does not change app permissions itself.</p>"
      },
      {
        "title": "What the first version covers",
        "html": "<p>The companion supports up to 100 fetched product handles and 500 selected assignment rows per plan, with variant pagination and exact target resolution. It preserves product titles, descriptions, prices, inventory, publication settings and existing saved entries. It does not export or migrate the legacy five specification slots, translate content, populate sales-channel attribute mappings, parse arbitrary supplier files, synchronize Sheets continuously or provide a merchant-facing import app. Active linked catalog products still need their applicability and Online Store availability checked by the merchant.</p>\n<p>The prototype has been checked with the fictional inflator, including an unchanged export, XLSX round trip and a targeted import followed by restoration of the original assignment. Local tests cover blank-cell preservation, duplicate targets/SKUs, stale previews, immutable shared entries and partial failures. This establishes the initial prototype behavior. It does not establish real merchant setup time or usability with supplier files.</p>\n<p><a href=\"?page=specifications\">Product specifications</a> · <a href=\"?page=compatibility\">Compatibility details</a> · <a href=\"?page=parts\">Included parts and extras</a></p>"
      }
    ]
  },
  {
    "id": "collections",
    "group": "Build your store",
    "title": "Collections, search and comparison",
    "lead": "Make a broad catalog feel approachable, one useful choice at a time.",
    "sections": [
      {
        "title": "Group by a recognizable need",
        "html": "<p>Create collections around a product family, job or occasion. Give each a clear heading, a short description when helpful and a representative image. Keep collection names consistent across the main menu, finder and home page.</p>"
      },
      {
        "title": "Offer filters that narrow the choice",
        "html": "<p>Configure storefront filters in Shopify Search &amp; Discovery. Populate the product information behind each filter. In <strong>Shopping workspace</strong>, choose <strong>Show collection filters</strong> and <strong>Show additional Shopify filters</strong> as appropriate.</p><p><strong>Price shortcuts</strong> are comma-separated amounts in the shopper’s currency. They need the Price filter configured in Shopify. Activity choices link to the collections you select.</p>"
      },
      {
        "title": "Let customers search in their own words",
        "html": "<p>The home page search suggests products as customers type. A search link remains available on other pages. Full search can also return pages and articles, so useful guidance can sit beside products.</p><p>Use product names and descriptions that match the language customers use for the task.</p>"
      },
      {
        "title": "Compare the details that matter",
        "html": "<p>Customers can select up to three products. A desktop comparison area appears after a selection; a compact comparison control serves smaller screens. No selection leaves the catalog open.</p><p>Comparison uses Shopify prices and the same product specifications as the product page. It does not verify technical or vehicle compatibility.</p><p>Turn comparison off in <strong>Theme settings → Shopping tools → Show Compare checkboxes</strong> when it is not useful for your catalog.</p><figure class=\"guide-preview\"><a href=\"images/comparison-desktop.jpg\"><img src=\"images/comparison-desktop.jpg\" alt=\"Three Siftwell demo products compared by price, weight, material, fit, feature and intended use.\" width=\"1440\" height=\"1000\" loading=\"lazy\"></a><figcaption>The same specification fields appear side by side. Demo products illustrate the layout and do not imply that the items are interchangeable.</figcaption></figure><p>Product recommendations do not inherit comparison automatically. In a related <strong>Product recommendations</strong> section, use <strong>Show comparison for related alternatives</strong> only when the selected products solve the same buying need. Set the section <strong>Heading</strong> to explain that purpose and curate the products in Shopify Search &amp; Discovery. Complementary sections never show comparison, even if the checkbox is enabled.</p><p>The checkbox adds an item to the existing comparison list. It does not automatically include the product being viewed. An explicit Compare with this product flow remains on the roadmap.</p><p>Catalog comparison uses shared product facts. Compare in quick view keeps the exact variant name, base variant price, specification values and URL. Two variants can occupy two of the three slots. Switching options does not rewrite a previous pick. <a href=\"?page=specifications\">Set up variant-aware facts →</a></p>"
      }
    ]
  },
  {
    "id": "reviews",
    "group": "Build your store",
    "title": "Add customer reviews",
    "lead": "Give customer experience a useful place beside the product facts. Siftwell displays app-supplied ratings and provides space for your review provider’s full widget.",
    "sections": [
      {
        "title": "Connect a review provider",
        "html": "<p>Use a review app that supplies Shopify’s standard product rating and count fields and offers theme app blocks. The provider collects and manages reviews; Siftwell displays the supplied summary and gives the full widget a place in the product template.</p><p>Shopify’s own reviews are collected in Shop. Displaying Shop reviews on an online store uses a supported partner app. <a href=\"https://help.shopify.com/en/manual/online-sales-channels/shop/product-reviews/sync-partner-apps\">Read Shopify’s review-sync guide</a>. The retired standalone Shopify Product Reviews app is not required by the theme.</p>"
      },
      {
        "title": "Put the summary near the product title",
        "html": "<p>In the theme editor, open a product template and add <strong>Rating summary</strong> inside the main product section. The clean default template places it after Title. Move or remove it to suit the product information.</p><p>The summary reads the app-maintained <code>reviews.rating</code> and <code>reviews.rating_count</code> product metafields. It appears only when both contain a valid positive rating and review count. Missing, zero-count or invalid data leaves no rating row.</p><p>If your app already supplies a star-summary block, use that or Siftwell’s Rating summary to avoid showing it twice.</p>"
      },
      {
        "title": "Add the full review widget",
        "html": "<p>Open <strong>Customer reviews</strong> below the main product section and add your provider’s app block. You can also add this section to another product template. Turn off <strong>Show section heading</strong> when the app widget provides its own heading.</p><p>An empty Customer reviews section is hidden from shoppers. The editor shows a setup hint until you add an app block. Your app controls submission, moderation, verified-purchase labels, sorting and customer photos.</p>"
      },
      {
        "title": "Choose where compact ratings appear",
        "html": "<p>Use <strong>Theme settings → Shopping tools → Show ratings on product cards and quick view</strong> for those two surfaces. The product page’s Rating summary is an independently editable block.</p><p>Fractional five-point ratings use partial star fills and a numeric average. Other positive scales show the number and maximum without a five-star illustration. Accessible text states the average, scale and count; decorative stars are hidden from screen readers.</p>"
      },
      {
        "title": "Check with real review data",
        "html": "<p>Review a product with published reviews and one with none. Compare the average and count with the provider’s records. Check the product page, catalog and quick view on a phone and with a keyboard. Confirm the full widget loads and that the app handles submission and errors as intended.</p><p>The source includes rating-render checks and an app-slot fixture check. A real provider integration is still unverified; these checks do not establish collection, moderation or Shop syndication. Theme installation does not guarantee agent discovery or a search-ranking benefit.</p><div class=\"article-links\"><a href=\"?page=products\">Arrange the product page →</a><a href=\"?page=support\">Get community help →</a></div>"
      }
    ]
  },
  {
    "id": "cart",
    "group": "Build your store",
    "title": "Bag and checkout",
    "lead": "Keep the final choices clear, from a product selection to Shopify checkout.",
    "sections": [
      {
        "title": "Choose the add-to-bag experience",
        "html": "<p>By default, a successful add shows a brief confirmation with a View bag link. To open the bag immediately, turn on <strong>Theme settings → Shopping tools → Open the bag after adding a product</strong>.</p><p>Choose the behavior that suits the way people shop your catalog. A small accessory purchase may benefit from staying in the product grid.</p>"
      },
      {
        "title": "Keep purchase details in view",
        "html": "<p>The bag shows selected options, quantities, discounts, public customization details and selling-plan information from Shopify. Customers can adjust quantity or add an order note. An availability message explains when Shopify cannot accept a requested quantity.</p>"
      },
      {
        "title": "Prepare checkout in Shopify",
        "html": "<p>Checkout and accelerated payment buttons come from Shopify. Configure payments, shipping, taxes and pickup in your store. Check the wording and totals customers see before launch, using your store’s test payment setup.</p><p>If you sell subscriptions or gift cards, also review their product choices, recipient fields and purchase details.</p>"
      }
    ]
  },
  {
    "id": "markets",
    "group": "Build your store",
    "title": "Markets and languages",
    "lead": "Carry the same clear store experience into each market you serve.",
    "sections": [
      {
        "title": "Prepare the market in Shopify",
        "html": "<p>Configure countries, currencies and availability in Shopify Markets. When multiple countries are available, Siftwell offers a country selector in the footer. Shopify determines the displayed prices and currency.</p>"
      },
      {
        "title": "Translate the whole shopping path",
        "html": "<p>Publish your languages in Shopify. Translate product and collection content, page text and metafield values as well as the theme’s interface labels. Customers can choose published languages in the footer.</p>"
      },
      {
        "title": "Read the store in each language",
        "html": "<p>Check longer headings, navigation labels, price shortcuts and product specifications. Review availability, shipping information and checkout for each market. Keep units and fit descriptions meaningful for the people reading them.</p>"
      }
    ]
  },
  {
    "id": "performance-accessibility",
    "group": "Care for your store",
    "title": "Performance and accessibility",
    "lead": "Purposeful loading, readable details and a comfortable path through the catalog. See what the theme supports and what the recorded demo results cover.",
    "sections": [
      {
        "title": "Keep loading purposeful",
        "html": "<p>Siftwell renders its pages with Liquid and enhances them with deferred JavaScript, without a frontend runtime framework. Responsive image sizes help the browser load an appropriate source; the first product image receives high priority, while secondary gallery thumbnails and below-the-fold imagery load lazily where appropriate.</p><p>Product video and 3D players wait behind a poster until a customer requests them. Shopify font settings supply the typography. These choices keep the work focused on the content someone is viewing.</p><p>Your images, chosen fonts, apps and catalog still affect loading. Review the store again after adding your own content and extensions.</p>"
      },
      {
        "title": "Read the recorded demo results",
        "html": "<p>The measurements below were recorded on <strong>20 October 2026</strong> against the populated <strong>Auto 0.7.4 demo</strong>. They are historical demo measurements; the downloadable MIT 0.8.0 source has not received a fresh Lighthouse audit or completed fresh-install verification.</p><div class=\"table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Recorded demo performance\"><table><caption>Lighthouse performance medians, out of 100</caption><thead><tr><th scope=\"col\">Page</th><th scope=\"col\">Mobile</th><th scope=\"col\">Desktop</th></tr></thead><tbody><tr><th scope=\"row\">Home</th><td>60</td><td>85</td></tr><tr><th scope=\"row\">Collection</th><td>65</td><td>77</td></tr><tr><th scope=\"row\">Product</th><td>63</td><td>86*</td></tr></tbody></table></div><p>Medians use three runs without incomplete-load warnings per cell, except desktop product: <strong>*86 is provisional, based on two completed samples</strong>. Of 21 recorded runs, 17 finished without load warnings. Scores vary with content, apps, hosting conditions and the test environment.</p><details class=\"guide-details\"><summary>How the results were measured</summary><p>Lighthouse 12.8.2 and Chrome 155 used normal cold-cache settings and simulated mobile/desktop throttling. Storefront authentication was established before the scored navigation. Shopify platform resources were not blocked.</p><p>The full score set is shown here, including low scores. An asterisk marks an incomplete-load warning; that run is excluded from the medians above.</p><div class=\"table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"All recorded performance scores\"><table><caption>Performance scores in run order</caption><thead><tr><th scope=\"col\">Device</th><th scope=\"col\">Page</th><th scope=\"col\">Scores</th></tr></thead><tbody><tr><td>Mobile</td><th scope=\"row\">Home</th><td>59, 65, 60</td></tr><tr><td>Mobile</td><th scope=\"row\">Collection</th><td>65, 67, 65*, 64</td></tr><tr><td>Mobile</td><th scope=\"row\">Product</th><td>63, 38, 66</td></tr><tr><td>Desktop</td><th scope=\"row\">Home</th><td>85, 92, 71</td></tr><tr><td>Desktop</td><th scope=\"row\">Collection</th><td>91, 75, 77</td></tr><tr><td>Desktop</td><th scope=\"row\">Product</th><td>80*, 79*, 88, 84, 94*</td></tr></tbody></table></div><p>CPU calibration and network conditions varied substantially. Two header CSS corrections landed during the batch and received separate visual checks. The MIT export retains the measured shopping JavaScript, CSS and gallery implementation, while replacing metadata, font registration and several media icons.</p><p>This is not an exact-package certification or a controlled speed-improvement comparison. Shopify’s standardized benchmark catalog was not audited.</p></details>"
      },
      {
        "title": "Make the shopping path comfortable",
        "html": "<p>The theme includes a skip link, semantic headings and landmarks, visible focus, named controls, dialog focus handling and Escape behavior. Native product and cart forms provide essential-action fallbacks. Reduced-motion styles remove animated transitions and smooth scrolling when a device requests them.</p><p>Observed Chromium checks on Auto 0.7.4 covered keyboard operation and focus return for dialogs, nested image zoom, focus retention after catalog sorting and filtering, comparison removal, predictive-search state and native required-email validation. Mobile account and bag controls were also checked at 320px and 390px, including pointer activation.</p><p><strong>Lighthouse automated accessibility scored 100/100 in all 21 reports</strong>, including four with incomplete-load warnings. That score does not establish WCAG conformance, spoken screen-reader output or complete browser/device coverage. The result-count status markup was checked; its spoken announcement remains unverified.</p>"
      },
      {
        "title": "Keep the palette readable",
        "html": "<p>The demo’s sampled default colors produced the following contrast ratios:</p><div class=\"table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Sampled default-palette contrast\"><table><caption>Default demo palette samples</caption><thead><tr><th scope=\"col\">Use</th><th scope=\"col\">Contrast</th></tr></thead><tbody><tr><th scope=\"row\">Body text</th><td>14.86:1</td></tr><tr><th scope=\"row\">Secondary page text</th><td>4.72:1</td></tr><tr><th scope=\"row\">Navigation text</th><td>13.95:1</td></tr><tr><th scope=\"row\">Accent-button text</th><td>5.33:1</td></tr><tr><th scope=\"row\">Form boundary</th><td>4.89:1</td></tr></tbody></table></div><p>These samples do not cover every color combination or photographic overlay. Recheck contrast after changing your palette or images, and keep important words in editable text.</p>"
      },
      {
        "title": "Review your own store before launch",
        "html": "<p>Screen-reader speech, Safari, Firefox, iOS, physical touch devices and broader browser/version coverage remain unverified. Reduced-motion handling is present in code; an operating-system-setting runtime check remains open. Full template, failure-state, offline, no-JavaScript and editor-reinsertion coverage is incomplete.</p><p>Follow the shopping path with your products and apps using a keyboard, a screen reader and real phones. Check focus, zoom and reflow, form errors, dialog scrolling and motion preferences. Record the browser/device and exact steps when reporting a problem.</p><div class=\"article-links\"><a href=\"?page=accessibility\">Review content and keyboard use →</a><a href=\"?page=support\">Report a reproducible issue →</a></div>"
      }
    ]
  },
  {
    "id": "accessibility",
    "group": "Care for your store",
    "title": "Keep the store easy to use",
    "lead": "Readable content, clear focus and comfortable motion are part of the design.",
    "sections": [
      {
        "title": "Make the content readable",
        "html": "<p>Choose foreground and background colors with strong contrast. Give images useful descriptions, links meaningful labels and pages a clear heading order. Keep important words in editable text.</p>"
      },
      {
        "title": "Check a keyboard path",
        "html": "<p>Move through navigation, search, product choices and the bag with Tab and Shift-Tab. The visible outline shows which control is active. Use Enter to activate controls and Escape to close a dialog. Check that every step makes sense in the order it is reached.</p>"
      },
      {
        "title": "Respect motion preferences",
        "html": "<p>Siftwell includes reduced-motion styles that remove animated transitions and smooth scrolling when a device requests them. Keep added content and apps comfortable to use under the same preference.</p>"
      },
      {
        "title": "Preview after changing the design",
        "html": "<p>Review the store on a phone, at larger text sizes and with assistive technology where available. Changes to images, colors, content or apps can affect how the store is used. Send any issue with a built-in theme feature to support.</p><p><a href=\"?page=performance-accessibility\">See the theme’s recorded results and coverage →</a></p>"
      }
    ]
  },
  {
    "id": "faq",
    "group": "Care for your store",
    "title": "Common questions",
    "lead": "A few answers before you change a setting or contact support.",
    "sections": [
      {
        "title": "Who is Siftwell for?",
        "html": "<p>Siftwell starts with auto accessories and tools, especially catalogs where fit, materials and intended use help customers choose. Its collection routes, quick view and optional comparison give those details a useful place.</p>"
      },
      {
        "title": "Can I adapt the open-source theme?",
        "html": "<p>Yes. Use the theme editor for content and styling, or have a developer adapt the MIT-licensed source while keeping the license notice. The repository includes architecture rules and design intent for developers working with coding agents.</p>"
      },
      {
        "title": "Does installing Siftwell enable AI shopping channels?",
        "html": "<p>Shopify provides agent commerce channels and transaction services. Eligibility and availability depend on the store and the service. Siftwell presents product information and purchase controls; its installation does not activate an AI sales channel.</p>"
      },
      {
        "title": "Are the demo products and photographs included?",
        "html": "<p>No. The preset supplies the layout and settings. Add your own products, collections, photography and page content in Shopify.</p>"
      },
      {
        "title": "Does the finder check vehicle fit?",
        "html": "<p>No. It opens the collections you choose. Enter accurate fit information on each product, and use filters for the product details customers need.</p>"
      },
      {
        "title": "Can I turn comparison off?",
        "html": "<p>Yes. Turn off <strong>Theme settings → Shopping tools → Show Compare checkboxes</strong>. Comparison controls then disappear from the shopping experience.</p>"
      },
      {
        "title": "Why are specifications missing?",
        "html": "<p>Check the namespace and keys in <strong>Theme settings → Product specifications</strong>, the product-template block and the selected variant. For row lists, confirm the metaobject field keys code, label and value, storefront access, entry status and list type. An empty variant row value deliberately suppresses a shared row. <a href=\"?page=specifications\">Follow the full setup and worked example →</a></p>"
      },
      {
        "title": "Can the first page be shorter?",
        "html": "<p>Yes. Remove sections that do not help customers understand the store or choose a product. Keep a clear route from the introduction to the catalog.</p>"
      },
      {
        "title": "Where do I change shipping or payment options?",
        "html": "<p>In Shopify’s store settings. Siftwell presents the store’s purchase information; payment providers, shipping rates, tax settings and pickup locations are configured separately.</p>"
      },
      {
        "title": "Where can I get help?",
        "html": "<p>Read <a href=\"?page=troubleshooting\">Troubleshooting</a> for common setup issues, or <a href=\"?page=support\">contact support</a> with the affected page and a short description.</p>"
      }
    ]
  },
  {
    "id": "troubleshooting",
    "group": "Care for your store",
    "title": "Troubleshooting",
    "lead": "Start with the setting or piece of content behind the problem.",
    "sections": [
      {
        "title": "A finder choice does not appear",
        "html": "<p>Assign a real collection to each Collection choice block in Product finder. A label on its own does not create a destination.</p>"
      },
      {
        "title": "A price shortcut does not narrow the catalog",
        "html": "<p>Configure the Price filter in Shopify Search &amp; Discovery, then review Price shortcuts in Shopping workspace. Check the amounts in each currency you use.</p>"
      },
      {
        "title": "Specifications do not appear",
        "html": "<p>Confirm that the product has values and that its metafield names match the mapping in Product specifications. Include the Product specifications block on the full product template.</p><div class=\"article-links\"><a href=\"?page=specifications\">Follow the specification setup →</a></div>"
      },
      {
        "title": "The store shows placeholder images",
        "html": "<p>Add media to the products and select images in the relevant sections. Demo media does not transfer with the theme. Check that your selected collections contain the products you want to show.</p>"
      },
      {
        "title": "The preview asks for a password",
        "html": "<p>A password-protected storefront needs its storefront password. Check your Online Store access settings in Shopify, or ask the store owner for access.</p>"
      },
      {
        "title": "A problem remains",
        "html": "<p>Share the affected feature, theme version, browser/device and steps that lead to the problem. Use a minimal example and crop screenshots. Leave out customer information, passwords and private store links.</p><div class=\"article-links\"><a href=\"?page=support\">Get help →</a></div>"
      }
    ]
  },
  {
    "id": "release-status",
    "group": "Care for your store",
    "title": "What’s new",
    "lead": "Siftwell 0.8.0-beta.1 is being prepared as the first MIT-licensed public beta.",
    "sections": [
      {
        "title": "The first open-source edition",
        "html": "<p>The Auto layout, collection finder, optional comparison and shared product specifications form the starting point. The project source and this guide use the MIT license.</p>"
      },
      {
        "title": "Mobile shopping and clearer recommendations",
        "html": "<p>The current source adds a compact mobile shopping introduction and compact collection links. Recommendation cards hide comparison by default; curated related alternatives can opt in separately. Complementary cards keep it hidden. These changes follow the immediate task: find an item, evaluate an alternative or add a useful extra.</p><p><a href=\"?page=roadmap\">Read the roadmap for auto-parts buying decisions and assisted shopping →</a></p>"
      },
      {
        "title": "Specifications that follow the selected variant",
        "html": "<p>Editable specification-row lists let an electrical accessory show voltage and connectors while a socket set shows drive size and included sizes. Selected variants can override, append or suppress shared facts. Existing five-field mappings remain supported.</p><p>Product pages and quick view show the selected variant’s facts. Catalog comparison uses shared facts; quick-view comparison retains the exact variant name and link. These fields describe supplied data and do not verify fit. <a href=\"?page=specifications\">Follow the setup and 12 V/24 V example →</a></p>"
      },
      {
        "title": "A beta, with room to improve",
        "html": "<p>A theme ZIP is available to download. No beta release is tagged yet. Fresh-install and essential shopping-path checks remain before the beta release. Advanced subscriptions, B2B setups and every browser/device combination have not been verified.</p><p>Use a development store to evaluate your catalog and apps before relying on the theme for a live shop.</p><p><a href=\"?page=performance-accessibility\">Review the recorded demo results and checks still to complete →</a></p>"
      },
      {
        "title": "Before you update",
        "html": "<p>Keep a copy of your existing theme. Review the new version with your own products, content and apps before publishing. Follow the release notes and report reproducible problems through the project’s GitHub issues.</p>"
      },
      {
        "title": "Box contents and extras for the selected version",
        "html": "<p>The current source separates In the box, Required separately and Optional extras on product pages and in quick view. One reusable parts set stores simple item text and optional native product links. A differing variant replaces every list and link. Unconfigured products, empty sets and empty groups stay hidden without extra spacing.</p><p>These are merchant-supplied details, not verified matching or bundles. A spreadsheet and CSV import workflow is the next focused follow-up and remains planned. <a href=\"?page=parts\">Set up included parts and extras →</a></p>"
      },
      {
        "title": "Compatibility requirements for the selected version",
        "html": "<p>Add saved sets of compatibility details to products and variants using native Compatibility profiles. Product pages and quick view show the selected version’s requirements, exclusions, application notes and reference. A variant replaces the complete shared profile. An assigned profile with no requirements, exclusions or notes, or an inaccessible profile, shows Compatibility not confirmed. Empty requirements alone still allow supplied exclusions or notes to appear. Unconfigured products stay hidden by default, with an opt-in missing-information state.</p><p>This feature displays merchant information and does not verify vehicle fit. <a href=\"?page=compatibility#try-the-live-preview\">Follow the setup guide and live 12 V/24 V walkthrough →</a></p>"
      },
      {
        "title": "An optional spreadsheet setup prototype",
        "html": "<p>A Google Sheets-compatible <a href=\"downloads/Siftwell-catalog-template.xlsx\">blank template (.xlsx)</a> and <a href=\"downloads/Siftwell-inflator-worked-example.xlsx\">fictional inflator example (.xlsx)</a> support the existing specification, compatibility and parts facts. The initial inflator-demo test is complete. Saving a workbook does not update Shopify.</p><p>Imports use the developer-assisted companion with native definitions and authenticated Shopify CLI setup. A merchant app and live Sheets sync are not included; real supplier mappings and merchant setup effort remain unverified. <a href=\"?page=catalog-data\">Read the workflow and limits →</a></p>"
      },
      {
        "title": "Sidekick-assisted product data setup",
        "html": "<p>Start with supplied facts for one family, use Sidekick to prepare and fill native entries for review, then select their product and variant references in Shopify. Copyable prompts cover specifications, compatibility and parts, with reusable preparation instructions for a Sidekick skill.</p><p>This recipe uses Shopify’s documented assistance; it has not been verified end to end with Siftwell in Sidekick. Reference selection stays explicit, and the XLSX workflow remains optional. <a href=\"?page=sidekick\">Follow the Sidekick setup guide →</a></p>"
      }
    ]
  },
  {
    "id": "support",
    "group": "Care for your store",
    "title": "Get help and contribute",
    "lead": "Share a clear question or reproducible problem with the Siftwell community.",
    "sections": [
      {
        "title": "Ask in the project",
        "html": "<p>Use <a href=\"https://github.com/lixonic/Siftwell-Shopify-theme/issues\">GitHub issues</a> for setup questions, feature ideas and reproducible problems. Include the theme version, affected feature, browser/device and steps to reproduce. Say what you expected and what happened.</p><p>This is a community-supported project. Replies and fixes are best effort, with no guaranteed response time.</p>"
      },
      {
        "title": "Keep private details private",
        "html": "<p>Issues are public. Leave out passwords, access tokens, customer information, payment details and private preview links. Crop screenshots to the relevant interface.</p><p>For a suspected security vulnerability, email <a href=\"mailto:lixonic@gmail.com\">lixonic@gmail.com</a> privately instead of opening a public issue.</p>"
      },
      {
        "title": "Understand the boundary",
        "html": "<p>Siftwell controls the storefront presentation. Shopify and app providers handle their own accounts, checkout, services and app behavior. Custom design work is separate from community issue support.</p>"
      }
    ]
  }
];
