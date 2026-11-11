import test from 'node:test';
import assert from 'node:assert/strict';
import {messages} from '../app/i18n.ts';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('all eight Pro offer translations retain existing prices and distinguish signed activation from public release',()=>{
 assert.equal(Object.keys(messages).length,8);
 for(const [locale,c] of Object.entries(messages)){
  assert.deepEqual(c.payments.products.map(p=>p.price),['USD 19','USD 49','USD 29'],locale);
  assert.match(c.payments.products[0].features.join(' '),/Hashcat/);assert.match(c.payments.products[0].features.join(' '),/Studio/);
  assert.doesNotMatch(c.payments.products[0].features.join(' '),/Chrome|Google Drive/);
  assert.match(c.payments.disclaimer,/Hashcat/);assert.match(c.payments.disclaimer,/Studio/);
 }
});
test('shared translations differ only by the reviewed offer and release blocks',()=>{
 let baseline=read('qa/product-i18n-v14.txt');const changes=JSON.parse(read('qa/product-i18n-edits.json'));assert.equal(changes.length,8);
 for(const {old:before,new:after} of changes){assert.ok(baseline.includes(before));baseline=baseline.replace(before,after);}
 assert.equal(read('app/i18n.ts'),baseline);
});
