# Attention

## The general form

For one attention head:

$$
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^{\top}}{\sqrt{d_h}} + M
\right) V .
$$

$M$ closes off unavailable positions, and $d_h = 128$.

## Where queries, keys and values come from

Queries come from the block states. Keys and values come from the target context
and the current block states together:

$$
Q = Z W_Q^{\top},
\qquad
K = [U;Z] W_K^{\top},
\qquad
V = [U;Z] W_V^{\top}.
$$

Rows of $Z$ and $U$ correspond to positions, and the semicolon joins rows. The
code also applies a separate RMS normalisation to $Q$ and $K$ and uses rotary
positional embeddings. Both are left out above so that the information exchange
stays visible.

There are 32 query heads and 8 key/value heads, so each key/value head serves four
query heads.

## Rotary positions

One rotation of a coordinate pair:

$$
\begin{bmatrix}
q'_i \\ q'_{i + d_h/2}
\end{bmatrix}
=
\begin{bmatrix}
\cos\omega_{p,i} & -\sin\omega_{p,i}\\
\sin\omega_{p,i} & \cos\omega_{p,i}
\end{bmatrix}
\begin{bmatrix}
q_i \\ q_{i + d_h/2}
\end{bmatrix},
\qquad
\omega_{p,i} = p\,\Theta^{-2i/d_h}.
$$

Here $p$ is the absolute position and $\Theta = 10^{7}$. The pairs come from the
two halves of the head, as in the Qwen rotate-half variant in use. Other
implementations may store the same pairs in a different order, which changes
indices but not the rotation.

## Why the block does not leak

Attention inside the block can look at other masked positions. That does not
expose the correct future tokens, because those positions hold MASK embeddings
rather than gold tokens. The only real token in the block is the anchor, and the
anchor is already known.

This is why the block can be predicted in parallel instead of one position at a
time. The mask, not the causal order, hides the targets.
