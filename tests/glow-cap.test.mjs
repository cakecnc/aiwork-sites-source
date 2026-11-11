import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import {transform} from 'lightningcss';
const root=new URL('../',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,root),'utf8');
const original='/* V14 foreground light:'+read('app/cinematic-theme.css').split('/* V14 foreground light:')[1];
const cap=read('app/glow-cap.css');
const rules=s=>{const a=[];postcss.parse(s).walkRules(r=>a.push(r));return a;};
const before=rules(original),after=rules(cap);
test('the 70 percent cap preserves all six original target scopes and input media gates',()=>{
 assert.equal(after.length,6);assert.equal(after.length,before.length);
 after.forEach((r,i)=>{assert.equal(r.selector,before[i].selector);assert.equal(r.parent.params,before[i].parent.params);});
 const layout=read('app/layout.tsx');assert.ok(layout.indexOf('import "./glow-cap.css"')>layout.indexOf('import "./cinematic-theme.css"'));
});
test('every luminous layer is exactly 70 percent of its previous alpha; black outlines are preserved',()=>{
 after.forEach((r,i)=>{const old=before[i].nodes.filter(n=>n.type==='decl');const next=r.nodes.filter(n=>n.type==='decl');assert.equal(next.length,old.length);
  next.forEach((d,j)=>{assert.equal(d.prop,old[j].prop);assert.ok(!d.important);let expected=old[j].value;
   if(d.prop==='text-shadow') expected=expected.replace('4px #b8ffcd','4px rgb(184 255 205 / 70%)').replace('12px #31ff80','12px rgb(49 255 128 / 70%)').replace('28px rgb(49 255 128 / 95%)','28px rgb(49 255 128 / 66.5%)').replace('6px rgb(49 255 128 / 70%)','6px rgb(49 255 128 / 49%)').replace('14px rgb(49 255 128 / 40%)','14px rgb(49 255 128 / 28%)');
   assert.equal(d.value,expected);
  });
 });
});
test('the cap compiles with no layout, text-color, animation or whole-page darkening changes',()=>{
 assert.deepEqual(transform({filename:'glow-cap.css',code:Buffer.from(cap),errorRecovery:false}).warnings,[]);
 for(const r of after)for(const d of r.nodes.filter(n=>n.type==='decl'))assert.ok(['text-shadow','-webkit-text-stroke','paint-order'].includes(d.prop));
 assert.doesNotMatch(cap,/@keyframes|filter:|transition:|animation:|opacity:/);
});
