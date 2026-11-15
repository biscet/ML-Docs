# Offline metrics

The validator checks the selector with the correct predecessor token. Write the
token chosen under that check as $\hat y_{i,j}^{\mathrm{TF}}$.

$$
c_{i,j} = \mathbf{1}[\hat y_{i,j}^{\mathrm{TF}} = y_{i,j}] .
$$

## Token accuracy

$$
\operatorname{Accuracy}
=
\frac{1}{Bm}\sum_{i,j} c_{i,j} .
$$

## Top-16 recall

$$
\operatorname{Recall@16}
=
\frac{1}{Bm}\sum_{i,j} \chi_{i,j} .
$$

Selection accuracy cannot exceed the share of positions where gold is in the list
at all. With a shared denominator the errors split exactly:

$$
\begin{aligned}
\text{correctly selected} &= \operatorname{Accuracy},\\
\text{gold present, other chosen} &=
\operatorname{Recall@16} - \operatorname{Accuracy},\\
\text{gold absent} &= 1 - \operatorname{Recall@16}.
\end{aligned}
$$

For the best checkpoint:

- 50.45% of tokens correctly selected;
- 23.38% of positions where gold is present but another candidate won;
- 26.17% of positions where gold never made the top-16.

## Conditional accuracy

Accuracy given that gold is available:

$$
\frac{0.5044643}{0.7382813} \approx 0.6833 .
$$

That is about 68.33% on this offline slice. It is not a separate measurement of
runtime acceptance, and it is not directly comparable with per-position
conditional tables reported for a different model in the paper.

## What it measures

The metric scores the selector with teacher-forced predecessors, one position at
a time. It does not tell you what happens when an earlier position in the block
was wrong, because generation then feeds a different predecessor. It is also
computed only on the validator's fixed windows, described in
[validation windows](validation-windows.md).

So the conditional figure is an upper bound on the "gold available" case, not a
prediction of end-to-end block acceptance.
