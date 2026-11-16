# Uniform vs D-PACE

The paired experiment tested whether giving early positions more weight would
improve the correct prefix. Both branches started from the same v1.2.0 GGUF.

## Shared budget

Each branch used 128 contexts, 64 RU and 64 EN, with the same anchors and four
passes. Settings were batch 4, eight anchors, width 4, LR 2.5e-6 and warmup 16.
Each branch completed 128 updates and 512 context visits.

Direct token-label presentations per branch:

$$
128\cdot4\cdot8\cdot3=12\,288.
$$

A preliminary D-PACE smoke run was outside this paired budget.

## Loss definitions

Let $n_i$ be token NLL and $u_i$ selector NLL at future position $i$.
“Covered” means the correct token is in the draft's top-16.

$$
L_{\mathrm{uniform}}
=\operatorname{mean}(n_i)
+0.5\operatorname{mean}_{i:\mathrm{covered}_i}(u_i).
$$

The local D-PACE branch formed smoothed confidence, prefix confidence and weights:

$$
c_i=0.5+0.5e^{-n_i},
\qquad
p_j=\prod_{i=1}^{j}c_i,
\qquad
w_i=\sum_{j=i}^{m}p_j.
$$

Here $m$ is the number of future positions. Weights were detached from the
gradient. A fully confident three-token block gives weights [3, 2, 1].

Using $B$ blocks per microbatch, this implementation computed

$$
L_{\mathrm{D\text{-}PACE}}
=\frac{1}{B}\sum_{b,i}w_{b,i}n_{b,i}
+\frac{0.5}{B}\sum_{b,i}w_{b,i}u_{b,i}
\mathbf{1}[\mathrm{covered}_{b,i}].
$$

The denominator was the number of blocks, not the sum of weights. D-PACE
therefore changed both relative position weights and the overall loss scale.
Equal LR did not isolate weighting from that scale change.

## Result

| Metric | Shared parent | Selected uniform | Selected D-PACE |
| --- | ---: | ---: | ---: |
| Unweighted diagnostic loss | 2.601195 | 2.592215 | 2.601169 |
| Self-conditioned token accuracy | 61.9141% | 62.1745% | 62.0443% |
| Correct-prefix proxy | 1.689453 | 1.705078 | 1.697266 |
| Top-16 recall | 84.9609% | 85.0911% | 84.9609% |

D-PACE did not beat uniform on the selected offline prefix in this small test.
Other data, budgets or weight normalization would require a separate comparison.

Archive source: `experiments/03-dpace-paired/scripts/position_loss.py`.
