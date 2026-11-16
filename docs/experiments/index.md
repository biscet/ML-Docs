# Whittle DFlash2 training experiments

16 November 2026.

These notes follow the adaptation of an Ornith 1.5 DFlash2 draft to
Whittle-Qwen-3.8-35B-A3B in Q5_K_M. Whittle stayed frozen throughout. The runs
changed the draft's trainable parameters, data, anchor sampling or loss.

Start with the [shared setup](setup.md), then read the experiments in order.
Results come from the supplied training history; [archive and sources](coach.md)
describes the evidence and its limits. This chapter covers training, without
runtime speed measurements.

## Experiments

| Experiment | What changed | Completed work and selected state |
| --- | --- | --- |
| [LoRA pilot](lora.md) | Rank-8 adapters and full feature projection | 80 updates |
| [Project v1](project.md) | Full draft, RU/EN project code | 5,500 steps; selected 3,500 |
| [OpenMix v2](openmix.md) | General tasks and project replay | 10,000 steps; selected 8,000 |
| [DatasetDflash v3](sharded.md) | Sharded capture and training, mentor decisions | 36,296 traces; selected 9,074 |
| [Stage-2 supplement](stage2.md) | Only the new 272-context supplement | 214 contexts; selected 9,090 |
| [Dense8](dense-anchors.md) | Eight anchors per answer | 134 updates; selected 74 |
| [Uniform vs D-PACE](position-weighting.md) | Position weighting | 128 updates per branch |
| [Selector-only pilot](selector-only.md) | Three selector matrices | 256 updates; selected 96 |
| [Long selector run](selector-long.md) | Selector training with phase rollbacks | Last step 76,951; selected 58,864 |
| [Partial unfreeze](partial-unfreeze.md) and [CE vs KL](ce-kl.md) | Projection, norms, final layers and selector | CE: 132 updates; KL: 660, selected 52 |

## Which weights each run used

Project v1 step 3,500 seeded OpenMix. OpenMix step 8,000 became public weights
v1.0.0. The sharded continuation produced v1.1.0 and v1.2.0.

Stage-2, dense8, uniform/D-PACE and the short selector pilot each started from
v1.2.0. The Stage-2 candidate was not their parent.

The short selector pilot's step 96 seeded the long selector run. Its best step
58,864 then seeded both partial-unfreeze branches. KL step 52 became v1.2.1.
Step counters belong to their own runs; adding them does not give a valid total.

## Comparing results

Compare each candidate with its own starting state. Block width, validation
data, loss and [accuracy procedure](../validation/self-conditioned.md) differ
between experiments. The [selection rule](../workflow/experiment-selection.md)
also changed.

The mentor, AMP, sharding and checkpoint recovery controlled training. Weight
updates used gradient optimization, not PPO, DPO, GRPO or RLHF. No reward-model
training or fine-tuning of Whittle was recorded.
