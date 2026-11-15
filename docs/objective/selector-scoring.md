# Selector scoring

The selector looks at the current candidate $v$ and at the previous token $r$:

$$
s_{i,j}(v \mid r)
=
\ell_{i,j,v}
+
\sum_{k=1}^{R}
A_{r,k}
\left(W_g z_{i,j}\right)_k
B_{v,k} .
$$

Here $R = 256$.

- $A$ is the predecessor codebook.
- $B$ is the successor codebook.
- $W_g z$ decides which of those associations matter here.
- The second term can reorder the head's original top-16.

## What each factor does

The product $A_{r,k} B_{v,k}$ is large when predecessor $r$ and candidate $v$
both load onto the same latent association $k$. The gate then says how much that
association matters at this position. Language models are full of strong local
transitions: a quote opening, a bracket closing, a function name followed by a
parenthesis. This term lets the draft use them without widening the vocabulary
head.

## Worked example

Two candidates compete:

| Candidate | Raw logit | Link correction | Total |
| --- | ---: | ---: | ---: |
| First | 2.0 | -0.8 | 1.2 |
| Second | 1.6 | +0.3 | 1.9 |

Without the selector the first one wins. After the correction the second one does.
Its probability within the pair:

$$
\frac{e^{1.9}}{e^{1.2} + e^{1.9}} \approx 0.6682 .
$$

## Training versus generation

During training the predecessor comes from the gold continuation:

$$
r_{i,j} = x_{a_i + j - 1} .
$$

That is teacher forcing for the selector link.

During greedy generation:

$$
\hat y_j
=
\arg\max_{v \in \mathcal{C}_j} s_j(v \mid \hat y_{j-1}),
\qquad
\hat y_0 = x_a .
$$

From the second position on, the chosen token is reused. The Python model and the
verified runtime both pick sequentially from the current scores. Neither searches
all $16^{m}$ paths, so neither is guaranteed to find the best sequence under the
selector.

## Related pages

- [Selector loss](selector-loss.md): how this score becomes a distribution and a
  loss.
- [Output head and top-16](../architecture/output-head.md): where
  $\mathcal{C}_j$ comes from.
