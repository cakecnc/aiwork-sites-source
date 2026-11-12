import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productAddedFiles} from './product-copy-contract.mjs';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const hashes={
 'public/images/product/aiwork-browser-netghost-20261111.jpg':'91ee719bf82948a4eec5e9c7b1945d6329a610c2a8cf838834f7a87c1bfd6ce2',
 'public/images/product/aiwork-browser-pro-studio-20261111.jpg':'175ff4dab73eee1634549ead5a1b55d1901f7c047493dd629e513558e2ce9240',
};
test('published captures retain the exact visually reviewed real-app bytes',()=>{
 for(const [p,h] of Object.entries(hashes)){const b=fs.readFileSync(new URL(p,root));assert.equal(createHash('sha256').update(b).digest('hex'),h);assert.equal(b.subarray(0,3).toString('hex'),'ffd8ff');assert.ok(productAddedFiles.includes(p));}
});
test('real captures and mockup are separately labeled, without pretending Pro has been activated',()=>{
 const s=read('app/components/ProductEvidence.tsx');assert.match(s,/Actual screens from the current build/);assert.match(s,/No AI model is connected/);assert.match(s,/while the app is on Free/);assert.match(s,/not generated product mockups/);assert.match(s,/width=\{3000\} height=\{1880\}/);
 assert.match(read('app/page.tsx'),/<ActualScreenshots \/>/);assert.match(read('app/components/DetailPage.tsx'),/<ActualScreenshots \/>/);
});
test('the authorized Pro benefit is distinct from automatic activation and provider billing',()=>{
 const s=read('app/components/ProductEvidence.tsx');assert.match(s,/Hashcat and Studio at no additional charge/);assert.match(s,/automatic cross-product entitlement linking is complete/);assert.match(s,/provider charges and account conditions are separate/);
 for(const p of ['app/page.tsx','app/components/DetailPage.tsx','app/hashcat/page.tsx'])assert.match(read(p),/ProAccessNotice/);
});
test('fuller explanations cover the actual limits for every product-guide topic',()=>{
 const s=read('app/components/ProductEvidence.tsx');for(const topic of ['product','features','download','security','guide','start','browser','documents','research','email'])assert.ok(s.includes(topic));
 for(const claim of ['128 KB','UTF-8','passkeys','signed license file','Apple notarization','permanent deletion','webmail'])assert.ok(s.includes(claim),claim);
});
total 14720
-rw-r--r--  1 sj  staff    62193 Nov 12 07:22 manifest.json
-rw-r--r--  1 sj  staff  7468948 Nov 12 07:22 payload.zip
total 14720
-rw-r--r--  1 sj  staff    62193 Nov 12 07:22 manifest.json
-rw-r--r--  1 sj  staff  7468948 Nov 12 07:22 payload.zip
1:"""Fixed-repository static pull runner. Disabled unless locally enabled. Python 3.9+.
282:        keys(config, ('schema', 'site', 'root', 'private', 'enabled', 'allowlist', 'immutable_additions', 'health'))
283:        if type(config['schema']) is not int or config['schema'] != 1 or config['site'] not in REPOS or type(config['enabled']) is not bool:
333:        raw = self.transport.get('https://api.github.com/repos/' + repo + '/git/ref/heads/bluehost-release', MAX_MANIFEST, deadline, {'api.github.com'})
392:        if apply and self.config['enabled'] is not True:
488:def main():
490:    parser.add_argument('--config', required=True)
491:    parser.add_argument('--apply', action='store_true', help='requires enabled=true in trusted local config')
