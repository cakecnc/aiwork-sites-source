import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {homeWorkbenchMessages} from '../app/home-workbench-i18n.ts';
import {productCopyFiles, productAddedFiles} from './product-copy-contract.mjs';
const root=new URL('../',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,root),'utf8');
const hash=b=>createHash('sha256').update(b).digest('hex');
test('product update changes only named content files; v14 visuals, runtime and public artwork are preserved',()=>{
 const base=JSON.parse(read('qa/product-copy-v14-baseline.json'));
 const changed=Object.entries(base).filter(([f,h])=>hash(fs.readFileSync(new URL(f,root)))!==h).map(([f])=>f).sort();
 assert.deepEqual(changed,[...productCopyFiles].sort());
 const walk=dir=>fs.readdirSync(new URL(dir+'/',root),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);
 assert.deepEqual(['app','public'].flatMap(walk).filter(f=>!productAddedFiles.includes(f)).sort(),Object.keys(base).sort());
});
test('all eight homepage languages distinguish local implementation from public release and illustrative UI',()=>{
 assert.deepEqual(Object.keys(homeWorkbenchMessages).sort(),['ko','en','ja','zh-CN','ar','es','fr','de'].sort());
 for(const [locale,c] of Object.entries(homeWorkbenchMessages)){
  assert.equal(c.capabilities.cards.length,6,locale);assert.equal(c.workflow.steps.length,6,locale);
  const content=JSON.stringify(c);assert.match(content,/NetGhost/);assert.match(content,/Ollama/);assert.match(content,/macOS/);
  assert.doesNotMatch(content,/V3\.1|Chrome import are planned|비밀번호·토큰 저장 안 함|No password or token storage|AI Agent 본체 미구현|Drive appDataFolder/);
  assert.match(c.capabilities.cards[5].description,/준비 중|pending/);
  assert.match(c.workbench.responseBody,/제목·주소|title and URL/);
  assert.match(c.boundary.advancedBody,/모든|not exhaustive/);
 }
});
test('consent, limited imports, local credential storage and unreleased capabilities are stated honestly',()=>{
 const ko=JSON.stringify(homeWorkbenchMessages.ko),en=JSON.stringify(homeWorkbenchMessages.en);
 assert.match(ko,/비밀번호·쿠키는 지원 범위와 OS 승인/);assert.match(en,/Password[s]? and cookies depend on support and OS approval/);
 assert.match(ko,/무료 사용을 보장하지/);assert.match(en,/not guaranteed free/);
 assert.match(ko,/로그인 세션.*저장될 수/);assert.match(en,/login sessions.*may be stored/);
 assert.match(ko,/다중 AI 공동 대화·장기 대화 압축·자동 메일/);assert.match(en,/Multi-AI shared conversations, long-chat compression and automated email/);
 assert.match(ko,/PDF·표 전체 분석/);assert.match(en,/Full PDF\/spreadsheet analysis/);
 assert.match(ko,/실제 앱 캡처 아님/);assert.match(en,/not an actual app screenshot/);
});
test('homepage cards are no longer marked planned, pricing links and legal identifiers stay outside the copy change',()=>{
 const page=read('app/page.tsx');assert.match(page,/\["LOCAL BUILD", "OPT-IN", "LOCAL BUILD"\]/);assert.doesNotMatch(page,/\["AVAILABLE", "CONNECT", "PLANNED"\]/);
 const layout=read('app/layout.tsx');assert.match(layout,/일반 공개 다운로드|공개 출시|공개 배포|출시 준비/);assert.match(layout,/https:\/\/aiwork\.to/);
 assert.ok(!productCopyFiles.includes('app/site-config.ts'));assert.ok(productCopyFiles.includes('app/i18n.ts'));
 let prior=read('qa/product-i18n-v14.txt'); for(const e of JSON.parse(read('qa/product-i18n-edits.json'))){assert.ok(prior.includes(e.old)); prior=prior.replace(e.old,e.new);} assert.equal(read('app/i18n.ts'),prior,'Only the reviewed product offer and release copy may change in shared translations');
});

test('linked product and guide pages use current product details rather than obsolete extension instructions',()=>{
 const routes=['product','features','download','security','how-to-use','how-to-use/getting-started','how-to-use/browser','how-to-use/documents','how-to-use/web-research','how-to-use/daum-email'];
 for(const route of routes){ const page=read('app/'+route+'/page.tsx'); assert.match(page,/productTopic=/);assert.doesNotMatch(page,/V3\.1|appDataFolder|Chrome 116|Alt\+Shift/); }
 const detail=read('app/components/DetailPage.tsx');assert.match(detail,/if \(productTopic\) return <CurrentProductDetails/);assert.match(detail,/No general public installer yet/);assert.match(detail,/Automated email is not available/);assert.match(detail,/The existing \/privacy document covers the Chrome extension/);
});
