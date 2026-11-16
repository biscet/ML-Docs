# LM Knowledge Base

Notes on language models: how they are trained, how inference gets faster, and
what the measurements really show. The repo is meant to grow. New topics get
their own folder under `docs/`, and each page answers one question.

The DFlash2 material has two parts:

- [Stage-2 walkthrough](docs/overview/pipeline.md): the trainer, formulas,
  validation and runtime benchmark for the 13 November run.
- [Whittle training experiments](docs/experiments/index.md): the path from LoRA
  to full training, replay, dense anchors, selector-only and forward KL.

Both parts use short pages in English and Russian.

The site is bilingual. Every page has an English file and a Russian twin, built
at `/` and `/ru/`, and the header carries a language switch that stays on the
same page.

Russian README: [README.ru.md](README.ru.md).

## What is inside

| Path | Contents |
| --- | --- |
| `docs/` | English pages plus `*.ru.md` twins, one topic per file, built by MkDocs |
| `mkdocs.yml` | Site config, navigation, locales, math and diagram setup |
| `requirements.txt` | Pinned Python dependencies for the build |
| `README.ru.md` | Russian version of this file |

The site follows the training path in order:

| Section | Contents |
| --- | --- |
| Overview | The two prediction tasks, notation, the pipeline |
| Training data | How the frozen target makes tokens and features, anchor sampling, the context window |
| Draft architecture | Attention, SwiGLU, dynamic convolutions, output head, top-16 list |
| Objective | Full-vocabulary cross-entropy, the selector, the combined loss |
| Optimization | Clipping, AdamW, learning rate, mixed precision |
| Validation | Offline metrics, prefix proxy, validation windows, the 854 training positions |
| Multi-anchor analysis | What averaging over anchors changes, how much coverage it buys |
| Runtime and benchmark | Server verification, acceptance, speedup model, the 768-request benchmark, paired bootstrap |
| Training workflow | Checkpoint choice, feature storage, optimizer state memory, export rounding |
| Dataset | Mixing ratios and split leakage |
| Whittle experiments | Configurations, completed budgets, results and checkpoint lineage through 16 November 2026 |
| Reference | One training step in pseudocode, limits of the formulas, sources |

## Preview locally

Python 3.10 or newer.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Open <http://127.0.0.1:8000/lm-docs/> for English and
<http://127.0.0.1:8000/lm-docs/ru/> for Russian. The `/lm-docs/` prefix comes
from `site_url`, since the repo is published as a GitHub Pages project site.
Before pushing, run `mkdocs build --strict`: it fails on broken links and pages
missing from the navigation.

## Adding a page

1. Create `docs/<section>/<page>.md`, one question per page.
2. Create `docs/<section>/<page>.ru.md` next to it. The i18n plugin pairs the two
   by filename, so no extra config is needed.
3. Register the English file in the `nav` block of `mkdocs.yml`. Pages outside
   `nav` still get built, they just do not show up in the sidebar.
4. Add the sidebar label to `nav_translations` under `locale: ru` if the title is
   new.
5. Write math as `$...$` or `$$...$$`, diagrams as ` ```mermaid ` fences.
6. Link other pages by relative path to the `.md` file, in both languages.
   `--strict` catches targets that do not exist.

Miss a translation and the build fills the gap with the English page, so the
Russian sidebar stays complete while you catch up.

## Why MkDocs Material

The notes are math-heavy, so the site needs equations, symbol tables and at least
one diagram. MkDocs Material handles all three from plain Markdown, with no
JavaScript toolchain:

- Math: `pymdownx.arithmatex` in generic mode emits `\( \)` and `\[ \]`, and
  KaTeX renders them in the browser. KaTeX and its fonts are vendored under
  `docs/assets/`, so preview works offline.
- Diagrams: `pymdownx.superfences` turns ` ```mermaid ` fences into
  `<pre class="mermaid">` for the vendored Mermaid build.
- Languages: `mkdocs-static-i18n` in suffix mode pairs `page.md` with
  `page.ru.md`, builds both trees, and drives Material's header selector through
  `extra.alternate`.

Both are pinned upstream releases copied in as-is: KaTeX 0.16.22 and Mermaid
11.4.1.

## Conventions

- Formulas use TeX, inline `$...$`, display `$$...$$`.
- Numbers keep English decimal points (`3.86806307`, `1.2661%`) so they can be
  copied into code without edits.
- Symbols are defined once, in `docs/overview/notation.md`. Other pages link
  there instead of redefining them.
- Every metric is labelled with the procedure that produced it. Offline
  accuracy, runtime acceptance and decode speed stay three separate numbers and
  are never converted into each other.

## Scope and provenance

The Stage-2 walkthrough describes one run. The experiment history covers several
Whittle draft-training runs through 16 November 2026. Target weights stayed
frozen. Configurations and results describe these implementations, not every
DFlash2 trainer.

Referenced trainer files and the Coach experiment archive are not included in
this repository. Training and archive tests were not rerun for this documentation
edit. See [sources](docs/sources.md) and [archive details](docs/experiments/coach.md).

## Licence and status

Internal notes. No model weights, datasets or trainer code are included.
