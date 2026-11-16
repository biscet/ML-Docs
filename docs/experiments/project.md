# Project v1: full draft fine-tuning

After the LoRA pilot, training switched to all 526,251,520 draft parameters.
The goal was adaptation to RU/EN code tasks from two projects.

## Data

288 source files produced 576 tasks: 512 for training and 64 for validation.
Files were split before RU/EN variants were created, reducing the risk of the
same file reaching both splits under different wording.

Whittle Q5 generated the answers and features.

## Training

| Setting | Value |
| --- | --- |
| Batch / feature window | 4 / 384 tokens |
| Precision | FP32 master weights, FP16 autocast |
| Optimizer | AdamW, weight decay 0.01 |
| LR groups | Draft body; fc and hidden_norm at 3x body LR |
| Schedule | 100-step warmup, cosine-like LR decay |
| Block width | 8 every fourth global step, 4 otherwise |
| Validation / full state save | Every 500 / 1,000 steps |
| Early stopping | Four checks without sufficient improvement, after the minimum step |

The full trainers in this family used

$$
L = L_{\mathrm{token\ CE}} + 0.5L_{\mathrm{selector\ CE}}.
$$

## Result

| Metric | Before | Selected step 3,500 |
| --- | ---: | ---: |
| Loss | 4.002252 | 3.641692 |
| Token accuracy | 48.5491% | 50.7813% |
| Correct-prefix proxy | 2.453125 | 2.726563 |
| Top-16 recall | 72.3214% | 75.5580% |

Training completed 5,500 steps. Selection used minimum loss, so step 3,500 won
even though the last state had higher accuracy. That selected checkpoint
seeded [OpenMix](openmix.md).

Archive source: `experiments/00-initial-adaptation/scripts/train_projects.py`.
