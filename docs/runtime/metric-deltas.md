# Loss and accuracy deltas

Relative reduction in loss:

$$
\Delta_{\mathrm{loss}}
=
100\,
\frac{
\mathcal{L}_{\mathrm{parent}} - \mathcal{L}_{\mathrm{best}}
}{
\mathcal{L}_{\mathrm{parent}}
} .
$$

For this run:

$$
100\,
\frac{3.86914256 - 3.86806307}{3.86914256}
\approx 0.02790\% .
$$

Accuracy change in percentage points:

$$
\Delta_{\mathrm{pp}}
=
100\left(A_{\mathrm{new}} - A_{\mathrm{old}}\right)
\approx 0.05580 .
$$

So 50.39063% became 50.44643%.

## Percent versus percentage point

A percentage point is not a relative percent. Going from 50.39063% to 50.44643% is
+0.0558 percentage points, which is about +0.111% relative. Both labels are fine
as long as the label is there. Quoting the smaller number without saying which one
it is makes a real change look like rounding noise.

## What the deltas do not imply

None of these formulas turns a loss reduction into the same percentage of speedup.
Loss, offline accuracy and decode speed are measured on different objects:
probabilities, teacher-forced selections, wall-clock throughput. The map between
them is not linear, not universal and not known in advance. That chain has to be
measured end to end, which is why the [benchmark](benchmark.md) exists and why its
interval is reported apart from the validation numbers.
