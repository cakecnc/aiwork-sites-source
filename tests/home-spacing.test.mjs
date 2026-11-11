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
 assert.equal(read('app/page.tsx').replace('\n\nimport "./home-spacing.css";',''),before['app/page.tsx']);
 assert.equal(read('app/components/ProductEvidence.tsx').replace('var(--product-evidence-padding, 64px 24px)','64px 24px'),before['app/components/ProductEvidence.tsx']);
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
