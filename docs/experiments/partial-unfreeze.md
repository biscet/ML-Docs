# Partial unfreeze

Selector-only could choose among fixed candidates. The next experiment allowed
the draft to change representations and unary logits, so its top-16 candidate
sets could change too.

## Trainable scope

The run unfroze:

```text
fc.*
hidden_norm.*
norm.*
layers.4.*
layers.5.*
candidate_selector.*
```

Layer indices start at zero. The first four layers stayed frozen.

| Scope | Parameters | Tensors |
| --- | ---: | ---: |
| Trainable | 282,898,944 | 36 |
| Frozen | 243,352,576 | 60 |
| Total draft | 526,251,520 | 96 |

Hash checks continued to verify the frozen tensors.

## Starting state

Both CE and KL branches started from the best long-selector checkpoint,
step 58,864, rather than the last state at step 76,951. They received identical
starting weights and fresh optimizer states.

The [CE/KL comparison](ce-kl.md) describes their shared budget and results.
The [forward-KL page](../objective/forward-kl.md) explains the soft targets.

Archive source: `experiments/07-ce-kl-partial/scripts/selector_scope.py`.
