export default function Loading() {
  return (
    <main
      className="route-loading-fallback"
      aria-busy="true"
    >
      <div
        className="route-loading-fallback-card"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="page-transition-mark" aria-hidden="true">
          <b>AI</b>
        </span>
        <div>
          <strong>AIWORK</strong>
          <p>페이지를 안전하게 준비하고 있습니다.</p>
        </div>
      </div>
      <span className="route-loading-fallback-line" aria-hidden="true" />
    </main>
  );
}
