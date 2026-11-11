"""Freeze only static public export files. Python 3.9+, no network or shell."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat

EXTENSIONS = {'.html', '.txt', '.js', '.css', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.woff', '.woff2', '.webmanifest', '.xml'}
BLOCKED_PARTS = {'api', 'private-config', 'node_modules', 'uploads', 'backups', 'source'}
MAX_FILE = 25 * 1024 * 1024
MAX_TOTAL = 100 * 1024 * 1024


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def safe_path(value):
    if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9_./-]+', value):
        raise ValueError('invalid public path')
    parts = value.split('/')
    if any(not p or p.startswith('.') or p.lower() in BLOCKED_PARTS for p in parts):
        raise ValueError('forbidden public path')
    if Path(value).suffix.lower() not in EXTENSIONS:
        raise ValueError('non-static file')
    return value


def inventory(root, source_commit):
    root = Path(root)
    if not re.fullmatch(r'[0-9a-f]{40}', source_commit):
        raise ValueError('source_commit must be a complete immutable Git SHA')
    if not root.is_dir() or any(p.is_symlink() for p in (root,) + tuple(root.parents)):
        raise ValueError('export root must be a real directory, without symlinks')
    files, excluded, total = [], [], 0
    for item in sorted(root.rglob('*')):
        if item.is_symlink():
            raise ValueError('symlink in export')
        if item.is_dir():
            if item.name.startswith('.'):
                raise ValueError('hidden directory in export')
            continue
        path = item.relative_to(root).as_posix()
        if path == '_headers':
            # Cloudflare control file is not an Apache static deployment file.
            excluded.append(path)
            continue
        safe_path(path)
        st = item.lstat()
        if not stat.S_ISREG(st.st_mode) or not 0 < st.st_size <= MAX_FILE:
            raise ValueError('file size or type rejected')
        data = item.read_bytes()
        if len(data) != st.st_size:
            raise ValueError('export changed during inventory')
        total += len(data)
        if total > MAX_TOTAL:
            raise ValueError('export exceeds total size bound')
        files.append({'path': path, 'bytes': len(data), 'sha256': sha256(data)})
    if not 1 <= len(files) <= 1000:
        raise ValueError('invalid file count')
    return {'schema': 1, 'source_commit': source_commit, 'files': files, 'excluded': excluded}


def encode(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--export', required=True)
    p.add_argument('--source-commit', required=True)
    p.add_argument('--output', required=True)
    args = p.parse_args()
    data = encode(inventory(args.export, args.source_commit))
    # Never overwrite an existing inventory or write into the served export.
    output = Path(args.output)
    export = Path(args.export).resolve()
    if export == output.resolve() or export in output.resolve().parents:
        p.error('inventory output must be outside the export')
    with output.open('xb') as stream:
        stream.write(data)
    print(json.dumps({'inventory_sha256': sha256(data), 'files': len(json.loads(data)['files']), 'output': str(output)}))

if __name__ == '__main__':
    main()
