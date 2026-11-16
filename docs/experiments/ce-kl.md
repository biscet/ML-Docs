# Hard CE vs forward KL

Both branches used the same [partial-unfreeze scope](partial-unfreeze.md) and
starting weights from long-selector step 58,864. The experiment compared hard
token labels with [full-vocabulary soft targets](../objective/forward-kl.md).

## Matched start

| Setting | Both branches |
| --- | --- |
| Planned contexts | 16,384: 8,192 RU, 8,192 EN |
| Batch / feature window | 4 / 384 |
| Anchors / microbatches / width | 8 / 8 / 4 |
| LR / warmup | 2e-6 / 32 updates |
| Optimizer state | Fresh |
| Data, anchors and order | Identical |

The first shard held 16 contexts to check the full path; later shards held 64.
The first comparison threshold was 512 contexts. At the next shard boundary,
both branches had processed 528 contexts, or 132 updates.

## Reading the loss fields

| Field | Meaning |
| --- | --- |
| `ce` | Hard token CE |
| `kl` | Forward KL over the full vocabulary |
| `selector_ce` | Selector CE |
| `loss` / `unweighted_loss` | Diagnostic CE + 0.5 x selector CE |
| `objective_loss`, CE branch | CE + 0.5 x selector CE |
| `objective_loss`, KL branch | KL + 0.5 x selector CE |

The KL report's `loss` field was still a hard-CE diagnostic, not its optimized
KL objective.

## Selected states

| Metric | Experiment seed | CE, step 132 | KL, step 52 |
| --- | ---: | ---: | ---: |
| Diagnostic loss | 2.937608 | 2.925992 | 2.926552 |
| Hard CE | 2.436967 | 2.428747 | 2.433190 |
| Forward KL | 2.045861 | 2.032824 | 2.034270 |
| Selector CE | 1.001282 | 0.994489 | 0.986724 |
| Self-conditioned accuracy | 59.3750% | 59.6354% | 59.6354% |
| Correct-prefix proxy | 1.648438 | 1.648438 | 1.664063 |
| Top-16 recall | 83.8542% | 83.8542% | 83.5938% |

## KL continuation

After the matched budget, only KL continued. It reached step 660:
2,640 contexts across 42 shards. The planned 16,384-context pass was unfinished.

The best export stayed at step 52, after 208 training contexts, and became
v1.2.1. The last state had lower hard CE and KL, but prefix 1.648438; the
[selection rule](../workflow/experiment-selection.md) kept step 52 with
prefix 1.664063.

Continuing KL after the first comparison does not establish universal
superiority over CE. The selected states above also have different update counts.

Archive source: `experiments/07-ce-kl-partial/scripts/train_chunk.py`.
