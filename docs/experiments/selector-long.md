# Long selector training

This run started from the short pilot's best GGUF, step 96, with a fresh
optimizer. The pilot had not saved the full state needed to resume AdamW
exactly.

## Phases and recovery

Initial LR was 5e-5, with an absolute five-hour deadline. The time limit was
later removed. In the continuous variant, `deadline_unix = null` allowed
training until an explicit stop.

A mentor `stop` ended the current phase: restore the best state, reset
optimizer and scaler, lower LR, then continue. It did not end the whole run.
The old “five-hour” directory name remained after the deadline was removed.

The [resume checkpoint](../workflow/resume.md) kept FP32 selector weights,
AdamW moments and step, scaler, Python and CPU/CUDA RNG, epoch, cursor, phase
step, LR and history. Best GGUF and JSON metadata were stored separately.

## Evaluation in export precision

Before candidate selection, trainable weights were temporarily converted to
the exported GGUF dtype. Evaluation used that state, then restored the FP32
master weights for further training.

This mattered because rounding can change discrete choices near tied logits.
The selected candidate needed to reflect the weights that would be exported.

## Result

| Metric | Long-run start | Best step 58,864 |
| --- | ---: | ---: |
| Selector CE | 0.870162 | 0.861054 |
| Teacher-forced accuracy | 62.8255% | 64.0625% |
| Self-conditioned accuracy | 62.2396% | 62.1094% |
| Correct-prefix proxy | 1.697266 | 1.710938 |
| Unary CE | 2.165298 | 2.165298 |

The last saved step was 76,951. The run recorded 31 phase rollbacks and a final
LR of 1e-8. Selection prioritized prefix, so the best state had a longer prefix
despite slightly lower overall self-conditioned accuracy than the starting state.

Best step 58,864 seeded [partial unfreeze](partial-unfreeze.md).
Archive sources: `experiments/05-selector-long/` and
`experiments/06-selector-continuous/`.
