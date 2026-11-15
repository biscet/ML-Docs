# Averaging over anchors

With $A$ anchors, block losses can be averaged:

$$
\widehat{\mathcal{L}}_A
=
\frac{1}{A}\sum_{r=1}^{A} \mathcal{L}(\theta; a_r) .
$$

For identically distributed points:

$$
\mathbb{E}\left[\widehat{\mathcal{L}}_A\right]
=
\mathbb{E}_a\left[\mathcal{L}(\theta; a)\right] .
$$

On average the same objective is optimised, but more places in the answer get
covered.

Summing without dividing by $A$ would change the gradient scale and mix the effect
of coverage with a change in effective learning rate. That is why the
normalisation belongs to the definition.

## Variance

For independent estimates:

$$
\operatorname{Var}\left(\widehat{\mathcal{L}}_A\right)
=
\frac{\sigma^2}{A} .
$$

Windows inside one answer are correlated. With constant pairwise correlation
$\rho$:

$$
\operatorname{Var}\left(\widehat{\mathcal{L}}_A\right)
=
\frac{\sigma^2}{A}\left(1 + (A - 1)\rho\right) .
$$

So eight points are not eight independent tasks. And repeating the same point $A$
times changes nothing at all in the deterministic case:

$$
\frac{1}{A}\sum_{r=1}^{A}\mathcal{L}(\theta; a)
=
\mathcal{L}(\theta; a) .
$$

## What more anchors would buy

Coverage of the answer, and at most a factor $A$ less gradient noise, less once
correlation is counted. They do not create new data and they do not multiply the
number of independent examples. The
[practical count](../validation/training-positions.md) of 854 labels would grow
roughly linearly in $A$ while the effective sample size grows slower.
