// Render ```mermaid fences (emitted as <pre class="mermaid">) with the bundled
// Mermaid build. Re-runs on Material's instant-navigation updates.
(function () {
  if (!window.mermaid) return;

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "neutral",
    flowchart: { curve: "basis", useMaxWidth: true },
    fontFamily: "inherit"
  });

  function renderDiagrams() {
    window.mermaid
      .run({ querySelector: ".mermaid" })
      .catch(function (error) {
        console.error("Mermaid render failed", error);
      });
  }

  var document$ = window.document$;
  if (document$ && typeof document$.subscribe === "function") {
    document$.subscribe(renderDiagrams);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderDiagrams);
  } else {
    renderDiagrams();
  }
})();
