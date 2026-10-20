# Source provenance

Siftwell's layout and shopping interactions were developed from the project's original Auto storefront design. Earlier private development checkpoints used Shopify's Skeleton theme as a foundation and retained its SEO snippet.

This repository starts with a clean export for the MIT release. It does not relicense the old Skeleton code or remove notices from code that remains copied:

- The retained SEO snippet has been removed and replaced with a new metadata implementation using Shopify's documented Liquid objects and filters.
- Font-face registration has been rewritten while preserving the theme's font settings and design tokens.
- Four media control/badge SVGs without a sufficient provenance record have been replaced by newly drawn geometric icons.
- No Skeleton example CSS, sections, blocks, images or icons are included in this export. The original Siftwell design and shopping code are retained.

The audit compared all distributed theme text files with Skeleton revision `a4f32d393b9eadf6c4403318ca39116832e5d1df`, including an exact-file and whitespace-normalized overlap review. The resulting tree had no identical run of 100 normalized characters against that reference. Common Liquid APIs, HTML structure and Shopify-required file formats remain. A mechanical comparison is supporting evidence, not an exhaustive legal guarantee.

The review covers the project sources and recorded provenance; contributors remain responsible for the rights to code and assets they contribute. Do not copy code from another Shopify theme or remove a third-party notice to make a contribution appear original.

The MIT license applies to project-owned code and documentation in this repository. External services and merchant-supplied assets are described in [NOTICES.md](NOTICES.md).
