"""Copy Shopify CLI's package to the public theme download; validate it next."""
from pathlib import Path
import json
import shutil

root = Path(__file__).resolve().parents[1]
metadata = next(item for item in json.loads((root / 'config/settings_schema.json').read_text())
                if item.get('name') == 'theme_info')
package = root / f"{metadata['theme_name']}-{metadata['theme_version']}.zip"
destination = root / 'docs/downloads/Siftwell-0.8.0-beta.1.zip'
if not package.is_file():
    raise SystemExit('Run shopify theme package --path . before copying the download.')
destination.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(package, destination)
print(f'Updated {destination.relative_to(root)}; checking its source match next.')
