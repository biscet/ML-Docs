# DFlash2 draft training

Updated 16 November 2026.

This knowledge base covers the Whittle DFlash2 draft: a detailed Stage-2
walkthrough and a history of training experiments from LoRA to forward KL.

DFlash has two jobs that differ from ordinary LLM fine-tuning. The base model
already knows how to answer. A small draft model learns to anticipate its next
tokens so the base model can check several tokens in one forward pass. In this
run the base model's weights never changed.

## Where to start

| Material | Contents |
| --- | --- |
| [Stage-2 walkthrough](overview/pipeline.md) | Data, architecture, loss, validation and runtime benchmark for the 13 November run |
| [Whittle experiments](experiments/index.md) | Training configurations, completed budgets, results and checkpoint lineage through 16 November |

## Stage-2 at a glance

| Quantity | Value |
| --- | ---: |
| Trainable draft parameters $\theta$ | 526,251,520 |
| Vocabulary size $V$ | 248,320 |
| Optimizer updates | 56 |
| Direct cross-entropy labels | 854 |
| Best validation loss | 3.86806307 (step 9090) |
| Primary-head CE at the best checkpoint | 3.319237 |
| Decode speed, no draft | 54.06343 tok/s |
| Decode speed, parent v1.2.0 | 68.67661 tok/s |
| Decode speed, Stage-2 candidate | 68.76792 tok/s |
| Paired 95% interval on candidate vs parent | [0.0070%, 0.2549%] |

## Reading order

The Stage-2 chapters follow the training pipeline. The experiment history has
its own [reading order](experiments/index.md).

| Chapter | What it answers |
| --- | --- |
| [What DFlash2 trains](overview/what-dflash-trains.md) | Which parameters move and which stay frozen |
| [Notation](overview/notation.md) | Every symbol, plus the four counters that are easy to mix up |
| [End-to-end pipeline](overview/pipeline.md) | The path from a prompt to a speed comparison |
| [Training data](data/target-generation.md) | How the frozen target makes tokens and features, how an anchor block is cut |
| [Draft architecture](architecture/overview.md) | Attention, SwiGLU, dynamic convolutions, output head |
| [Objective](objective/cross-entropy.md) | The two losses and how they combine |
| [Optimization](optimization/gradient-clipping.md) | Clipping, AdamW, learning rate, mixed precision |
| [Validation](validation/offline-metrics.md) | What the offline numbers actually measure |
| [Multi-anchor analysis](analysis/multi-anchor.md) | What more anchors per record buy, and what they do not |
| [Runtime and benchmark](runtime/verification.md) | Acceptance on the server, the speedup model, the measured benchmark |
| [Training workflow](workflow/checkpoint-selection.md) | Checkpoint choice, storage, export |
| [Dataset](dataset/mixing.md) | Mixing ratios and split hygiene |
| [Reference](pseudocode.md) | One step in pseudocode, limits of the formulas, sources |

## How to read the numbers

Several measured quantities look interchangeable and are not. Each one is tied to
the procedure that produced it:

- Stage-2 offline accuracy uses teacher-forced anchor blocks. Later experiments
  also report [self-conditioned accuracy](validation/self-conditioned.md).
- Runtime acceptance is what the server counts while checking real drafts.
- Decode speed is a ratio of token sums to time sums over a fixed request set.

A low loss does not imply high runtime acceptance, and high acceptance does not
imply speedup once the draft's own cost is included. Those links are argued in
[What formulas cannot tell](caveats.md).
