# Full-vocabulary forward KL

Hard token CE uses one correct token $y$ and the draft distribution $q$:

$$
L_{\mathrm{CE}}=-\log q(y).
$$

Its gradient compares $q$ with a one-hot label. It does not preserve Whittle's
relative probabilities for the other tokens. The KL experiment captured the
target distribution $p$ over all 248,320 tokens, with temperature 1.

## Capture and alignment

Each context supplied eight anchors with three future positions each:
24 distribution rows. Their FP16 table occupied

$$
24\cdot248\,320\cdot2=11\,919\,360\ \text{bytes},
$$

about 11.37 MiB before metadata. Only those 24 positions were stored, not every
position in the answer. Each row retained the full vocabulary, without top-k
truncation or a tail bucket.

For a label at absolute token position $t$, capture saved the target distribution
after token $t-1$. An off-by-one shift would train against the wrong next token.

Captured FP16 log probabilities were normalized again after loading:

$$
\log p=\operatorname{logsoftmax}(\mathrm{captured\ logp}),
\qquad
\log q=\operatorname{logsoftmax}(z_{\mathrm{draft}}).
$$

## Objective

The forward direction was Whittle to draft:

$$
D_{\mathrm{KL}}(p\Vert q)=\sum_v p_v(\log p_v-\log q_v),
$$

$$
L_{\mathrm{train}}
=D_{\mathrm{KL}}(p\Vert q)+0.5L_{\mathrm{selector\ CE}}.
$$

The hard-CE control replaced KL with token CE and kept selector CE.
Soft targets carry more distribution information than a single hard label;
that does not guarantee a better trained draft.

See [CE vs KL](../experiments/ce-kl.md) for the measured comparison.
Archive sources: `experiments/07-ce-kl-partial/scripts/soft_targets.py`,
`capture_soft.cpp` and `verify_soft_capture.py`.
