import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const source=fs.readFileSync(new URL('../app/activate/ActivationClient.tsx',import.meta.url),'utf8');
const exports={};
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
vm.runInNewContext(compiled,{exports,URL,require:id=>({react:{useState:x=>[x,()=>{}],useRef:x=>({current:x}),useEffect:()=>{}},'../preferences':{useSitePreferences:()=>({locale:'ko'})},'next/link':{default:'a'},'../components/SiteHeader':{default:'header'},'../components/SiteFooter':{default:'footer'},'./activation.css':{}}[id]??require(id))});
const flatten=n=>!n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(flatten):[n,...flatten(n.props?.children)];
test('activation defaults to closed without a verified server catalog',()=>{
 const nodes=flatten(exports.default());
 assert.equal(nodes.filter(n=>n.type==='form').length,0);
 assert.equal(nodes.filter(n=>n.type==='button').length,0);
 assert.ok(nodes.some(n=>n.type==='h2'&&n.props.children==='결제 연결 준비 중'));
});
test('PayPal navigation requires exact environment, path and single order token',()=>{
 const safe=exports.safeApprovalUrl;
 assert.equal(safe('https://www.sandbox.paypal.com/checkoutnow?token=ORDER123','sandbox'),'https://www.sandbox.paypal.com/checkoutnow?token=ORDER123');
 for(const value of ['javascript:alert(1)','https://www.paypal.com.evil.test/checkoutnow?token=ORDER123','http://www.paypal.com/checkoutnow?token=ORDER123','https://user@www.paypal.com/checkoutnow?token=ORDER123','https://www.paypal.com:444/checkoutnow?token=ORDER123','https://www.paypal.com/donate?token=ORDER123','https://www.paypal.com/checkoutnow?token=ORDER123&token=OTHER','https://www.paypal.com/checkoutnow?token=ORDER123#x','https://www.paypal.com/checkoutnow?token=ORDER123&redirect_uri=https://evil.test'])assert.equal(safe(value,'live'),null,value);
 assert.equal(safe('https://www.paypal.com/checkoutnow?token=ORDER123','sandbox'),null);
 assert.equal(safe('https://www.sandbox.paypal.com/checkoutnow?token=ORDER123','live'),null);
});
test('no return-url, client storage, or client supplied amount grants a license',()=>{
 assert.doesNotMatch(source,/localStorage|sessionStorage|location\.search|document\.cookie|client_secret/);
 assert.match(source,/post\('checkout',\{term,installation_id:installation\}\)/);
 assert.match(source,/X-CSRF-Token/);
 assert.match(source,/running\.current/);
 assert.match(source,/payment\.status!=='paid'/);
 assert.match(source,/post\('license'\)/);
});
test('public checkout remains unset and new route is excluded from search indexing',()=>{
 const pricing=fs.readFileSync(new URL('../app/pro-pricing.ts',import.meta.url),'utf8');
 assert.match(pricing,/monthly: null, "half-year": null, yearly: null/);
 assert.match(fs.readFileSync(new URL('../app/activate/page.tsx',import.meta.url),'utf8'),/index: false, follow: false/);
});
