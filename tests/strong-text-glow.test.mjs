import {productCopyFiles, productAddedFiles} from "./product-copy-contract.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import {transform} from 'lightningcss';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const marker='/* V14 foreground light:';
const source=read('app/cinematic-theme.css');
const previous=source.split(marker)[0].trimEnd()+'\n';
const addition=marker+source.split(marker)[1];
const ast=postcss.parse(addition),rules=[];
ast.walkRules(r=>rules.push(r));
const vals=r=>Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value]));
const base=JSON.parse(read('qa/v14-v13-baseline/runtime-hashes.json'));
test('v14 changes only appended foreground CSS; v13 themes and artwork stay identical except independently tested v15 product copy',()=>{
  for(const [file,digest] of Object.entries(base).filter(([file])=>!productCopyFiles.includes(file)))assert.equal(hash(file==='app/cinematic-theme.css'?previous:fs.readFileSync(path.join(root,file))),digest,file);
  const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
  assert.deepEqual(['app','public'].flatMap(walk).filter(f=>!productAddedFiles.includes(f)).sort(),Object.keys(base).sort());
});
test('all new paint compiles without warnings; no animation, layout, interaction or compositing additions',()=>{
  assert.deepEqual(transform({filename:'v14.css',code:Buffer.from(source),errorRecovery:false}).warnings,[]);
  assert.equal(rules.length,6);
  for(const r of rules)for(const d of r.nodes.filter(n=>n.type==='decl')){
    assert.ok(['text-shadow','-webkit-text-stroke','paint-order'].includes(d.prop),d.prop);assert.ok(!d.important);
  }
  assert.doesNotMatch(addition,/@keyframes|filter:|transition:|animation:|will-change|pointer-events|user-select/);
});
test('strong mouse/focus/active glow preserves the exact v13 target scopes and black edges',()=>{
  const old=[];postcss.parse(previous).walkRules(r=>{if(vals(r)['-webkit-text-stroke'])old.push(r)});
  assert.equal(old.length,3);
  for(let i=0;i<3;i++){
    assert.equal(rules[i].selector,old[i].selector);assert.equal(rules[i].parent.params,old[i].parent.params);
    const shadow=vals(rules[i])['text-shadow'];
    assert.match(shadow,/^\.6px 0 #000,-\.6px 0 #000,0 \.6px #000,0 -\.6px #000,/);
    assert.match(shadow,/0 0 4px #b8ffcd,0 0 12px #31ff80,0 0 28px rgb\(49 255 128 \/ 95%\)$/);
    assert.equal(postcss.list.comma(shadow).length,7,'Four hard edges, one core, two green halos');
  }
});
test('mobile resting glow is static, media-gated and excluded for actual mouse input',()=>{
  const r=rules[3];assert.equal(r.parent.params,'(hover: none), (pointer: coarse)');
  assert.doesNotMatch(r.selector,/:hover|:active|:focus/);
  for(const selector of postcss.list.comma(r.selector))assert.match(selector,/:root:where\(:not\(\[data-aiwork-input="mouse"\]\)\)/);
  assert.deepEqual(Object.keys(vals(r)),['text-shadow']);
  assert.match(vals(r)['text-shadow'],/6px rgb\(49 255 128 \/ 70%\),0 0 14px rgb\(49 255 128 \/ 40%\)$/);
});
test('copy contact/focus glow ends with CSS state and does not enable sticky hover or motion',()=>{
  const r=rules[4];assert.equal(r.parent.type,'root');assert.match(r.selector,/:is\(:active,:focus-visible\):not\(:has\(:active\)\)$/);
  assert.doesNotMatch(r.selector,/:hover|data-aiwork-input/);
  assert.equal(vals(r)['-webkit-text-stroke'],'.8px #000');assert.equal(vals(r)['paint-order'],'stroke fill');
  assert.equal(vals(r)['text-shadow'],vals(rules[0])['text-shadow']);
  assert.equal(rules[5].selector,rules[0].selector,'Control contact/focus is restored after resting mobile paint');
});
test('mobile copy keeps established leaf and decorative/disabled exclusions for every language',()=>{
  const selector=rules[3].selector;
  for(const token of [':disabled','[aria-disabled="true"]','[hidden]','[inert]','.honeypot','.aiwork-cinematic-scene','.product-mark','.swatches','.compact-flow > li','.research-results > li'])assert.ok(selector.includes(token),token);
  assert.match(selector,/:not\(:has\(> :where\(div,section,article,ul,ol,li,p,h1,h2,h3,h4,h5,h6\)\)\)/);
  assert.doesNotMatch(addition,/data-theme|\[lang|direction|letter-spacing|font-/);
});
