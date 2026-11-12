"""Check source package only; never reads a deployed config or credential store."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
allowed={'.php','.md','.py','.json'}
fail=[]
for path in root.rglob('*'):
    if path.is_dir():
        if path.name not in {'src','http','public','bin','tests'}:
            fail.append(f'Unexpected directory: {path.relative_to(root)}')
        continue
    if path.is_symlink() or path.suffix not in allowed or path.name in {'config.php','credentials.json','token.json'}:
        fail.append(f'Forbidden runtime file: {path.relative_to(root)}'); continue
    text=path.read_text(encoding='utf-8')
    if re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',text):fail.append('Private key material detected')
    if re.search(r'gh[pousr]_[A-Za-z0-9]{30,}',text):fail.append('GitHub token detected')
    if re.search(r'(?i)client_secret\s*[\"\']?\s*(?:=>|:)\s*[\"\'][A-Za-z0-9_-]{30,}',text):fail.append('Credential literal detected')
if fail:raise SystemExit('\n'.join(fail))
print('Payment source package check passed: no runtime config, database, session or key files.')
