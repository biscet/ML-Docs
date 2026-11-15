# Expected coverage of answer positions

For the exact range used by the code, the number of admissible anchors is

$$
L = G - b .
$$

Let $c_t$ be the number of admissible anchors whose block covers position $t$. For
the range in [anchor sampling](../data/anchor-sampling.md):

$$
c_t =
\max\left(
0,\,
\min(t-1,\, N-b-1) - \max(P,\, t-m) + 1
\right).
$$

If $A$ points are drawn independently with replacement:

$$
\Pr(t \text{ covered})
=
1 - \left(1 - \frac{c_t}{L}\right)^{A},
$$

$$
\mathbb{E}[U_A]
=
\sum_t
\left[
1 - \left(1 - \frac{c_t}{L}\right)^{A}
\right].
$$

## Numbers for $G = 320$, $b = 4$

| Anchors per record | Loss positions with repetition | Expected unique positions |
| --- | ---: | ---: |
| 1 | 3 | 3.00 |
| 4 | 12 | 11.83 |
| 8 | 24 | 23.22 |

This is a coverage calculation, not a speedup forecast. Acceptance growth has to
be measured after training.

## Where the slack shows up

The sampling range drops the last admissible anchor position. Near the end of the
answer the final positions are covered by slightly fewer anchors than a tight
range would allow, which is why the expected unique count at $A=8$ is 23.22
instead of 24. The gap is small, but it is exactly the kind of off-by-one a
coverage argument cannot afford to guess.
