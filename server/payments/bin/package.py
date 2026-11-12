"""Create separate review-only public/private ZIPs. Never deploy or access credentials."""
import argparse, hashlib, json, subprocess, zipfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[1];repo=root.parents[1]
subprocess.run(['python3',str(root/'bin/check_package.py')],check=True)
if subprocess.check_output(['git','status','--porcelain'],cwd=repo,text=True).strip():raise SystemExit('Commit reviewed source before packaging; dirty tree rejected.')
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
out=Path(a.output).resolve()
if out==repo or repo in out.parents:raise SystemExit('Output must be outside source checkout.')
out.mkdir(parents=True,exist_ok=False)
tracked=subprocess.check_output(['git','ls-files','-z','--','server/payments'],cwd=repo).decode().split('\0')
source_files=[repo/name for name in tracked if name]
manifest={'source_commit':sha,'sales_enabled':False,'deployment_performed':False,'files':[]}
for label in ['public','private']:
    target=out/f'payments-{label}-review.zip'
    with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED) as z:
        for file in sorted(source_files):
            if not file.is_file():continue
            rel=file.relative_to(root)
            if (rel.parts[0]=='public')!=(label=='public'):continue
            name=str(rel.relative_to('public')) if label=='public' else str(rel)
            data=file.read_bytes();info=zipfile.ZipInfo(name,(2026,1,1,0,0,0));info.external_attr=0o100600<<16;info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,data);manifest['files'].append({'archive':target.name,'path':name,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
manifest['archives']=[{'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}for f in sorted(out.glob('*.zip'))]
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'source_commit':sha,'archives':manifest['archives'],'deployed':False}))
