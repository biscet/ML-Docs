# Gradient clipping

After backward, once the AMP scale is removed, the global norm is computed:

$$
\|g\|_2
=
\sqrt{\sum_p \|g_p\|_2^2} .
$$

If it exceeds one, the gradient is scaled down:

$$
\bar g
=
g \cdot
\min\left(1, \frac{1}{\|g\|_2}\right).
$$

A zero norm stays zero. The library adds a small guard against division by zero,
which changes nothing in any real case.

The threshold is 1.0, applied to the draft's parameters as one group.

## Why bother

Two failure modes. A single long or highly repetitive block can produce a much
larger gradient than its neighbours, and one such batch can undo thousands of
small updates. And with a base learning rate of $2.5\cdot10^{-6}$ the update is
already tiny, so an unbounded gradient would swamp it in one step instead of
nudging it.

Clipping runs after unscaling, so the norm being measured is the real one. Doing
it in the other order would make the effective threshold depend on the current
loss scale.
