import {productCopyFiles, productAddedFiles} from "./product-copy-contract.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import {transform} from 'lightningcss';
import {trackMouseInput} from '../app/components/mouse-input.ts';
import {v12Css} from './v12-contract.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const hash=data=>createHash('sha256').update(data).digest('hex');
const baseline=JSON.parse(read('qa/v13-v12-baseline/runtime-hashes.json'));
const lists=JSON.parse(read('qa/v13-v12-baseline/guarded-selectors.json'));
const marker='/* V13 actual mouse:';
const off=':where(:not([data-aiwork-input="off"]))';
const mouse=':where([data-aiwork-input="mouse"])';
const targetGuard=':where(:not(:disabled,:disabled *,[aria-disabled="true"],[aria-disabled="true"] *,[hidden],[hidden] *,[inert],[inert] *,.browser-preview,.browser-preview *))';
const scope=(selector,gate)=>selector.includes(':root')?selector.replaceAll(':root',':root'+gate):postcss.list.comma(selector).map(s=>':where(:root'+gate.slice(7,-1)+') '+s).join(',\n  ');
const rulesOf=source=>{const r=[];postcss.parse(source).walkRules(n=>r.push(n));return r;};
const values=rule=>rule.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value,!!n.important]);
const fallback=read('app/cinematic-theme.css').split('/* V14 foreground light:')[0].split(marker)[1];
const fallbackRules=rulesOf('/* V13 actual mouse:'+fallback);

class Hub {
  listeners=new Map();
  addEventListener(name,fn,options){const rows=this.listeners.get(name)||[];rows.push({fn,options});this.listeners.set(name,rows);}
  removeEventListener(name,fn){this.listeners.set(name,(this.listeners.get(name)||[]).filter(x=>x.fn!==fn));}
  emit(type,extra={}){const e={type,isTrusted:true,target:this,pointerType:'mouse',pointerId:1,buttons:0,pressure:0,clientX:42,clientY:64,...extra};for(const {fn} of this.listeners.get(type)||[])fn(e);return e;}
  count(){return [...this.listeners.values()].reduce((sum,x)=>sum+x.length,0);}
}
function setup(fine=false){
  const win=new Hub(),doc=new Hub(),html=new Hub();let now=1000,moves=0,resets=0,last;
  html.dataset={};doc.documentElement=html;doc.hidden=false;
  const media=new Hub();Object.defineProperty(media,'matches',{get:()=>fine});
  win.performance={now:()=>now};win.matchMedia=()=>media;
  const tracker=trackMouseInput(win,doc,e=>{moves++;last=[e.clientX,e.clientY];},()=>{resets++;last=null;});
  return {win,doc,html,tracker,get moves(){return moves;},get resets(){return resets;},get last(){return last;},tick(ms=501){now+=ms;},setFine(v){fine=v;media.emit('change');}};
}
const state=s=>s.html.dataset.aiworkInput;

test('coarse/no-hover media does not block trusted mouse; no initial DOM attribute or storage',()=>{
  const s=setup();assert.equal(state(s),undefined);assert.equal(s.tracker.hasHoverPointer(),false);
  s.win.emit('pointermove');assert.equal(state(s),'mouse');assert.equal(s.tracker.hasHoverPointer(),true);assert.deepEqual(s.last,[42,64]);
});
test('fine native default stays available and actual input uses the same mouse state',()=>{
  const s=setup(true);assert.equal(state(s),undefined);s.win.emit('pointerover');assert.equal(state(s),'mouse');
});
test('untrusted mouse, touch, cancellation and keyboard events cannot change modality',()=>{
  const s=setup();s.win.emit('pointermove',{isTrusted:false});assert.equal(state(s),undefined);
  s.win.emit('pointermove');for(const type of ['pointerdown','pointermove','pointercancel'])s.win.emit(type,{pointerType:'touch',isTrusted:false});
  s.win.emit('keydown',{isTrusted:false});assert.equal(state(s),'mouse');assert.equal(s.resets,0);
});
test('coarse and native-fine mouse to touch to real mouse transitions clear coordinates immediately',()=>{
  for(const fine of [false,true]){
    const s=setup(fine);s.win.emit('pointermove');s.win.emit('pointerdown',{pointerType:'touch'});
    assert.equal(state(s),'off');assert.equal(s.tracker.hasHoverPointer(),false);assert.equal(s.last,null);
    s.tick(1000);s.win.emit('pointermove');assert.equal(state(s),'off','Held touch blocks mouse');
    s.win.emit('pointerup',{pointerType:'touch'});s.win.emit('pointermove');assert.equal(state(s),'off','Touch tail ignored');
    s.tick();s.win.emit('pointermove');assert.equal(state(s),'mouse');
  }
});
test('multi-touch and touch cancellation cannot leave a stale mouse state',()=>{
  const s=setup();s.win.emit('pointermove');s.win.emit('pointerdown',{pointerType:'touch',pointerId:3});s.win.emit('pointerdown',{pointerType:'touch',pointerId:4});
  s.win.emit('pointercancel',{pointerType:'touch',pointerId:3});s.tick();s.win.emit('pointermove');assert.equal(state(s),'off');
  s.win.emit('pointerup',{pointerType:'touch',pointerId:4});s.tick();s.win.emit('pointermove');assert.equal(state(s),'mouse');
});
test('touch-derived mouse events cannot activate fallback and no compatibility mouse listeners exist',()=>{
  const s=setup();s.win.emit('pointermove');s.win.emit('pointermove',{sourceCapabilities:{firesTouchEvents:true}});
  assert.equal(state(s),'off');assert.equal(s.last,null);s.win.emit('pointermove');assert.equal(state(s),'off');
  s.tick();s.win.emit('pointermove');assert.equal(state(s),'mouse');
  for(const event of ['mouseover','mousemove','mousedown','mouseup','click'])assert.ok(!s.win.listeners.has(event));
});
test('cancel, document leave, blur and hidden reset; focus/tab restore never reactivates stale coordinates',()=>{
  for(const action of [s=>s.win.emit('pointercancel'),s=>s.html.emit('pointerleave'),s=>s.win.emit('blur'),s=>{s.doc.hidden=true;s.doc.emit('visibilitychange');}]){
    const s=setup();s.win.emit('pointermove');action(s);assert.equal(state(s),'off');assert.equal(s.last,null);assert.equal(s.tracker.hasHoverPointer(),false);
    s.doc.hidden=false;s.doc.emit('visibilitychange');s.win.emit('focus');assert.equal(state(s),'off');s.win.emit('pointermove');assert.equal(state(s),'mouse');
  }
});
test('descendant pointerleave does not reset a mouse still within the document',()=>{
  const s=setup();s.win.emit('pointermove');s.html.emit('pointerleave',{target:{}});assert.equal(state(s),'mouse');assert.equal(s.resets,0);
});
test('keyboard turns hover off without adding focus/selection/click interception',()=>{
  const s=setup(true);s.win.emit('pointermove');s.win.emit('keydown',{key:'Tab'});assert.equal(state(s),'off');assert.equal(s.last,null);
  assert.doesNotMatch(read('app/components/mouse-input.ts'),/preventDefault|stopPropagation|\.focus\(|setPointerCapture|user-select/);
});
test('fine native zero-pressure pen hover is retained; contact and coarse pen never activate fallback',()=>{
  const s=setup(true);s.win.emit('pointermove',{pointerType:'pen'});assert.equal(state(s),'pen');assert.equal(s.tracker.hasHoverPointer(),true);
  s.win.emit('pointerdown',{pointerType:'pen',buttons:1,pressure:.5});assert.equal(state(s),'off');
  s.win.emit('pointerup',{pointerType:'pen'});assert.equal(state(s),'off');
  s.win.emit('pointermove',{pointerType:'pen'});assert.equal(state(s),'pen');
  s.setFine(false);assert.equal(s.tracker.hasHoverPointer(),false);s.win.emit('pointermove',{pointerType:'pen'});assert.equal(state(s),'off');
});
test('modality listeners capture child-stopped events, are passive, and cleanly dispose',()=>{
  const s=setup();for(const name of ['pointerover','pointermove','pointerdown','pointerup','pointercancel','keydown']){
    assert.deepEqual(s.win.listeners.get(name)[0].options,{capture:true,passive:true});
  }
  s.win.emit('pointermove');s.tracker.dispose();assert.equal(state(s),undefined);assert.equal(s.win.count()+s.doc.count()+s.html.count(),0);
});
test('tracker adds no loop, timer, animation, UA check, persistence or subtree query',()=>{
  assert.doesNotMatch(read('app/components/mouse-input.ts'),/requestAnimationFrame|setTimeout|setInterval|querySelector|getBoundingClientRect|navigator|userAgent|localStorage|sessionStorage/);
});
test('only four existing/runtime sources change or are added; all other assets and markup stay byte-identical',()=>{
  const changed=Object.entries(baseline).filter(([file,expected])=>!productCopyFiles.includes(file)&&hash(fs.readFileSync(path.join(root,file)))!==expected).map(([file])=>file);
  assert.deepEqual(changed,['app/cinematic-theme.css','app/components/GlobalInteractions.tsx','app/globals.css']);
  const walk=dir=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(dir+'/'+x.name):[dir+'/'+x.name]);
  const added=['app','public'].flatMap(walk).filter(file=>!Object.hasOwn(baseline,file));assert.deepEqual(added.sort(),['app/components/mouse-input.ts',...productAddedFiles].sort());
  for(const file of ['app/globals.css','app/cinematic-theme.css','app/header-flow.css'])assert.equal(hash(v12Css(read(file))),baseline[file],file);
});
test('native guards alter only nominated hover selectors and add zero specificity',()=>{
  for(const [file,selectors] of Object.entries(lists)){
    const native=read(file).split(marker)[0];const actual=rulesOf(native),prior=rulesOf(v12Css(read(file)));
    assert.equal(actual.length,prior.length);
    actual.forEach((rule,i)=>{
      const before=prior[i];const selected=selectors.includes(before.selector)&&before.selector.includes(':hover');
      const guarded=file.endsWith('globals.css')?before.selector.replaceAll(':hover',':hover'+targetGuard):before.selector;
      assert.equal(rule.selector,selected?scope(guarded,off):before.selector);
      assert.deepEqual(values(rule),values(before));
    });
  }
});
test('fallback exactly reuses native target scopes, exclusions, declarations and order',()=>{
  const expected=[];
  for(const [file,selectors] of Object.entries(lists))for(const rule of rulesOf(v12Css(read(file))))if(selectors.includes(rule.selector)){
    const selector=file.endsWith('globals.css')?rule.selector.replaceAll(':hover',':hover'+targetGuard):rule.selector;
    expected.push({selector:scope(selector,mouse),values:values(rule),motion:file.endsWith('globals.css')||rule.parent.params.includes('no-preference')});
  }
  assert.equal(fallbackRules.length,expected.length);
  fallbackRules.forEach((rule,i)=>{
    assert.equal(rule.selector,expected[i].selector);assert.deepEqual(values(rule),expected[i].values);
    assert.equal(rule.parent.params,expected[i].motion?'(prefers-reduced-motion: no-preference)':undefined);
  });
});
test('every fallback displacement, pulse and transition requires no-preference; static text light does not',()=>{
  for(const rule of fallbackRules){
    const props=Object.fromEntries(values(rule));
    if(props.transform||props.transition||props['--control-light-motion'])assert.equal(rule.parent.params,'(prefers-reduced-motion: no-preference)');
    if(props.color||props['text-shadow']||props['--control-light-opacity'])assert.equal(rule.parent.type,'root');
  }
  assert.doesNotMatch(fallback,/product-mark-image|rotate\(|font|padding|margin|width:|height:|cursor:|user-select:|pointer-events:/);
});
test('disabled/inert/hidden/preview targets are guarded on both legacy raw and fallback card/CTA movement',()=>{
  for(const file of ['app/globals.css','app/cinematic-theme.css'])for(const rule of rulesOf(read(file))) {
    if(!rule.selector.includes('data-aiwork-input')||!Object.fromEntries(values(rule)).transform)continue;
    assert.ok(rule.selector.includes(targetGuard)||rule.selector.includes(':not(:disabled,[aria-disabled="true"],[hidden],[inert],[inert] *,.browser-preview *)'),rule.selector);
  }
});
test('proximity uses actual hover input, rejects excluded ancestors and clears positions synchronously',()=>{
  const source=read('app/components/GlobalInteractions.tsx');
  assert.match(source,/if \(!input\.hasHoverPointer\(\) \|\| document\.hidden \|\| element\.closest\(excluded\)\)/);
  assert.match(source,/:disabled,\[aria-disabled="true"\],\[hidden\],\[inert\],\.browser-preview,\.aiwork-cinematic-scene,\.honeypot/);
  assert.match(source,/x = y = -10000;\s*cancelAnimationFrame\(frame\); frame = 0;/);
  assert.match(source,/node\.style\.removeProperty\("--pointer-x"\); node\.style\.removeProperty\("--pointer-y"\)/);
  assert.doesNotMatch(source,/fine\.matches/);
});
test('complete generated/native CSS parses without recovery or compiler warnings',()=>{
  for(const file of ['app/globals.css','app/cinematic-theme.css','app/header-flow.css']){
    const source=read(file);assert.doesNotThrow(()=>postcss.parse(source));assert.deepEqual(transform({filename:file,code:Buffer.from(source),errorRecovery:false}).warnings,[]);
  }
});
test('dynamic disabled/hidden/inert changes reschedule proximity without observing its own style writes',()=>{
  const source=read('app/components/GlobalInteractions.tsx');
  assert.match(source,/attributes: true, attributeFilter: \["disabled", "aria-disabled", "hidden", "inert"\]/);
  assert.match(source,/if \(top\.current && top\.current\.hidden !== \(window\.scrollY < 400\)\)/);
  assert.ok(source.indexOf('element.closest(excluded)')<source.indexOf('element.getBoundingClientRect()'));
});
test('lost touch document boundary clears only that pointer so later genuine mouse can recover',()=>{
  const s=setup();s.win.emit('pointerdown',{pointerType:'touch',pointerId:5});s.html.emit('pointerleave',{pointerType:'touch',pointerId:5});
  s.tick();s.win.emit('pointermove');assert.equal(state(s),'mouse');
});
test('losing fine capability immediately clears native pen proximity but retains proven mouse fallback',()=>{
  const s=setup(true);s.win.emit('pointermove',{pointerType:'pen'});s.setFine(false);assert.equal(state(s),'off');assert.equal(s.last,null);
  s.win.emit('pointermove');s.setFine(true);s.setFine(false);assert.equal(state(s),'mouse');assert.equal(s.tracker.hasHoverPointer(),true);
});
test('repeated touch motion is idempotent: no repeated cleanup or root attribute writes',()=>{
  const s=setup();let writes=0;const data=s.html.dataset;
  s.html.dataset=new Proxy(data,{set(target,key,value){writes++;target[key]=value;return true;}});
  s.win.emit('pointermove');s.win.emit('pointerdown',{pointerType:'touch'});const before=[writes,s.resets,s.moves];
  for(let i=0;i<100;i++){s.tick(10);s.win.emit('pointermove',{pointerType:'touch'});}
  assert.deepEqual([writes,s.resets,s.moves],before);
  s.win.emit('pointerup',{pointerType:'touch'});s.win.emit('pointermove');assert.equal(state(s),'off');
  s.tick();s.win.emit('pointermove');assert.equal(state(s),'mouse');
});
