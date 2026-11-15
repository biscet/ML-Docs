# Feature projection

Captured features are 16,384 values wide, far too much per position for a
526M-parameter draft to use directly. One learned projection compresses them:

$$
u_t=\operatorname{RMSNorm}(W_f f_t),
\qquad
W_f\in\mathbb{R}^{2048\times16384}.
$$

## RMSNorm

For a vector $z$ of length $d$:

$$
\operatorname{RMSNorm}(z)_i
=
\gamma_i
\frac{z_i}
{\sqrt{\frac{1}{d}\sum_{j=1}^{d}z_j^2+\varepsilon}} .
$$

The gain $\gamma_i$ is trainable and the configuration uses $\varepsilon =
10^{-6}$. There is no mean subtraction, unlike LayerNorm, so the projection keeps
the offset of the feature vector and only normalises its scale.

## Frozen input, trainable projection

The captured $f_t$ carries no gradient, but the projection does, and its gradient
depends on the feature values:

$$
\frac{\partial\mathcal{L}}{\partial W_f}
=
\sum_t
\frac{\partial\mathcal{L}}{\partial(W_f f_t)}
f_t^{\top}.
$$

A frozen feature is therefore not an inert constant in the objective. The
position still influences the update through its context, even when its own token
is not a predicted label. What freezing removes is the path back into the target,
not the path into the draft's parameters.

## Related pages

- [Feature capture](feature-capture.md): where the 16,384 numbers come from.
- [Layer stack](../architecture/overview.md): what consumes $u_t$.
