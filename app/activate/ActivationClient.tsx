'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { useSitePreferences } from '../preferences';
import './activation.css';

type Term = { id: string; months: number; amount: string; currency: string };
type Catalog = { enabled: boolean; billing_mode?: string; environment?: string; csrf?: string; terms?: Term[] };
type Payment = { status: string; term?: string; installation_id?: string; expires_at?: number };
const endpoint = '/api/payments/';
const pending: Catalog = { enabled: false };
export function safeApprovalUrl(value: unknown, environment: string): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const host = environment === 'sandbox' ? 'www.sandbox.paypal.com' : environment === 'live' ? 'www.paypal.com' : '';
    if (url.protocol !== 'https:' || url.hostname !== host || url.port || url.username || url.password || url.hash || !/^\?token=[A-Z0-9]+$/.test(url.search) || url.pathname !== '/checkoutnow' || !/^[A-Z0-9]+$/.test(url.searchParams.get('token') ?? '')) return null;
    return url.href;
  } catch { return null; }
}
export default function ActivationClient() {
  const { locale } = useSitePreferences(); const ko = locale === 'ko';
  const [catalog,setCatalog] = useState<Catalog>(pending);
  const [payment,setPayment] = useState<Payment|null>(null);
  const [installation,setInstallation] = useState('');
  const [term,setTerm] = useState('monthly');
  const [busy,setBusy] = useState(false); const running=useRef(false);
  const [message,setMessage] = useState('');
  const copy = (kr:string,en:string) => ko?kr:en;
  useEffect(()=>{
    const controller=new AbortController();
    void (async()=>{
      try {
        const response=await fetch(endpoint+'?action=catalog',{credentials:'same-origin',cache:'no-store',signal:controller.signal});
        if(!response.ok) return;
        const c=await response.json() as Catalog;
        if(c.enabled!==true||c.billing_mode!=='one_time'||!c.csrf||!Array.isArray(c.terms)) return;
        setCatalog(c);
        const status=await fetch(endpoint+'?action=session',{credentials:'same-origin',cache:'no-store',signal:controller.signal});
        if(status.ok){const value=await status.json();if(value.has_payment&&value.payment)setPayment(value.payment);}
      } catch { /* Missing or disabled backend remains closed. */ }
    })();
    return ()=>controller.abort();
  },[]);
  async function post(action:string,body:Record<string,string>={}) {
    const response=await fetch(endpoint+'?action='+action,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-CSRF-Token':catalog.csrf??''},body:JSON.stringify(body)});
    if(!response.ok)throw new Error('REQUEST_FAILED');
    return await response.json();
  }
  async function perform(action:()=>Promise<void>) {
    if(running.current)return;running.current=true;setBusy(true);setMessage('');
    try{await action();}catch{setMessage(copy('아직 완료되지 않았습니다. 재결제하지 말고 이 화면에서 다시 확인하거나 지원팀에 문의해 주세요.','Not completed. Do not pay again. Check here again or contact support.'));}
    finally{running.current=false;setBusy(false);}
  }
  async function checkout(){
    if(!catalog.enabled||!/^[a-f0-9]{32}$/.test(installation))return;
    await perform(async()=>{const data=await post('checkout',{term,installation_id:installation});const url=safeApprovalUrl(data.approval_url,catalog.environment??'');if(!url)throw new Error('INVALID_APPROVAL_URL');window.location.assign(url);});
  }
  async function verify(){await perform(async()=>{const result=await post('capture');setPayment(result.payment);setMessage(copy('서버에서 결제 상태를 확인했습니다. 라이선스는 확인된 결제에만 발급됩니다.','Payment status checked on the server. Only verified payments can receive a license.'));});}
  async function download(){await perform(async()=>{const data=await post('license');if(typeof data.license?.payload!=='string'||!/^[a-f0-9]{128}$/i.test(data.license?.signature_hex??''))throw new Error('LICENSE_INVALID');const url=URL.createObjectURL(new Blob([JSON.stringify(data.license,null,2)+'\n'],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='aiwork-pro-license.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage(copy('라이선스 파일을 저장했습니다. 해당 설치 기기의 AIWORK Pro 화면에서 불러오세요.','License file saved. Import it in AIWORK Pro on the matching installation.'));});}
  async function cancel(){await perform(async()=>{await post('cancel');setPayment(null);setMessage(copy('미결제 주문 준비를 취소했습니다. 이미 승인·결제된 주문은 여기서 취소되지 않습니다.','Unpaid checkout cancelled. Approved or paid orders are not cancelled here.'));});}
  const ready=catalog.enabled&&catalog.billing_mode==='one_time';
  return <main className="site-shell" id="main-content"><SiteHeader active="pricing" context="Pro activation"/><section className="activation-panel" lang={ko?'ko':'en'}>
    <span className="section-kicker">AIWORK PRO</span><h1>{copy('결제 확인과 기기 활성화','Payment verification and activation')}</h1>
    {!ready?<div role="status"><h2>{copy('결제 연결 준비 중','Checkout is not enabled')}</h2><p>{copy('현재 결제나 Pro 권한 발급은 열려 있지 않습니다. 결제방식과 제공 절차를 확인한 후 운영을 시작합니다.','Payments and Pro license delivery are not open. Billing and fulfillment must be verified before launch.')}</p></div>:<>
      {catalog.environment==='sandbox'&&<p className="activation-warning">{copy('샌드박스 시험 화면입니다. 실제 판매가 아닙니다.','Sandbox test mode. This is not a live sale.')}</p>}
      <p>{copy('선택 기간을 한 번 결제합니다. 자동 갱신되지 않습니다. 설치 ID는 앱의 Pro 화면에서 확인하세요.','Pay once for the selected term. There is no automatic renewal. Find your installation ID in the app’s Pro panel.')}</p>
      {!payment?<form onSubmit={event=>{event.preventDefault();void checkout();}}><label htmlFor="installation-id">{copy('설치 ID','Installation ID')}</label><input id="installation-id" value={installation} onChange={event=>setInstallation(event.target.value.trim().toLowerCase())} minLength={32} maxLength={32} pattern="[a-f0-9]{32}" required autoComplete="off" spellCheck={false}/>
        <label htmlFor="payment-term">{copy('이용 기간','Access term')}</label><select id="payment-term" value={term} onChange={event=>setTerm(event.target.value)}>{catalog.terms?.map(item=><option key={item.id} value={item.id}>{item.months}{copy('개월',' months')} · {item.currency} {item.amount}</option>)}</select>
        <button className="primary-button" disabled={busy||!/^[a-f0-9]{32}$/.test(installation)} type="submit">{copy('PayPal에서 결제 진행','Continue to PayPal')}</button></form>:<div><p>{copy('이 브라우저에 저장된 주문 상태','Order status in this browser')}: <strong>{payment.status}</strong></p><p>{copy('결제 후 돌아온 주소 자체로는 활성화되지 않습니다. 서버 확인을 진행하세요.','Returning from PayPal does not activate Pro. Verify payment on the server.')}</p><div className="activation-actions"><button className="primary-button" disabled={busy} onClick={()=>void verify()}>{copy('결제 완료 확인','Verify payment')}</button><button className="secondary-button" disabled={busy||payment.status!=='paid'} onClick={()=>void download()}>{copy('서명 라이선스 받기','Download signed license')}</button><button className="secondary-button" disabled={busy} onClick={()=>void cancel()}>{copy('미결제 주문 취소','Cancel unpaid checkout')}</button></div></div>}
      <p className="activation-warning">{copy('현재 준비 버전의 라이선스는 짧은 유효기간으로 발급되며 이 화면에서 다시 받아야 합니다. 앱 자동 갱신·분실 복구가 검증되기 전에는 실제 판매를 열지 않습니다.','This preparation version issues a short license lease that must be downloaded again here. Live sales remain closed until automatic refresh and recovery are validated.')}</p>
    </>}
    <p role="status" aria-live="polite">{message}</p><p><Link href="/pricing/">{copy('Free·Pro 요금 보기','View Free and Pro pricing')}</Link> · <Link href="/contact/">{copy('활성화 지원 문의','Contact activation support')}</Link></p>
  </section><SiteFooter/></main>;
}
