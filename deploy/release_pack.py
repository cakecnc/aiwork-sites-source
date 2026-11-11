"""Create reviewed release data locally. Never builds, pushes, or deploys."""
import argparse
import json
from pathlib import Path
import re
import zipfile
from artifact_inventory import encode, inventory, safe_path, sha256


def unique_json(raw):
    def unique(items):
        result = {}
        for k, v in items:
            if k in result:
                raise ValueError('duplicate JSON key')
            result[k] = v
        return result
    return json.loads(raw, object_pairs_hook=unique)


def build_release(export, frozen_inventory, reviewed_sha, previous_manifest, site, sequence):
    if site not in ('aiwork', 'cake') or type(sequence) is not int or sequence < 1:
        raise ValueError('site/sequence invalid')
    if not re.fullmatch(r'[0-9a-f]{64}', reviewed_sha) or sha256(frozen_inventory) != reviewed_sha:
        raise ValueError('exact reviewed inventory hash required')
    frozen = unique_json(frozen_inventory)
    if not isinstance(frozen, dict) or set(frozen) != {'schema','source_commit','files','excluded'} or type(frozen['schema']) is not int or frozen['schema'] != 1:
        raise ValueError('inventory schema invalid')
    actual = inventory(export, frozen['source_commit'])
    if actual != frozen:
        raise ValueError('artifact is not the exact reviewed bytes')
    previous = unique_json(previous_manifest)
    if (not isinstance(previous, dict) or set(previous) != {'schema','site','sequence','source_commit','files'}
        or type(previous['schema']) is not int or previous['schema'] != 1 or previous['site'] != site
        or not re.fullmatch(r'[0-9a-f]{40}', str(previous['source_commit']))
        or type(previous['sequence']) is not int or previous['sequence'] < 0
        or sequence != previous['sequence'] + 1
        or not isinstance(previous['files'], list)):
        raise ValueError('previous manifest/sequence invalid')
    before = {}
    for entry in previous['files']:
        if not isinstance(entry, dict) or set(entry) != {'path','sha256','bytes','before_sha256'}:
            raise ValueError('previous file fields invalid')
        path = safe_path(entry['path'])
        if path in before or not re.fullmatch(r'[0-9a-f]{64}', str(entry['sha256'])):
            raise ValueError('previous file hash/path invalid')
        if type(entry['bytes']) is not int or entry['bytes'] < 1:
            raise ValueError('previous size invalid')
        before[path] = entry['sha256']
    result = dict(schema=1, site=site, sequence=sequence, source_commit=frozen['source_commit'], files=[])
    for entry in frozen['files']:
        # Never turn a content-addressed asset into a mutable replacement.
        old = before.get(entry['path'])
        if entry['path'].startswith('_next/static/') and old is not None and old != entry['sha256']:
            raise ValueError('immutable asset content changed at an existing path')
        result['files'].append(dict(entry, before_sha256=old))
    return result


def main():
    p = argparse.ArgumentParser(description='Package the exact reviewed artifact, never rebuild it.')
    p.add_argument('--export', required=True)
    p.add_argument('--inventory', required=True)
    p.add_argument('--reviewed-inventory-sha256', required=True)
    p.add_argument('--previous-manifest', required=True)
    p.add_argument('--site', required=True, choices=['aiwork','cake'])
    p.add_argument('--sequence', type=int, required=True)
    p.add_argument('--output', required=True)
    args = p.parse_args()
    export = Path(args.export)
    raw = Path(args.inventory).read_bytes()
    result = build_release(export, raw, args.reviewed_inventory_sha256,
                           Path(args.previous_manifest).read_bytes(), args.site, args.sequence)
    output = Path(args.output)
    if output.exists() or export.resolve() in output.resolve().parents:
        p.error('output must be a new directory outside the export')
    output.mkdir(parents=True)
    # One bounded archive, never a server extractall or remotely executed code.
    with zipfile.ZipFile(output / 'payload.zip', 'x', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for entry in result['files']:
            source = export / entry['path']
            if source.is_symlink():
                raise ValueError('artifact path became a symlink')
            data = source.read_bytes()
            if len(data) != entry['bytes'] or sha256(data) != entry['sha256']:
                raise ValueError('artifact changed during packaging; incomplete folder must not be published')
            info = zipfile.ZipInfo(entry['path'], date_time=(2026, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, data)
    manifest = encode(result)
    with (output / 'manifest.json').open('xb') as stream:
        stream.write(manifest)
    print(json.dumps({'status': 'PACKAGED_NOT_PUBLISHED', 'site': args.site,
                      'sequence': args.sequence, 'files': len(result['files']),
                      'manifest_sha256': sha256(manifest)}))

if __name__ == '__main__':
    main()
