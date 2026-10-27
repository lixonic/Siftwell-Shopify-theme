# Siftwell store guide

Siftwell is an open-source Shopify theme for auto accessories and tools, built around finding a useful product and understanding the differences between options.

Start with [Siftwell’s approach](design-philosophy.md), then build [one complete shopping path](getting-started.md). The guide connects the design choices to practical setup: recognizable collections, consistent specifications, useful comparisons and a clear route to the bag.

- [Start with Siftwell](design-philosophy.md): who it serves, what it helps customers do and how to make the source your own.
- [Build your first shopping path](getting-started.md): connect a buying need to a collection, product and bag.
- [Explain compatibility requirements](product-compatibility.md): show selected-variant requirements, exclusions, references and unknown states without implying verified vehicle matching.
- [Show included parts and extras](product-parts.md): separate box contents, required items and optional additions with reusable sets and optional product links.
- [Set up shared specifications](product-specifications.md): create editable row lists, configure variant overrides and keep exact-item facts consistent across product views.
- [Add customer reviews](product-reviews.md): connect app-supplied ratings and a full review widget to the product template.
- [Performance and accessibility](performance-accessibility.md): the design choices, recorded demo results and checks still to complete.
- [Read the current limitations](known-limitations.md) and [get community help](../SUPPORT.md).
- [Read the roadmap](../ROADMAP.md): buyer needs, compatibility, complete-job shopping and catalog accuracy for assisted commerce.

The searchable guide contains 22 articles covering branding, the home page, the finder, collections, product media, compatibility requirements, included parts and extras, customer reviews, localization, performance, accessibility and common setup questions. Shopping assistance and coding-agent customization are explained as separate uses.

## Preview the searchable guide

From the repository root, run:

```sh
python3 -m http.server 8774 --bind 127.0.0.1 --directory docs
```

Open `http://127.0.0.1:8774`. The guide is a static site; community questions go through the project’s GitHub issues.

## Deploy the guide to Vercel

In your Vercel project, connect this repository and set **Root Directory** to `docs`. Use **Other** for the framework, leave the build and install commands empty, and use `.` as the output directory. The included `vercel.json` sets the static build options. See [Vercel’s build settings](https://vercel.com/docs/builds/configure-a-build).

For a deployment from a standalone folder, use the folder containing this guide’s `index.html`, `content.js`, `app.js`, `styles.css`, `images/` and `vercel.json` as the project root. Keep those paths together. The article URLs use `?page=`, so no catch-all rewrite is needed.

This guide uses community GitHub issues and private security email links. It needs no environment variables or email-service backend.

After deployment, check the opening page, `?page=performance-accessibility`, documentation search, the theme ZIP link and the mobile menu. Use the deployed site’s public URL when linking to the guide.
