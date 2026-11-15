# Cross-entropy

## Labels

The correct token for future position $j$ of record $i$ is

$$
y_{i,j} = x_{a_i + j}.
$$

A block contributes $m$ labels per record, one per predicted position.

## Loss

Cross-entropy over the full vocabulary:

$$
\mathcal{L}_{\mathrm{CE}}
=
-\frac{1}{Bm}
\sum_{i=1}^{B}
\sum_{j=1}^{m}
\log q_{i,j}(y_{i,j}) .
$$

The lower the probability of the correct token, the bigger the penalty. The
logarithm is natural:

$$
-\log 0.8 \approx 0.2231,
\qquad
-\log 0.2 \approx 1.6094 .
$$

When the correct token is missing from the top-16 list, this loss still trains the
main head. That is its main job. The selector can only reorder candidates the head
already produced.

## Gradient

For one logit:

$$
\frac{\partial \mathcal{L}_{\mathrm{CE}}}{\partial \ell_{i,j,v}}
=
\frac{
q_{i,j}(v) - \mathbf{1}[v = y_{i,j}]
}{Bm} .
$$

The probability of the correct token goes up, all others go down. The chain rule
then carries the signal into the trainable draft parameters. Frozen
$W_{\mathrm{out}}$ and $E$ receive gradient but never update, since they are not in
the optimizer.

## Optional position weighting

With fixed per-position weights $\omega_j \ge 0$, the loss becomes

$$
\mathcal{L}_{\mathrm{CE}}^{(\omega)}
=
-\frac{
\sum_{i,j} \omega_j \log q_{i,j}(y_{i,j})
}{
\sum_{i,j} \omega_j
} .
$$

For the selector, the same idea applies only to positions with $\chi_{i,j} = 1$.
Weights that decrease with distance would concentrate on the nearest positions.
That looks reasonable, because acceptance decays with distance from the anchor,
but it is a description of a possible experiment and not a setting that was run.

## Related pages

- [Selector scoring](selector-scoring.md): the second loss works on a much smaller
  candidate set.
- [Total loss](total-loss.md): how the two terms combine.
