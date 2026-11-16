# Checkpoint selection across experiments

“Best” names the checkpoint that won a stated rule on a stated evaluation set.
The rule changed over the training history.

| Experiments | Selection |
| --- | --- |
| Early full training, sharded continuation, Stage-2, dense8 | Minimum validation loss |
| Later selector and partial-unfreeze runs | Prefix first, then accuracy, then selector CE |

The later rule maximized this tuple lexicographically:

```python
score = (
    metrics["prefix_tokens"],
    metrics["accuracy"],
    -metrics["selector_ce"],
)
```

Accuracy broke ties in prefix; lower selector CE broke ties in both.

## Why the rule matters

| Run | Observed tradeoff |
| --- | --- |
| Project v1 | Last accuracy was higher; minimum loss selected step 3,500 |
| Dense8 | Step 122 had a longer prefix; loss selected step 74 |
| Short selector pilot | CE kept falling, but prefix worsened after selected step 96 |
| Long selector run | Best prefix increased while overall self-conditioned accuracy fell slightly |
| KL continuation | Last CE and KL were lower; prefix kept the export at step 52 |

A lower differentiable loss need not improve a discrete greedy prefix.
Keep the objective, block width, evaluation procedure and selection rule with
each reported checkpoint.

## Evaluate the exported state

The long selector trainer checked weights at the GGUF export dtype, then
restored FP32 master weights for further optimization. Rounding can change
which token wins near a tie.

The [Stage-2 selection page](checkpoint-selection.md) covers its loss-based
rule and mentor inputs. [Resume and exports](resume.md) explains why the latest
state may differ from the selected model.
