# Total loss

The objective actually optimised in Stage-2:

$$
\boxed{
\mathcal{L} =
\mathcal{L}_{\mathrm{CE}}
+ 0.5\,\mathcal{L}_{\mathrm{sel}}
}
$$

The weight is fixed at 0.5 and was not scheduled.

## Arithmetic check

$$
3.319237010553479
+ 0.5 \cdot 1.0976521242409945
= 3.868063072673976 .
$$

The saved validation loss is about 3.86806307. Differences in the last digits come
from float arithmetic and from per-batch aggregation, not from a different
objective.

## Perplexity of the head

For the main head on these evaluation positions:

$$
\operatorname{PPL}_{\mathrm{head}}
=
\exp(\mathcal{L}_{\mathrm{CE}})
\approx
\exp(3.319237)
\approx 27.64 .
$$

Two cautions:

- The exponential of the total loss, which includes the selector term, is not a
  perplexity. It would mix a full-vocabulary quantity with a 16-way conditional
  one.
- Even the head's perplexity refers to the selected anchor blocks, not to a
  corpus-wide language-modelling evaluation.

## Uniform position weights

Every position of a block had the same weight in this run. There was no
exponential decay by distance from the anchor. The
[weighted variant](cross-entropy.md#optional-position-weighting) is a proposal,
not a measurement.

## Why two terms

The full cross-entropy teaches the head to put the right token somewhere near the
top of the distribution, which is what makes the candidate list usable at all. The
selector loss teaches the ordering inside that list, which is what runtime
verification walks.

Neither term covers the other. A head with perfect ordering but the gold token at
rank 40 gives the selector nothing to work with. A head that puts the gold token
first for the wrong reasons will not hold up on positions the selector has not
seen.
