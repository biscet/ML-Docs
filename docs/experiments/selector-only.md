# Selector-only pilot

The short selector pilot started from v1.2.0 and trained only three matrices:

```text
candidate_selector.predecessor_codebook.weight
candidate_selector.successor_codebook.weight
candidate_selector.hidden_projection.weight
```

That is 127,664,128 trainable parameters, with the other 398,587,392 frozen.
Fixed hidden representations, LM head and backbone kept unary logits and top-16
candidate sets unchanged. The selector could reorder candidates, but could not
introduce a missing token.

## Training and checks

| Setting | Value |
| --- | --- |
| Contexts / passes | 128 / 8 |
| Anchors / width / batch | 8 / 4 / 4 |
| Updates | 256 |
| Direct label presentations | 24,576 |
| Configured / actual starting LR | 1e-5 / 2e-4 |
| Objective | 0.5 x selector CE |

The mentor chose LR 2e-4 before training began. Token CE remained a diagnostic,
without contributing to the optimized objective. Hash comparisons checked the
frozen GGUF tensors; unary CE and top-16 recall stayed unchanged.

## Result

| Metric | Before | Selected step 96 | Last step 256 |
| --- | ---: | ---: | ---: |
| Selector CE | 0.871796 | 0.870162 | 0.867392 |
| Self-conditioned accuracy | 61.9141% | 62.2396% | 61.4583% |
| Correct-prefix proxy | 1.689453 | 1.697266 | 1.681641 |

The last step reduced selector CE further but shortened the correct prefix.
Step 96 was selected and seeded the [long selector run](selector-long.md).

This pilot used twice as many passes as the uniform experiment. A comparison
between them cannot attribute every difference to trainable scope alone.

Archive sources: `experiments/04-selector-only/`.
