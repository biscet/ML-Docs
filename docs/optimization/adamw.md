# AdamW

For optimizer step $k$:

$$
m_k = \beta_1 m_{k-1} + (1 - \beta_1)\bar g_k,
$$

$$
v_k = \beta_2 v_{k-1} + (1 - \beta_2)\bar g_k^2,
$$

$$
\hat m_k = \frac{m_k}{1 - \beta_1^k},
\qquad
\hat v_k = \frac{v_k}{1 - \beta_2^k},
$$

$$
\boxed{
\theta_k
=
(1 - \eta_k \lambda_{\mathrm{wd}})\theta_{k-1}
-
\eta_k \frac{\hat m_k}{\sqrt{\hat v_k} + \varepsilon}
}
$$

All operations on vectors are element-wise.

## Hyperparameters

$$
\beta_1 = 0.9,
\quad
\beta_2 = 0.999,
\quad
\varepsilon = 10^{-8},
\quad
\lambda_{\mathrm{wd}} = 0.01 .
$$

Weight decay is decoupled from the moments: it multiplies the previous weights and
never enters $m_k$ or $v_k$. This trainer sets it for both parameter groups.
Equations and conventions follow
[PyTorch AdamW](https://docs.pytorch.org/docs/2.8/generated/torch.optim.AdamW.html).

## Why bias correction matters in a short run

The run did 56 updates. With so few steps an uncorrected second moment is still a
small fraction of its asymptotic value, so step sizes come out far larger than
intended at exactly the moment the run is most sensitive. Bias correction is not
a formality here. It is what makes 56 steps behave like Adam instead of a badly
tuned sign-SGD.

## State cost

Each parameter needs two FP32 moments, and that dominates the
[optimizer-state footprint](../workflow/training-state.md): about $8W$ bytes for
moments plus $4W$ for master weights.
