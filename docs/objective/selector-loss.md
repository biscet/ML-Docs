# Selector loss

## Which positions count

The selector can only be rewarded where the correct token is in the candidate
list. Define

$$
\chi_{i,j}
=
\mathbf{1}[y_{i,j} \in \mathcal{C}_{i,j}],
\qquad
M_{\mathrm{hit}} = \sum_{i,j} \chi_{i,j} .
$$

Positions with $\chi_{i,j} = 0$ are left out of this term, not counted as errors.
Counting them as errors would push mass toward tokens that are not in the list,
and the softmax over candidates cannot represent that.

## The distribution over candidates

$$
\tilde q_{i,j}(v \mid r)
=
\frac{\exp s_{i,j}(v \mid r)}
{\sum_{u \in \mathcal{C}_{i,j}} \exp s_{i,j}(u \mid r)} .
$$

The normalisation runs over 16 candidates, not over $V$. These probabilities are
therefore not comparable with the full-vocabulary $q_{i,j}(v)$ and must not be
mixed into the same likelihood.

## The loss

$$
\mathcal{L}_{\mathrm{sel}}
=
-\frac{1}{M_{\mathrm{hit}}}
\sum_{i,j:\,\chi_{i,j}=1}
\log \tilde q_{i,j}(y_{i,j} \mid r_{i,j}) .
$$

If $M_{\mathrm{hit}} = 0$, the code sets this term to zero. A token that is absent
cannot be selected, so the shortlist offers nothing to learn from. That is not a
reason to drop the full cross-entropy, which still trains the head behind the
shortlist.

## Related pages

- [Selector scoring](selector-scoring.md): the scores inside the softmax.
- [Total loss](total-loss.md): the weight this term gets.
- [Offline metrics](../validation/offline-metrics.md): recall@16 bounds this loss.
