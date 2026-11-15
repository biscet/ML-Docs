# Anchor sampling

## Exact range

The anchor is drawn uniformly:

$$
a \sim \operatorname{UniformInt}(P, N-b-1).
$$

The upper bound is inclusive. The code leaves one extra position of slack
compared with the widest range that is mathematically admissible, and that slack
matters once answer coverage is counted exactly. See
[expected coverage](../analysis/anchor-coverage.md).

With $P$ prompt tokens and $N = P + G$ captured tokens, the number of admissible
anchors at a fixed width is

$$
L = G - b .
$$

## Width schedule

The block width depends on the global step $s$:

$$
b_s =
\begin{cases}
8, & s \bmod 4 = 0,\\
4, & \text{otherwise}.
\end{cases}
$$

Three of every four steps train three future positions, every fourth trains
seven. Wider blocks cost more compute per record but cover longer continuations,
which is where acceptance usually drops first.

## One anchor per record

The executed pass used exactly one anchor per record:

$$
A = 1 .
$$

The block did not slide across the answer, so a record contributes $b_s - 1$
labels, not $G$. Multiple anchors appear in
[averaging over anchors](../analysis/multi-anchor.md) as a possible setup. They
were not used here.

## What uniform sampling means

Sampling uniformly over admissible positions weights the answer by position
count, not by difficulty. Early positions, right after the prompt, are as likely
as late ones near the length cap. Any curriculum over anchor position would
change the sampling distribution, and with it what the loss estimates.
