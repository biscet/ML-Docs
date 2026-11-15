# Output head and top-16

## Logits

Let $z_{i,j}$ be the draft output for record $i$ and future position $j$. The
frozen output head of the target maps it to logits:

$$
\ell_{i,j} = W_{\mathrm{out}} z_{i,j},
\qquad
\ell_{i,j} \in \mathbb{R}^{V}.
$$

This trainer used a plain `F.linear`, with no extra temperature and no softcap
here. The head is frozen, so the logit scale is the target's scale. The draft
cannot rescue a bad ranking by stretching logits.

## Full-vocabulary probabilities

$$
q_{i,j}(v) =
\frac{\exp \ell_{i,j,v}}
{\sum_{u=1}^{V} \exp \ell_{i,j,u}} .
$$

For numerical stability the maximum logit can be subtracted first:

$$
q(v) =
\frac{\exp(\ell_v - \ell_{\max})}
{\sum_u \exp(\ell_u - \ell_{\max})} .
$$

The result is mathematically identical and the risk of overflow is lower. With
$V = 248{,}320$ this is not cosmetic, since the exponent of a raw logit often
falls outside the FP32 range.

## The candidate list

The selector works over a shortlist, not the vocabulary:

$$
\mathcal{C}_{i,j}
=
\operatorname{TopK}_{v} \ell_{i,j,v},
\qquad
K = 16 .
$$

The list is built from the draft's own logits. It does not come from DeepSeek and
the target does not supply it. The target only shows up later, through the gold
token when the loss is computed.

## Two consequences

- If the gold token is outside the list, no selector can recover it. Those are
  the "gold missing" positions in [offline metrics](../validation/offline-metrics.md).
- The full cross-entropy and the selector loss see different subsets of
  positions, which is why both are kept. See
  [total loss](../objective/total-loss.md).
