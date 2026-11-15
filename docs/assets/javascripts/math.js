// Render TeX produced by pymdownx.arithmatex (generic mode emits \( \) and
// \[ \]) with KaTeX. Re-runs on Material's instant-navigation updates.
(function () {
  function renderMath() {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false,
      strict: false
    });
  }

  var document$ = window.document$;
  if (document$ && typeof document$.subscribe === "function") {
    document$.subscribe(renderMath);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMath);
  } else {
    renderMath();
  }
})();
