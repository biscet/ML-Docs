# OpenMix v2: mixed data and replay

OpenMix continued from Project v1 step 3,500. It added programming, mathematics,
text tasks and general knowledge from Tulu 3 SFT Mixture.

## Data

The new set held 1,152 prompts, split equally between RU and EN:
1,024 for training and 128 for validation. Training also included 256 old
project records as replay.

The original Tulu answers were not used as labels. Whittle Q5 generated new
continuations. Old project features could be reused because the text, tokens
and target configuration were unchanged.

| Training records | Count |
| --- | ---: |
| New prompts | 1,024 |
| Replayed project records | 256 |
| Planned total | 1,280 |
| Usable traces after excluding four short records | 1,276 |
| Validation traces, separate from training | 128 |

Replay kept old project tasks in the mixture. Its presence alone does not
establish that forgetting was eliminated.

## Training and result

All draft parameters were trainable. The run used batch 4, a 384-token feature
window, base LR 5e-6, FP32 master weights and FP16 autocast.

| Metric | OpenMix start | Selected step 8,000 |
| --- | ---: | ---: |
| Loss | 3.966076 | 3.720374 |
| Token accuracy | 48.1585% | 51.4509% |
| Correct-prefix proxy | 2.640625 | 2.816406 |
| Top-16 recall | 71.8192% | 74.6094% |

Training completed 10,000 steps. Step 8,000 became the first published adaptation,
v1.0.0. The local run name `openmix-v2` and public weight version `v1.0.0` use
different numbering.
