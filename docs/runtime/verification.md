# Greedy verification on the server

Inference starts here. In this runtime the largest proposal holds three future
tokens.

## Deterministic greedy case

Suppose $d_1, \ldots, d_\gamma$ are proposed. The target checks them on the same
conditional prefixes. The number of accepted tokens:

$$
J =
\max\left\{
j:\ d_r = \arg\max_v p_\phi\left(v \mid x_{<a}, x_a, d_{<r}\right)
\ \text{for all}\ r \le j
\right\}.
$$

At the first mismatch the rest of the draft is dropped, and the target writes the
correct token in its place. If the whole block was accepted, it may add one bonus
token.

In an ideal full cycle:

$$
N_{\mathrm{out,cycle}} = J + 1 .
$$

EOS, the requested length limit and replay details can reduce what the last cycle
actually emits, so the observed average is not exactly this formula.

## Why verification is exact

Greedy verification is not an approximation. The accepted tokens are exactly the
ones the target would have produced itself at those positions, given the same
prefix. That is what makes it safe to ship a draft whose only job is to guess, and
it is why draft quality shows up as the length of the accepted prefix rather than
as a change in the answers.

The property holds only under the same sampling regime. Under temperature
sampling the rule is different and probabilistic, see
[speculative sampling](speculative-sampling.md).
