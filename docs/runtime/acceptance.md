# Acceptance rate

For cycles $r = 1, \ldots, T$, let $D_r$ be the number of proposals and $J_r$ the
number accepted.

Share of accepted draft tokens:

$$
\operatorname{AcceptanceRate}
=
\frac{\sum_r J_r}{\sum_r D_r} .
$$

Average length of a full cycle, bonus token included:

$$
\overline{L}_{\mathrm{cycle}}
\approx
1 + \frac{\sum_r J_r}{T} .
$$

The verified runtime prints exactly
`1 + n_draft_accepted / n_draft_verif_steps`. Keep the denominator meaning and the
boundary handling identical when comparing modes.

## Through per-position acceptance

For a fixed proposal length $\gamma$:

$$
\mathbb{E}[J]
=
\sum_{k=1}^{\gamma}\Pr(J \ge k).
$$

Let $a_j$ be the conditional probability of accepting position $j$ given that all
earlier positions were accepted. Then

$$
\Pr(J \ge k) = \prod_{j=1}^{k} a_j .
$$

With equal conditional probabilities $a$:

$$
\mathbb{E}[L_{\mathrm{cycle}}]
\approx
1 + \sum_{k=1}^{\gamma} a^k .
$$

For $a = 0.7$ and $\gamma = 3$:

$$
1 + 0.7 + 0.49 + 0.343 = 2.533 .
$$

## Two traps

- This $a$ is not the accepted/drafted ratio from the first formula. That ratio
  mixes positions, EOS truncation and retries. $a$ is per-position and
  conditional.
- Offline accuracy cannot stand in for $a$ and be reported as a server
  measurement. The procedures differ in predecessor handling, prefix coupling and
  the set of scored positions.
