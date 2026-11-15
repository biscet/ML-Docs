# Anchors and masked blocks

## The anchor

One token of the answer becomes the anchor $x_a$. Its identity is known, what
follows is not. The draft receives

$$
\left[\,E(x_a),\ E(\text{MASK}),\ \ldots,\ E(\text{MASK})\,\right],
$$

where $E$ is the frozen embedding table of the target. The MASK ID in this model
is 248077.

The code calls this variable `noise`, but it is a masked input. No Gaussian noise
is added, unlike the usual diffusion setup for images. The mask is a deterministic
pattern of MASK tokens, and one forward pass predicts the whole block.

## Block widths

| Width $b$ | Predicted positions $m=b-1$ |
| ---: | ---: |
| 4 | 3 |
| 8 | 7 |

At $b=4$ the input and targets look like this:

```text
Already known:        x[a]
Draft input:         [x[a], MASK, MASK, MASK]
Prediction targets:          x[a+1], x[a+2], x[a+3]
```

Four block positions, three future tokens. At $b=8$ the same construction gives
seven.

## Why one pass instead of a sliding window

Predicting the whole block at once matches how the draft is used at inference: it
proposes several tokens from one anchor and the target checks them together.
Training on the same block shape removes a train/inference mismatch in the number
of predicted positions, though not in the acceptance rule.

## Related pages

- [Anchor sampling](anchor-sampling.md): how $a$ is drawn and how $b$ changes
  with the step.
- [Context window](context-window.md): which target features come with the block.
- [Attention](../architecture/attention.md): why masked positions cannot leak the
  answer.
