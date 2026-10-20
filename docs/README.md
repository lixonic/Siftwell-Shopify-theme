# Siftwell store guide

Begin with [the design approach](design-philosophy.md), then [set up your store](getting-started.md) and [product specifications](product-specifications.md).

The searchable 17-article guide covers navigation, the home page, the finder, products, collections, the bag, localization, accessibility and common setup questions. It is a static site with no support delivery backend.

From the repository root, run:

```sh
python3 -m http.server 8774 --bind 127.0.0.1 --directory docs
```

Open `http://127.0.0.1:8774`. Read [known limitations](known-limitations.md) for the current pre-release boundary and [SUPPORT](../SUPPORT.md) to ask a question.
