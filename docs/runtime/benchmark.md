# Benchmark setup

Overall decode speed of a mode:

$$
v_{\mathrm{decode}}
=
\frac{\sum_i n_i}{\sum_i t_{i,\mathrm{decode}}} .
$$

Speed using full request time:

$$
v_{\mathrm{wall}}
=
\frac{\sum_i n_i}{\sum_i t_{i,\mathrm{wall}}} .
$$

These are ratios of sums. Not the plain average of per-request speeds, and the
median is yet another number. Two reports can disagree while both are correct.

## Workload

$$
128\ \text{tasks} \cdot 2\ \text{repeats} \cdot 3\ \text{modes}
= 768\ \text{requests}.
$$

| Mode | Decode, tokens/s |
| --- | ---: |
| No draft | 54.06343 |
| Parent v1.2.0 | 68.67661 |
| Stage-2 candidate | 68.76792 |

## Relative change

$$
\Delta_v
=
100\left(
\frac{v_{\mathrm{candidate}}}{v_{\mathrm{parent}}} - 1
\right)
\approx 0.13295\% .
$$

The candidate gains about 27.20% over no-draft decoding. Almost all of that was
already in the parent, so the Stage-2 delta is a small slice of the total speedup.
That is why it needs an interval instead of a point estimate, see
[paired bootstrap](bootstrap.md).

## Why the request set is fixed

Tasks and repeats are fixed, so the comparison is paired: the same prompt, length
and sampling settings for every mode. Whatever difference remains comes from the
model or from drift in the machine, and the bootstrap tries to keep those two
apart.
