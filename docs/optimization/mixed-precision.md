# Mixed precision

## Loss scaling

To keep small FP16 gradients representable, the loss is scaled:

$$
\mathcal{L}_{\mathrm{scaled}} = S\mathcal{L},
\qquad
g_{\mathrm{scaled}} = S g,
\qquad
g = g_{\mathrm{scaled}} / S .
$$

After unscaling the mathematical gradient is unchanged. Clipping runs after
unscaling, so the threshold sees real magnitudes.

## Overflow

If the gradients hold Inf or NaN, the optimizer skips the update. The scale drops
and the same batch, with the same anchors, runs again:

$$
\text{overflow}
\;\Longrightarrow\;
S \leftarrow S/2,
\quad
\text{skip step},
\quad
\text{retry the same batch}.
$$

A non-finite forward loss is a different error and ends the step. It is not
retried the same way, because a bad loss value means the computation produced
something invalid, not just the scale.

## Values in this run

- Starting from scratch, the scale was 1024.
- The continued Stage-2 used the saved value 256.
- No overflow retries happened in this stage.

## Why the retry is exact

Repeating the same batch with the same anchors keeps the objective intact: no
sample is dropped and no anchor is resampled. The gradient that eventually lands
belongs to the batch that was scheduled. Resampling instead would quietly shift
the data distribution every time a large activation overflowed.

The order of operations follows the
[PyTorch AMP examples](https://docs.pytorch.org/docs/2.8/notes/amp_examples.html).

## Earlier and later trainers

The initial full-training script had a simpler skip path for non-finite
gradients. Same-batch retry belongs to the later shared `amp_train_step` helper;
it should not be assumed for every historical script.

With several anchors, each microbatch loss is divided by the microbatch count.
After all backward passes, the helper unscales, checks gradients and applies
clipping at norm 1.0 before one update. Overflow retries do not count as
successful optimizer updates. See [dense8](../experiments/dense-anchors.md).
