# Working on Siftwell

Siftwell is an MIT-licensed Shopify theme preparing its first public beta. Preserve the Auto design: steady sidebar, open product areas, restrained typography, purposeful accent color, brief motion and optional comparison.

- Use native Shopify objects, locale-aware routes and forms. Do not add fake inventory, local-storage carts, hardcoded store data or a frontend runtime framework.
- Keep product content editable through sections/blocks and preserve app/Custom Liquid insertion points.
- Keep fixed shopper text in locale files and escape plain merchant/customer text.
- Use Shopify font pickers, responsive images, focal points and deferred below-the-fold media. Do not bundle demo media or font binaries.
- Preserve keyboard behavior, focus return, Escape, useful no-JavaScript forms and reduced-motion styles.
- Never copy restricted theme source into this repository. New dependencies/assets need a documented compatible license and purpose. See PROVENANCE.md and NOTICES.md.
- Commit only clean defaults. Do not commit live settings, store exports, tokens, passwords, customer data, preview-auth links, backups or private QA records.
- Merchant documentation should explain the design choice, exact setting and useful next step. Keep development chronology and internal audit logs outside the public guide.
- Run `npm test`, `python3 scripts/validate.py` and `shopify theme check --path .` for relevant changes. Static checks are not live storefront proof.
- Use `shopify theme package --path .` for the installable ZIP. Preserve `assets/siftwell-license.txt`, which mirrors LICENSE. Documentation, tools and dependencies stay outside the ZIP.
- Do not claim a stable release, complete commerce coverage, universal device compatibility or Shopify approval. The first beta still needs the fresh-install and essential shopping-path gate.
- Do not publish to a merchant store or send messages/orders/payments without authorization for that destination and action.
