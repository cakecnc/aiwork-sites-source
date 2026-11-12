import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {PRO_MONTHLY_USD, PRO_TERMS, PAYPAL_CHECKOUT_URLS, proPricingCopy} from '../app/pro-pricing.ts';
const require=createRequire(import.meta.url);
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const flatten=n=>!n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(flatten):[n,...flatten(n.props?.children)];
function render(locale='ko',page=false){
 let selected='monthly';
 const exports={};
 const js=ts.transpileModule(read('app/components/PricingPlans.tsx'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(js,{exports,require:id=>({react:{useState:()=>[selected,v=>{selected=v;}]},'../preferences':{useSitePreferences:()=>({locale})},'../pro-pricing':{PRO_MONTHLY_USD,PRO_TERMS,PAYPAL_CHECKOUT_URLS,proPricingCopy},'../site-config':{purchaseInquiryHref:id=>`/contact?product=${id}#purchase-inquiry`},'next/link':{default:'a'},'../pricing-plans.css':{}}[id]??require(id))});
 return ()=>flatten(exports.default({page}));
}
test('monthly, six-month and annual prices use exact approved arithmetic without a discount',()=>{
 assert.equal(PRO_MONTHLY_USD,18);
 assert.deepEqual(PRO_TERMS.map(p=>[p.months,p.totalUsd]),[[1,18],[6,108],[12,216]]);
 for(const p of PRO_TERMS)assert.equal(p.totalUsd,p.months*PRO_MONTHLY_USD);
});
test('unverified PayPal products stay closed and no query or local state grants Pro',()=>{
 assert.deepEqual(Object.values(PAYPAL_CHECKOUT_URLS),[null,null,null]);
 const source=read('app/components/PricingPlans.tsx');
 assert.doesNotMatch(source,/fetch\(|localStorage|sessionStorage|location\.search|license_key|client_secret|DONATION_URL/);
 for(const locale of ['ko','en','ja','zh-CN','ar','es','fr','de']){
  const nodes=render(locale)();
  assert.equal(nodes.filter(n=>n.type==='button'&&n.props.disabled).length,1);
  assert.ok(!nodes.some(n=>typeof n.props?.href==='string'&&n.props.href.includes('paypal.com')));
  assert.equal(nodes[0].props.lang,locale==='ko'?'ko':'en');
 }
});
test('repeated period selection updates the total and accessible checked state, without charging',()=>{
 const draw=render();
 for(const [id,total] of [['yearly',216],['half-year',108],['half-year',108],['monthly',18]]){
  let nodes=draw();nodes.find(n=>n.type==='input'&&n.props.value===id).props.onChange();nodes=draw();
  assert.deepEqual(nodes.filter(n=>n.type==='input'&&n.props.checked).map(n=>n.props.value),[id]);
  const panel=nodes.find(n=>n.props?.className==='pro-total');
  assert.equal(flatten(panel).find(n=>n.type==='bdi').props.children[1],total);
  assert.equal(panel.props['aria-live'],'polite');
 }
});
test('Free, Pro, no automatic activation, and existing separate products are clear',()=>{
 for(const locale of ['ko','en']){
  const c=proPricingCopy(locale).text;
  assert.match(c.freeFeatures.join(' '),/프로젝트 1개|1 project/);
  assert.doesNotMatch(c.proFeatures.join(' '),/무제한|unlimited/i);
  assert.match(c.proFeatures.join(' '),/Hashcat/);assert.match(c.proFeatures.join(' '),/Studio/);
  assert.match(c.activation,/아직 완료되지|not complete/);
  assert.match(c.availability,/준비 중|pending/);
  assert.match(c.business,/49/);assert.match(c.smartstore,/29/);
 }
});
test('homepage and pricing route share one price component while Matrix assets and glow remain unchanged',()=>{
 assert.match(read('app/page.tsx'),/<PricingPlans \/>/);
 assert.match(read('app/pricing/page.tsx'),/<PricingPageContent \/>/);
 assert.match(read('app/components/PricingPageContent.tsx'),/<PricingPlans page \/>/);
 assert.doesNotMatch(read('app/pricing-plans.css').replace('opacity: .65;', ''),/text-shadow|filter:|animation:|transform:|opacity:/);
 const prior=read('qa/pricing-home-before.tsx.txt');
 const expected=prior.replace('import AvailabilityNotice from "./components/AvailabilityNotice";','import AvailabilityNotice from "./components/AvailabilityNotice";\nimport PricingPlans from "./components/PricingPlans";').replace('  PURCHASE_PRODUCTS,\n','').replace('  purchaseInquiryHref,\n','').replace(/      <section className="payment-section" id="payments">[\s\S]*?(?=      <section className="cta-section home-cta")/,'      <PricingPlans />\n\n');
 assert.equal(read('app/page.tsx'),expected);
});

test('disabled PHP checkout catalog and pricing metadata match the approved displayed totals',()=>{
 const core=read('server/payments/src/Core.php');
 const gateway=read('server/payments/http/Gateway.php');
 for(const [id,months,amount] of [['monthly',1,'18.00'],['half_year',6,'108.00'],['yearly',12,'216.00']]){
  assert.ok(core.includes(`'${id}'=>['months'=>${months},'value'=>'${amount}','currency_code'=>'USD'`));
  assert.ok(gateway.includes(`['id'=>'${id}','months'=>${months},'amount'=>'${amount}','currency'=>'USD']`));
 }
 for(const file of ['app/pro-pricing.ts','app/pricing/page.tsx','server/payments/src/Core.php','server/payments/http/Gateway.php']){
  assert.doesNotMatch(read(file),/USD (?:19|114|228)\b|'(?:19|114|228)\.00'/);
 }
 for(const locale of ['ko','en']){
  const c=proPricingCopy(locale).text;
  assert.match(c.description,/USD 18/);assert.match(c.description,/USD 108/);assert.match(c.description,/USD 216/);
  assert.match(c.calculation,/USD 18/);
 }
});
