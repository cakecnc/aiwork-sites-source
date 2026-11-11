import { v12Css, addedRuntime, changedRuntime } from "./v12-contract.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import {transform} from 'lightningcss';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>file.endsWith('.css')?v12Css(fs.readFileSync(path.join(root,file),'utf8')):fs.readFileSync(path.join(root,file),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const css=read('app/cinematic-theme.css');
const marker='/* V10 cleanup:';
// V12 appends a narrowly scoped CTA-motion exception. Keep the entire original
// v10 outline contract intact; hover-motion.test.mjs guards the new suffix.
const extra=css.slice(css.indexOf(marker)).split('/* V12 CTA hover:')[0];
const ast=postcss.parse(extra),rules=[];
ast.walkRules(rule=>rules.push(rule));
const values=rule=>Object.fromEntries(rule.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value]));
const outline=rules.filter(rule=>values(rule)['-webkit-text-stroke']);
const media=rule=>rule.parent.type==='atrule'?rule.parent.params:'';

test('v10 preserves the complete v9 stylesheet before the cleanup and outline additions',()=>{
  assert.equal(hash(css.slice(0,css.indexOf(marker)).trimEnd()+'\n'),
    '73e88222f00a33690c9cfa5057461a24cf9b24bcdfc30597b28206cff01a8789');
  assert.deepEqual(transform({filename:'cinematic-theme.css',code:Buffer.from(css),errorRecovery:false}).warnings,[]);
});

test('only the requested rain and styles plus the explicit v12 transition repair change',()=>{
  const baseline=JSON.parse(read('qa/v10-v9-baseline/runtime-hashes.json'));
  const changed=[];
  for(const[file,expected]of Object.entries(baseline)){
    if(!changedRuntime.includes(file)&&hash(file.endsWith('.css')?read(file):fs.readFileSync(path.join(root,file)))!==expected)changed.push(file);
  }
  assert.deepEqual(changed.sort(),['app/cinematic-theme.css','app/components/matrix-engine.js','app/header-flow.css'].sort());
  // Do not accept an arbitrary new header hash: its full pre-v12 bytes still
  // match v9, and the new suffix is independently constrained by v12 tests.
  const priorHeader=read('app/header-flow.css').split('/* V12 motion repair:')[0].trimEnd()+'\n';
  assert.equal(hash(priorHeader),baseline['app/header-flow.css']);
  for(const asset of ['public/assets/aiwork-matrix-scene-v18.webp','public/assets/aiwork-matrix-scene-v18-low.webp','public/assets/aiwork-matrix-structure.svg'])assert.ok(baseline[asset]);
});

test('the exact v9 poster and SVG preserve the continent map, floor grid and thick rings',()=>{
  const component=read('app/components/CinematicMatrix.tsx');
  assert.equal(component,read('qa/v10-v9-baseline/CinematicMatrix.tsx.txt'));
  assert.match(component,/<picture>/);
  assert.match(component,/posterElement: poster.current/);
  assert.match(component,/aiwork-matrix-scene-v18.webp/);
  assert.match(component,/aria-hidden="true" inert/);
  assert.match(component,/disabled=\{reducedMotion\}/);
  assert.match(css,/background: #000704 url\("\/assets\/aiwork-matrix-structure.svg"\)/);
  assert.doesNotMatch(extra,/background-image|display:|visibility:|opacity:/);
});

test('all seven background motion families remain, including light over the original artwork',()=>{
  const engine=read('app/components/matrix-engine.js');
  for(const call of ['fixedGlyphLight(t)','codeGrid(t)','rain(t)','globe(t)','panel(GEOMETRY.left,t,13,false)','panel(GEOMETRY.right,t,47,true)','waves(t)'])assert.ok(engine.includes(call));
  assert.match(read('app/components/CinematicMatrix.tsx'),/posterElement: poster.current/);
  assert.match(engine,/if\(!dead&&!paused&&!media\.matches&&!document\.hidden\)/);
});

test('black outlines cover exactly the existing luminous text state selectors',()=>{
  const original=postcss.parse(css.slice(css.indexOf('/* Enabled controls:'),css.indexOf(marker)));
  const expected=new Map();
  original.walkRules(rule=>{
    if(!values(rule)['text-shadow'])return;
    const key=media(rule);if(!expected.has(key))expected.set(key,[]);expected.get(key).push(rule.selector);
  });
  assert.equal(outline.length,2);
  for(const rule of outline){
    assert.equal(rule.selector,expected.get(media(rule)).join(',\n'));
    assert.equal(values(rule)['-webkit-text-stroke'],'.8px #000');
    assert.equal(values(rule)['paint-order'],'stroke fill');
    assert.match(values(rule)['text-shadow'],/\.6px 0 #000,-\.6px 0 #000,0 \.6px #000,0 -\.6px #000/);
    assert.match(values(rule)['text-shadow'],/#31ff80/);
    assert.deepEqual(Object.keys(values(rule)).sort(),['-webkit-text-stroke','paint-order','text-shadow'].sort());
  }
});

test('outline is static, pointer-gated, reduced-motion-safe and leaves text behavior intact',()=>{
  assert.doesNotMatch(extra,/animation\s*:|transition\s*:|filter\s*:|transform\s*:|opacity\s*:|cursor\s*:|user-select\s*:|pointer-events\s*:|font\s*:|outline\s*:/);
  for(const rule of outline){
    if(media(rule))assert.equal(media(rule),'(hover: hover) and (pointer: fine)');
    else assert.match(rule.selector,/:is\(:active,:focus-visible\)/);
    assert.match(rule.selector,/:not\(:disabled/);
    assert.doesNotMatch(rule.selector,/data-theme/);
    assert.doesNotMatch(media(rule),/no-preference/);
  }
});

test('green core against the black edge has greater than fifteen-to-one contrast',()=>{
  const channels=[0xb8,0xff,0xcd].map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  const lum=channels.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  assert.ok((lum+.05)/.05>15);
});
