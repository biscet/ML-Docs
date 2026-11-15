# Speculative sampling

This is the general algorithm, not a description of the greedy benchmark that was
run. For that, see [greedy verification](verification.md).

Let $Q_j$ be the distribution the draft actually proposes from, and $P_j$ the
target distribution under the sampling settings in use. For a proposal
$d_j \sim Q_j$:

$$
\alpha_j =
\min\left(1, \frac{P_j(d_j)}{Q_j(d_j)}\right).
$$

The token is accepted with probability $\alpha_j$. On rejection the corrective
distribution is

$$
R_j(v)
=
\frac{\max\left(P_j(v) - Q_j(v), 0\right)}
{\sum_u \max\left(P_j(u) - Q_j(u), 0\right)} .
$$

A candidate that cannot be proposed has $Q_j(v) = 0$.

## What the formulas require

The distributions have to be the real proposal distribution, filters included:
top-k, top-p, temperature, repetition penalties. Not an idealised softmax that was
never applied. Using a clean $Q$ while sampling from a filtered one breaks the
equality of the output distribution, and the error stays silent.

This is a correctness condition for rejection sampling. It does not prove that the
C++ runtime meets it in every mode. In the executed comparison speculative and
no-draft answers often differed, and the cause has not been pinned down. See
[What formulas cannot tell](../caveats.md).

The scheme itself comes from
[Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192).
