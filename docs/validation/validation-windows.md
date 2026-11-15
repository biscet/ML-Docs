# Validation windows

For every saved validation answer, two points are used:

$$
a_f = P + \left\lfloor (G - 8) f \right\rfloor,
\qquad
f \in \{0.25,\ 0.7\} .
$$

A block of width 8 is checked at each point.

## How many positions that is

With 256 examples:

$$
256 \cdot 2 \cdot 7 = 3584
$$

future-position evaluations per full pass. They are not necessarily 3584 unique
tokens. Windows can overlap, and the same position can be counted twice for
different records or anchors.

## Aggregation

Let $u$ index a combination of one mini-batch and one of the two points, and let
$n_u$ be its batch size. The validator aggregates a metric $M_u$ as

$$
\overline{M}
=
\frac{\sum_u n_u M_u}{\sum_u n_u} .
$$

Full cross-entropy and accuracy reduce to an ordinary position-weighted estimate
at constant width.

Selector cross-entropy does not. It averages over top-16 hits inside each batch
first, then averages those batch values weighted by $n_u$. That is not always the
same as one global average over covered positions, so two runs with the same
total hits can report slightly different selector CE if the hits sit differently
across batches.

## Why two fixed points

Training samples the anchor uniformly. Validation instead uses two fixed quantiles
of the answer, one early and one late, so the metric is reproducible across
checkpoints: the same positions are scored every time, and a loss change comes
from the weights rather than from a new draw. The cost is that the metric does not
represent the full spread of anchor positions.
