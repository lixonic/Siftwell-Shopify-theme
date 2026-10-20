"""Check theme structure and clean distribution boundaries without a store connection."""
from pathlib import Path
import json
import re
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
theme_dirs = ('assets', 'config', 'layout', 'listings', 'locales', 'sections', 'snippets', 'templates')
errors = []
required = ('404', 'article', 'blog', 'cart', 'collection', 'index', 'list-collections',
            'page', 'page.contact', 'password', 'product', 'search')

for directory in theme_dirs:
    for path in (root / directory).rglob('*.json'):
        try:
            obj = json.loads(path.read_text())
        except (ValueError, OSError) as exc:
            errors.append(f'{path.relative_to(root)}: {exc}')
            continue
        if directory in ('templates', 'listings') or path.parent.name == 'sections':
            for section in obj.get('sections', {}).values():
                section_type = section.get('type', '')
                if section_type != '@app' and not (root / 'sections' / f'{section_type}.liquid').exists():
                    errors.append(f'{path.relative_to(root)}: missing section {section_type}')
for name in required:
    if not (root / 'templates' / f'{name}.json').exists():
        errors.append(f'Missing template {name}')
if not (root / 'listings/siftwell/templates/index.json').exists():
    errors.append('Missing Siftwell homepage overlay')
presets = json.loads((root / 'config/settings_data.json').read_text()).get('presets', {})
if list(presets) != ['Siftwell']:
    errors.append('Keep the single Siftwell Auto preset')
if sorted(p.name for p in (root / 'listings').iterdir() if p.is_dir()) != ['siftwell']:
    errors.append('Keep only the Auto listing')
if (root / 'config/markets.json').exists():
    errors.append('Store-specific config/markets.json must not be distributed')
for path in (root / 'assets').iterdir():
    if path.suffix in ('.woff', '.woff2', '.ttf', '.otf'):
        errors.append(f'{path.name}: use Shopify font settings instead of font binaries')
    if path.suffix == '.js' and 'localStorage' in path.read_text():
        errors.append(f'{path.name}: do not replace native commerce with local persistence')
if (root / 'LICENSE').read_bytes() != (root / 'assets/siftwell-license.txt').read_bytes():
    errors.append('The packaged MIT notice must match LICENSE')

# The downloadable package must stay installable and match the source it accompanies.
download = root / 'docs/downloads/Siftwell-0.8.0-beta.1.zip'
try:
    with zipfile.ZipFile(download) as archive:
        members = [item.filename for item in archive.infolist() if not item.is_dir()]
        expected = {str(path.relative_to(root)) for directory in theme_dirs
                    for path in (root / directory).rglob('*') if path.is_file()}
        if len(members) != len(set(members)) or set(members) != expected:
            errors.append('Download ZIP file list differs from theme source; run npm run package:download')
        else:
            for name in members:
                if archive.read(name) != (root / name).read_bytes():
                    errors.append(f'Download ZIP has stale content: {name}; run npm run package:download')
except (OSError, zipfile.BadZipFile) as exc:
    errors.append(f'Download ZIP is missing or invalid: {exc}')

# Check authored guide links and its static support boundary, not dependencies.
guide = (root / 'docs/content.js').read_text()
pages = json.loads(guide.removeprefix('window.SIFTWELL_DOCS = ').strip().removesuffix(';'))
ids = [page['id'] for page in pages]
if len(ids) != len(set(ids)):
    errors.append('Duplicate guide article IDs')
for target in re.findall(r'\?page=([a-z-]+)', guide + (root / 'docs/index.html').read_text()):
    if target not in ids:
        errors.append(f'Guide links to missing article {target}')
if '/api/support' in guide + (root / 'docs/app.js').read_text() or (root / 'docs/api').exists():
    errors.append('The static guide must not imply a support delivery backend')
for path in [*root.glob('*.md'), *(root / 'docs').glob('*.md')]:
    for target in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if '://' not in target and not target.startswith(('#', 'mailto:')):
            if not (path.parent / target.split('#')[0]).exists():
                errors.append(f'{path.relative_to(root)}: missing linked file {target}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('Validated theme JSON, template references, Auto defaults, license notice, download ZIP and guide links.')
