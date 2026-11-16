# Stage-2: the new-context supplement

On 13 November, training continued from the best v1.2.0 state using only
272 new Stage-2 contexts. The main corpus was not added to this stage.

## Completed work

| Quantity | Value |
| --- | ---: |
| Planned / processed contexts | 272 / 214 |
| Completed / planned shards | 5 / 6 |
| Unprocessed contexts | 58 |
| Best / last global step | 9,090 / 9,130 |

The label “epoch 2” was a stage name. The preceding large run had not completed
its first full pass.

| Metric | Parent | Selected Stage-2 |
| --- | ---: | ---: |
| Loss | 3.869143 | 3.868063 |
| Token accuracy | 50.3906% | 50.4464% |
| Correct-prefix proxy | 2.621094 | 2.621094 |

Loss fell by about 0.028%. The mentor stopped the stage after a plateau.
Dense8, uniform/D-PACE and the short selector pilot later started from v1.2.0,
not this candidate.

## Why anchor density was investigated

The stage supplied 854 direct token-CE labels:

$$
N_{\mathrm{labels}} = 161\cdot3 + 53\cdot7 = 854.
$$

161 context visits used three future labels and 53 used seven. Other tokens
could still affect the gradient through conditioning features.

The supplement had narrow topic coverage, and answers often hit the 320-token
generation limit. Sparse direct labels and limited data breadth were possible
explanations for the plateau; these observations did not establish its cause.

The existing [Stage-2 walkthrough](../overview/pipeline.md) covers formulas and
the runtime benchmark. Archive sources are in `experiments/01-stage2/`,
including `checkpoint_seed.py` and `train_shard.py`.
