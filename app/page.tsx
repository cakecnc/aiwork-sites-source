"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeKey =
  | "system"
  | "light"
  | "dark"
  | "aurora"
  | "editorial"
  | "console";

const themes: Array<{
  key: ThemeKey;
  name: string;
  note: string;
  colors: string[];
}> = [
  { key: "system", name: "시스템", note: "기기 설정에 맞춤", colors: ["#f8fafc", "#111827", "#7357ff"] },
  { key: "light", name: "라이트", note: "맑고 선명하게", colors: ["#ffffff", "#182033", "#2563eb"] },
  { key: "dark", name: "다크", note: "눈이 편안하게", colors: ["#090d18", "#eaf0ff", "#8b5cf6"] },
  { key: "aurora", name: "프리미엄 오로라", note: "딥네이비 · 퍼플", colors: ["#07091a", "#a78bfa", "#22d3ee"] },
  { key: "editorial", name: "에디토리얼 워크플로", note: "아이보리 · 블루", colors: ["#f4f0e7", "#17336b", "#dc6b3f"] },
  { key: "console", name: "운영 콘솔", note: "차콜 · 민트", colors: ["#101614", "#62f5c3", "#1f332d"] },
];

const featureCards = [
  {
    label: "BROWSER",
    title: "보고 있는 화면에서 바로",
    description: "웹페이지를 읽고, 핵심을 정리하고, 다음 업무를 사이드 패널에서 이어갑니다.",
    icon: "↗",
  },
  {
    label: "WORKFLOW",
    title: "반복 업무를 하나의 흐름으로",
    description: "조사, 문서, 이미지, 검토와 승인까지 업무 단계를 끊김 없이 연결합니다.",
    icon: "⌁",
  },
  {
    label: "MEMORY",
    title: "자료가 쌓일수록 더 정확하게",
    description: "사용자가 선택한 자료와 결정 사항을 업무 맥락으로 정리해 다시 활용합니다.",
    icon: "◫",
  },
];

const steps = [
  ["01", "자료 연결", "웹, 문서, 이메일과 필요한 업무 자료를 선택합니다."],
  ["02", "AIWORK 실행", "목표에 맞는 분석과 제작 워크플로를 시작합니다."],
  ["03", "검토·완성", "근거와 결과를 확인하고 다음 작업으로 연결합니다."],
];

export default function Home() {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    if (typeof window === "undefined") return "aurora";
    const saved = localStorage.getItem("aiwork-theme") as ThemeKey | null;
    return saved && themes.some((item) => item.key === saved) ? saved : "aurora";
  });
  const [themeOpen, setThemeOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState(() => {
    const fallback = {
      accent: "#8b5cf6",
      secondary: "#22d3ee",
      background: "#07091a",
    };
    if (typeof window === "undefined") return fallback;
    try {
      const saved = localStorage.getItem("aiwork-custom-colors");
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem("aiwork-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const customStyle = useMemo(
    () =>
      ({
        "--custom-accent": custom.accent,
        "--custom-secondary": custom.secondary,
        "--custom-background": custom.background,
      }) as React.CSSProperties,
    [custom],
  );

  function chooseTheme(next: ThemeKey) {
    setTheme(next);
    setThemeOpen(false);
  }

  function saveCustom() {
    localStorage.setItem("aiwork-custom-colors", JSON.stringify(custom));
    document.documentElement.dataset.custom = "true";
    setCustomOpen(false);
  }

  function resetCustom() {
    const reset = { accent: "#8b5cf6", secondary: "#22d3ee", background: "#07091a" };
    setCustom(reset);
    localStorage.removeItem("aiwork-custom-colors");
    delete document.documentElement.dataset.custom;
  }

  return (
    <main className="site-shell" style={customStyle}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="AIWORK 홈">
          <span className="brand-mark">A</span>
          <span>AIWORK</span>
          <small>work, connected.</small>
        </a>

        <nav className="main-nav" aria-label="주요 메뉴">
          <a href="#product">제품</a>
          <a href="#workflow">기능</a>
          <a href="#security">보안</a>
          <a href="#contact">문의</a>
        </nav>

        <div className="header-actions">
          <div className="theme-anchor">
            <button
              className="theme-trigger"
              type="button"
              aria-expanded={themeOpen}
              onClick={() => setThemeOpen((value) => !value)}
            >
              <span className="palette-icon">◐</span>
              테마
              <span className="chevron">{themeOpen ? "▲" : "▼"}</span>
            </button>
            {themeOpen && (
              <div className="theme-menu">
                <div className="theme-menu-head">
                  <div>
                    <strong>화면 테마</strong>
                    <span>원하는 분위기를 선택하세요</span>
                  </div>
                  <button type="button" onClick={() => setThemeOpen(false)} aria-label="닫기">×</button>
                </div>
                <div className="theme-grid">
                  {themes.map((item) => (
                    <button
                      className={`theme-option ${theme === item.key ? "active" : ""}`}
                      type="button"
                      key={item.key}
                      onClick={() => chooseTheme(item.key)}
                    >
                      <span className="swatches">
                        {item.colors.map((color) => (
                          <i key={color} style={{ background: color }} />
                        ))}
                      </span>
                      <strong>{item.name}</strong>
                      <small>{item.note}</small>
                      {theme === item.key && <b>✓</b>}
                    </button>
                  ))}
                </div>
                <button
                  className="custom-link"
                  type="button"
                  onClick={() => {
                    setThemeOpen(false);
                    setCustomOpen(true);
                  }}
                >
                  <span>✦</span>
                  <span><strong>컬러 커스텀</strong><small>브랜드 컬러를 직접 지정</small></span>
                  <b>→</b>
                </button>
              </div>
            )}
          </div>
          <a className="install-small" href="#download">설치하기</a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="eyebrow"><span /> AI 업무의 새로운 기준</div>
        <h1>
          흩어진 업무를 연결하고,
          <br />
          <em>생각을 결과로.</em>
        </h1>
        <p>
          AIWORK는 웹, 문서, 이메일과 업무 도구를 하나로 연결해
          <br className="desktop-only" />
          조사부터 제작, 검토까지 더 빠르고 명확하게 완성합니다.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#download">AIWORK 시작하기 <span>↗</span></a>
          <a className="secondary-button" href="#product">서비스 알아보기 <span>↓</span></a>
        </div>
        <div className="trust-row">
          <span><i>✓</i> 사용자 승인 중심</span>
          <span><i>✓</i> 선택한 자료만 연결</span>
          <span><i>✓</i> 한국어 중심 인터페이스</span>
        </div>
      </section>

      <section className="product-panel" id="product">
        <div className="panel-topline">
          <span>AIWORK / WORKSPACE</span>
          <span className="live"><i /> READY</span>
        </div>
        <div className="workspace-grid">
          <aside className="source-column">
            <small>SOURCES</small>
            {["웹페이지 조사", "Google Drive", "업무 이메일", "프로젝트 문서"].map((source, index) => (
              <div className={index === 0 ? "source active" : "source"} key={source}>
                <span>{["⌘", "◇", "✉", "▤"][index]}</span>{source}
              </div>
            ))}
          </aside>
          <div className="conversation-column">
            <small>AIWORK ASSISTANT</small>
            <div className="user-bubble">이 자료를 바탕으로 시장 기회와 다음 실행안을 정리해줘.</div>
            <div className="ai-response">
              <span className="mini-mark">A</span>
              <div>
                <strong>핵심 기회 3가지를 확인했습니다.</strong>
                <p>자료의 근거를 연결해 우선순위, 위험 요소, 바로 실행할 작업으로 나누어 정리하겠습니다.</p>
                <div className="progress-lines"><i /><i /><i /></div>
              </div>
            </div>
          </div>
          <aside className="studio-column">
            <small>STUDIO PANEL</small>
            <strong>다음 작업</strong>
            {["시장조사 보고서", "제안서 초안", "실행 체크리스트"].map((item, index) => (
              <button key={item}><span>{["▥", "◇", "✓"][index]}</span>{item}<b>＋</b></button>
            ))}
            <div className="source-badge">근거 자료 <strong>8</strong></div>
          </aside>
        </div>
      </section>

      <section className="feature-section" id="workflow">
        <div className="section-heading">
          <span>CONNECTED INTELLIGENCE</span>
          <h2>업무의 모든 순간을<br />하나의 흐름으로</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <article key={card.title}>
              <span className="feature-icon">{card.icon}</span>
              <small>{card.label}</small>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a href="#contact">자세히 보기 →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="security">
        <div>
          <span className="section-kicker">HOW IT WORKS</span>
          <h2>복잡한 업무도<br />세 단계면 충분합니다.</h2>
          <p>연결 범위와 실행 단계를 사용자가 직접 확인하고 결정합니다.</p>
        </div>
        <div className="steps">
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section" id="download">
        <span>AIWORK BROWSER</span>
        <h2>업무가 있는 곳에서<br />AIWORK를 시작하세요.</h2>
        <p>Chrome 확장프로그램과 데스크톱 앱을 준비하고 있습니다.</p>
        <div>
          <button className="primary-button" type="button">출시 알림 신청 <span>↗</span></button>
          <a className="secondary-button" href="#contact">도입 상담</a>
        </div>
      </section>

      <footer id="contact">
        <div className="brand footer-brand"><span className="brand-mark">A</span><span>AIWORK</span></div>
        <p>AI와 업무를 연결하는 새로운 방식.</p>
        <a href="mailto:cakecnc@daum.net">cakecnc@daum.net</a>
        <small>© 2026 AIWORK. All rights reserved.</small>
      </footer>

      {customOpen && (
        <div className="custom-overlay" role="dialog" aria-modal="true" aria-labelledby="custom-title">
          <button className="overlay-close" aria-label="닫기" onClick={() => setCustomOpen(false)} />
          <section className="custom-panel">
            <div className="custom-head">
              <div><span>COLOR LAB</span><h2 id="custom-title">컬러 커스텀</h2><p>AIWORK를 사용자 브랜드에 맞게 조정하세요.</p></div>
              <button type="button" onClick={() => setCustomOpen(false)} aria-label="닫기">×</button>
            </div>
            <div className="custom-preview" style={{ background: custom.background }}>
              <span style={{ background: custom.accent }}>AIWORK</span>
              <strong style={{ color: custom.secondary }}>Work, connected.</strong>
              <i style={{ background: `linear-gradient(90deg, ${custom.accent}, ${custom.secondary})` }} />
            </div>
            <div className="color-controls">
              {([
                ["accent", "포인트 컬러"],
                ["secondary", "보조 컬러"],
                ["background", "배경 컬러"],
              ] as const).map(([key, label]) => (
                <label key={key}>
                  <span>{label}<small>{custom[key].toUpperCase()}</small></span>
                  <input
                    type="color"
                    value={custom[key]}
                    onChange={(event) => setCustom({ ...custom, [key]: event.target.value })}
                  />
                </label>
              ))}
            </div>
            <div className="custom-actions">
              <button type="button" onClick={resetCustom}>기본값 복원</button>
              <button type="button" className="save-custom" onClick={saveCustom}>컬러 적용하기</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
