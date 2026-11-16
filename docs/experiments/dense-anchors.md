# Dense8: eight anchors per answer

Dense8 started from v1.2.0 and trained the full draft. It replaced one sampled
anchor with eight distinct anchors spread across each captured answer.

## Sampling and accumulation

The valid anchor range was divided into eight intervals, with one point drawn
from each:

```python
size = sequence_length - width - prompt_n + 1
anchors = [
    rng.randrange(prompt_n + i * size // count,
                  prompt_n + (i + 1) * size // count)
    for i in range(count)
]
```

Here `count = 8`. The loader required enough positions for eight distinct
anchors. Their future-label windows could overlap.

Eight microbatch backward passes avoided holding every anchor block in GPU
memory at once. Each loss was divided by eight before one optimizer update:

$$
L_{\mathrm{update}} = \frac{1}{8}\sum_{r=1}^{8}L_r.
$$

With batch 4 and width 4, a full update presented $4\cdot8\cdot3=96$ future
labels. This counts label presentations, not unique corpus tokens. More anchors
add supervision per capture, while also increasing compute and correlated label
visits; see [averaging over anchors](../analysis/multi-anchor.md).

## Completed run

The plan held 600 existing contexts, 300 per language, across 14 shards.
Training completed 12 shards, 536 contexts and 134 updates. Width stayed at 4.
Initial LR was 2.5e-6; the mentor later raised it to 5e-6.

| Metric | Dense8 start | Selected step 74 |
| --- | ---: | ---: |
| Loss | 2.601195 | 2.595146 |
| Token accuracy, earlier counting procedure | 62.5651% | 62.6953% |
| Correct-prefix proxy | 1.689453 | 1.705078 |
| Top-16 recall | 84.9609% | 85.2865% |

Selection still used loss. Step 122 had a longer correct prefix, but step 74
had the selected loss. Later trainers explicitly prioritized self-conditioned
prefix.

Archive sources: `experiments/02-dense8/scripts/anchor_sampling.py`,
`amp_step.py` and `train_shard.py`.
