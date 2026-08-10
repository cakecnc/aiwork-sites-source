(() => {
  let hideTimer;

  document.addEventListener(
    "contextmenu",
    (event) => {
      event.preventDefault();

      let notice = document.getElementById("right-click-disabled-notice");
      if (!notice) {
        notice = document.createElement("div");
        notice.id = "right-click-disabled-notice";
        notice.setAttribute("role", "status");
        notice.setAttribute("aria-live", "polite");
        notice.textContent = "우클릭은 사용할 수 없습니다.";
        notice.style.cssText = [
          "position:fixed",
          "left:50%",
          "top:50%",
          "transform:translate(-50%,-50%)",
          "z-index:2147483647",
          "max-width:calc(100vw - 32px)",
          "padding:16px 22px",
          "border-radius:12px",
          "background:rgba(17,24,39,.94)",
          "color:#fff",
          "font-family:sans-serif",
          "font-size:16px",
          "font-weight:700",
          "line-height:1.5",
          "text-align:center",
          "box-shadow:0 12px 32px rgba(0,0,0,.28)",
          "pointer-events:none",
        ].join(";");
        document.body.appendChild(notice);
      }

      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => notice.remove(), 1400);
    },
    { capture: true },
  );
})();
