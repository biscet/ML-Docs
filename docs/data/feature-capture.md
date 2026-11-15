# Feature capture

The draft does not get the target's raw token stream as context. It gets hidden
states from a fixed set of target layers, so the information the target had is
available without re-running the target.

## Which layers

Eight layer inputs are captured:

$$
\mathcal S = \{1, 6, 11, 16, 22, 27, 32, 37\}.
$$

Layers in this target hold several hyper-connection streams. The capture patch
averages them. With $H_s$ streams, for layer $\ell$:

$$
\bar h_t^{(\ell)}
=
\frac{1}{H_s}
\sum_{r=1}^{H_s} h_t^{(\ell,r)} .
$$

This configuration has four streams.

## How they are combined

Averaged features from the chosen layers are concatenated along the last axis:

$$
f_t =
\operatorname{concat}
\left(
\bar h_t^{(1)}, \bar h_t^{(6)}, \ldots, \bar h_t^{(37)}
\right).
$$

Each layer gives 2,048 values, so

$$
\dim f_t = 8 \cdot 2048 = 16384 .
$$

## Cost

Storage and transfer scale with that width. One token costs
$8 \cdot 2048 \cdot 2 = 32$ KiB in FP16, which is what the
[storage planner](../workflow/feature-storage.md) budgets against. Averaging the
streams before capture is what keeps the factor at eight layers instead of eight
times four.

## Related pages

- [Feature projection](feature-projection.md): the 16,384-wide vector is
  compressed before the draft sees it.
- [Context window](context-window.md): which positions of $f_t$ are handed over.
