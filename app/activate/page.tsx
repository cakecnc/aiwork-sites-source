import type { Metadata } from 'next';
import ActivationClient from './ActivationClient';
export const metadata: Metadata = {
  title: 'AIWORK Pro 결제·활성화 준비',
  description: '서버에서 결제를 확인한 뒤 설치 기기용 서명 라이선스를 받는 준비 화면입니다.',
  robots: { index: false, follow: false },
};
export default function ActivationPage() { return <ActivationClient />; }
