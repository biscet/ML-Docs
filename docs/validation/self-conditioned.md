# Teacher-forced and self-conditioned evaluation

The [selector score](../objective/selector-scoring.md) depends on the previous
token. Evaluation can supply that token in two ways.

| Procedure | Previous token at the next position |
| --- | --- |
| Teacher-forced | Correct target token |
| Self-conditioned | Token just chosen by the selector |

Self-conditioned evaluation follows the selector's own greedy path through a
block. It can measure how many consecutive future tokens remain correct before
the first error. The implementation used `greedy_selector_path`.

## Same weights, different accuracy

In the uniform/D-PACE experiment, the same parent model scored:

| Procedure | Token accuracy |
| --- | ---: |
| Teacher-forced | About 62.5651% |
| Self-conditioned | About 61.9141% |

No weight update separated these measurements. The difference came from the
previous-token input.

The training selector loss remained teacher-forced. Adding self-conditioned
evaluation did not introduce scheduled sampling or differentiable rollout
training.

## Comparing runs

Store the evaluation procedure alongside accuracy, block width and validation
data. Width 4 has three future positions; width 8 has seven. Prefix values and
accuracies from different setups are not directly comparable.

Even self-conditioned offline prefix is a [proxy](prefix-proxy.md), not a
runtime acceptance counter or a speed measurement.

See [uniform vs D-PACE](../experiments/position-weighting.md) for the paired
results and [checkpoint selection](../workflow/experiment-selection.md) for how
prefix guided later experiments.
