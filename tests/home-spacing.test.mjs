import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import {transform} from 'lightningcss';
const root=new URL('../',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,root),'utf8');
const before=JSON.parse(read('qa/home-spacing-before.json'));
const css=read('app/home-spacing.css');
test('spacing update preserves every content string, screenshot and link',()=>{
 const original = before['app/page.tsx'];
 const current = read('app/page.tsx').replace('\n\nimport "./home-spacing.css";','').replace('import PricingPlans from "./components/PricingPlans";\n','');
 const stripPrior = s => s.replace('  PURCHASE_PRODUCTS,\n','').replace('  purchaseInquiryHref,\n','').replace(/      <section className="payment-section" id="payments">[\s\S]*?(?=      <section className="cta-section home-cta")/, '      <PricingPlans />\n\n');
 assert.equal(current, stripPrior(original), 'Only the requested pricing block may change; all other content and spacing stay intact');
 const evidence=read('app/components/ProductEvidence.tsx');
 assert.equal(evidence.split('?v=matrix-20261112').length-1,2);
 assert.ok(evidence.includes('ACTUAL APP · MATRIX · 2026-11-12'));
 // Normalize only the independently reviewed Matrix capture URL and caption update.
 const previousEvidence=evidence.replaceAll('?v=matrix-20261112','').replace('ACTUAL APP · MATRIX · 2026-11-12','ACTUAL APP · 2026-11-11').replace('Matrix 테마가 활성화된 실제 AIWORK Browser 캡처입니다. 설명용 합성 이미지가 아닙니다.','설명용 합성 이미지가 아닌 실행 중인 AIWORK Browser 캡처입니다.').replace('These are captures of the running AIWORK Browser with the Matrix theme enabled, not generated product mockups.','These are captures of the running AIWORK Browser, not generated product mockups.');
 assert.equal(previousEvidence.replace('var(--product-evidence-padding, 64px 24px)','64px 24px'),before['app/components/ProductEvidence.tsx']);
});
test('existing cinematic, glow, header and global styles remain byte-identical',()=>{
 for(const f of ['app/globals.css','app/cinematic-theme.css','app/matrix-theme.css','app/header-flow.css'])assert.equal(read(f),before[f]);
});
test('new stylesheet is homepage-only and changes spacing without hiding content or resizing text',()=>{
 const allowed=new Set(['--product-evidence-padding','padding','padding-block','padding-bottom','padding-top','margin-top','margin-bottom','min-height','content-visibility','contain-intrinsic-size']);
 postcss.parse(css).walkRules(r=>assert.ok(r.selector.startsWith(':root body .aiwork-cinematic-content .home-shell'),r.selector));
 postcss.parse(css).walkDecls(d=>{assert.ok(allowed.has(d.prop),d.prop);assert.notEqual(d.value,'hidden');});
 assert.deepEqual(transform({filename:'home-spacing.css',code:Buffer.from(css),errorRecovery:false}).warnings,[]);
});
test('mobile gaps override desktop spacing and real captures do not reserve stale offscreen heights',()=>{
 assert.match(css,/@media \(max-width: 700px\)/);
 assert.match(css,/#actual-screenshots\s*\{\s*content-visibility: visible;\s*contain-intrinsic-size: none;/);
 assert.match(css,/\.home-digital-section\s*\{\s*padding-bottom: 24px;/);
 assert.match(css,/--product-evidence-padding: 24px 12px;/);
});
