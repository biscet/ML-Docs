# Where the 854 training positions came from

Each accepted batch $s$ held $n_s$ records. The exact count:

$$
\boxed{
M_{\mathrm{train}}
=
\sum_s n_s (b_s - 1)
}
$$

Replacing every $n_s$ with four would be wrong, because the last batch of each
shard was incomplete.

| Final step of shard | Records with $b=4$ | Records with $b=8$ | CE positions |
| --- | ---: | ---: | ---: |
| 9076 | 4 | 4 | 40 |
| 9090 | 42 | 12 | 210 |
| 9102 | 33 | 12 | 183 |
| 9116 | 40 | 13 | 211 |
| 9130 | 42 | 12 | 210 |
| Total | 161 | 53 | 854 |

Check:

$$
3 \cdot 161 + 7 \cdot 53 = 483 + 371 = 854 .
$$

## Share of generated tokens

$$
\frac{854}{67449} \cdot 100\% \approx 1.2661\% .
$$

This is the share of direct cross-entropy labels. It is not the share of changed
weights, and not the share of the graph that took part in backward.

## Why 854 is not a gradient weight

Each batch loss was averaged over its own positions, so a batch with three
targets and one with seven count the same per batch, not per position. The 854
describes coverage, not the size of the total gradient.

## Time is counted separately

Elapsed time is also not the time of 56 updates. The sum

$$
T_{\text{total}}
=
T_{\text{capture}}
+
T_{\text{loading}}
+
T_{\text{train}}
+
T_{\text{validation}}
+
T_{\text{mentor}}
+
T_{\text{benchmark}}
+
T_{\text{restore}}
$$

is on the [pipeline page](../overview/pipeline.md). Most of the work can land in
target generation and in the comparison run, even though only a few dozen updates
touched the draft.
