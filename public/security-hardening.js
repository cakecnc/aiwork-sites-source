(() => {
  const prevent = (event) => {
    event.preventDefault();
  };

  ["contextmenu", "dragstart", "selectstart"].forEach((eventName) => {
    document.addEventListener(eventName, prevent, { capture: true });
  });

  document.addEventListener(
    "keydown",
    (event) => {
      const key = event.key.toLowerCase();
      if (event.key === "F12") return prevent(event);
      if ((event.ctrlKey || event.metaKey) && ["u", "s", "p", "i", "c", "j"].includes(key)) {
        return prevent(event);
      }
      if (event.ctrlKey && event.shiftKey && ["i", "j", "c", "r"].includes(key)) {
        return prevent(event);
      }
    },
    { capture: true },
  );
})();
