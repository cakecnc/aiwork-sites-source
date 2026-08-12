(async () => {
  "use strict";

  const MARKER = "aiworkWebmcp";
  const VERSION = "0.1.0";
  const MAX_TEXT = 4200;

  const setState = (state) => {
    const value = String(state ?? "");
    document.documentElement.dataset[MARKER] = value;
    return value;
  };
  const result = (value) => ({
    content: [{ type: "text", text: JSON.stringify(value) }],
  });
  const normalize = (value) => String(value ?? "").replace(/\s+/gu, " ").trim();
  const truncate = (value, max = 600) =>
    normalize(value).slice(0, max);
  const collectLinks = () =>
    [...document.querySelectorAll("a[href]")]
      .map((anchor) => {
        const href = String(anchor.getAttribute("href") ?? "");
        if (!href || href.startsWith("javascript:") || href.startsWith("mailto:")) {
          return null;
        }
        const text = normalize(anchor.textContent);
        if (!text) {
          return null;
        }
        const resolved = (() => {
          try {
            return new URL(href, location.href).href;
          } catch {
            return href;
          }
        })();
        return {
          href: resolved,
          text,
        };
      })
      .filter(Boolean)
      .filter((item, index, list) =>
        index === list.findIndex((candidate) =>
          candidate.href === item.href && candidate.text === item.text))
      .slice(0, 60)
      .map((item) => ({
        href: item.href,
        text: truncate(item.text, 120),
      }));

  const collectSections = () => {
    const headings = [...document.querySelectorAll("h1, h2, h3")].map((heading) => ({
      level: heading.tagName.toLowerCase(),
      text: truncate(heading.textContent, 140),
    }));
    const sections = [...document.querySelectorAll("main, article, section")]
      .map((section) => ({
        id: section.id ? `#${section.id}` : "",
        title: truncate(section.getAttribute("aria-labelledby") ?? "", 80),
        text: truncate(section.textContent, MAX_TEXT / 4),
      }))
      .filter((section) => section.text);

    return {
      headings: headings.slice(0, 30),
      sections: sections.slice(0, 20),
      headingCount: headings.length,
    };
  };

  const currentRoute = () => ({
    origin: location.origin,
    href: location.href,
    pathname: location.pathname,
    title: document.title,
    language: document.documentElement.lang || "und",
    now: new Date().toISOString(),
  });

  const toolDefinitions = [
    {
      name: "aiwork-page-context",
      description:
        "Return current page metadata and a short, read-only text summary for AI assistants.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
      },
      execute: () =>
        result({
          adapter: "aiwork-webmcp",
          version: VERSION,
          route: currentRoute(),
          summary: truncate(document.body?.innerText ?? "", MAX_TEXT),
        }),
    },
    {
      name: "aiwork-page-links",
      description:
        "Return visible anchor links found on the page. No credentials or private storage are accessed.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
      },
      execute: () =>
        result({
          route: currentRoute(),
          links: collectLinks(),
        }),
    },
    {
      name: "aiwork-page-sections",
      description:
        "Return page heading and section structure snapshots without modifying page state.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
      },
      execute: () =>
        result({
          route: currentRoute(),
          structure: collectSections(),
        }),
    },
  ];

  const modelContext = document.modelContext?.registerTool;
  if (!modelContext) {
    setState("unsupported");
    return;
  }
  const registerTool = modelContext.bind(document.modelContext);

  try {
    for (const tool of toolDefinitions) {
      await registerTool(tool);
    }
  } catch (error) {
    setState("reload-required");
    console.error("[aiwork-webmcp] registration failed", error);
    return;
  }

  setState("ready");
  document.documentElement.dataset.aiworkWebmcpVersion = VERSION;
  document.dispatchEvent(
    new CustomEvent("aiwork-webmcp-ready", {
      detail: {
        version: VERSION,
        tools: toolDefinitions.map(({ name }) => name),
      },
    }),
  );
})();
