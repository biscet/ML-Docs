# Learning rate

Base Stage-2 rate:

$$
\eta_{\mathrm{base}} = 2.5\cdot10^{-6}.
$$

The input projection and `hidden_norm` get three times that:

$$
\eta_{\mathrm{projection}} = 3\eta_{\mathrm{base}} = 7.5\cdot10^{-6}.
$$

The code applies warmup:

$$
w(s) = \min\left(1, \frac{s}{100}\right),
\qquad
\eta(s) = \eta_{\mathrm{base}} w(s),
$$

where $s$ is the global step.

## Continuation, not a fresh start

Stage-2 resumed at step 9074, so warmup was already saturated:

$$
w(s) = 1 \quad \text{for} \quad s \ge 100 .
$$

No new warmup was started. This matters when reading the update count. The 56
updates of this stage run at full learning rate from the first step rather than
ramping up. A resumed run that re-triggered warmup would spend a noticeable part
of its small budget below the intended rate.

## Why the projection gets more

$W_f$ is freshly initialised compared with the pre-trained body around it. It has
to adapt from random weights while the decoder layers start from a parent
checkpoint. Tripling its rate shortens the time until it becomes a useful
compressor of the frozen 16,384-dimensional features instead of a bottleneck for
the whole stack.
