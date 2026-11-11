import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productAddedFiles} from './product-copy-contract.mjs';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const hashes={
 'public/images/product/aiwork-browser-netghost-20261111.jpg':'4752f628bf01362058f927e06012a7a8bf8468d3369624350e1266a03ea4e699',
 'public/images/product/aiwork-browser-pro-studio-20261111.jpg':'8b96a57dca089771f8ee90716b6dbe531a9a75f0bc9b6e3e35fd6572526ae9b0',
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
