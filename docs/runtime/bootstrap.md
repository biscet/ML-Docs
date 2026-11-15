# Paired bootstrap

The resampling unit was the task, together with both repeats. In each of 5000
draws the same task indices were used for the parent and for the candidate:

$$
v_z^{*}
=
\frac{\sum_{i \in I^{*}} N_{i,z}}
{\sum_{i \in I^{*}} T_{i,z}},
\qquad
\Delta^{*}
=
100\left(\frac{v_c^{*}}{v_p^{*}} - 1\right).
$$

The 95% bounds are empirical quantiles 0.025 and 0.975 of $\Delta^{*}$:

$$
[\,0.0070\%,\ 0.2549\%\,].
$$

## Why pair by task

Averaging repeats per task first removes repeat noise from the resampling unit.
Using one index set for both modes removes the variance of which tasks happen to be
fast: a slow task is slow for both modes and cancels in the ratio. An unpaired
bootstrap over single requests would give a much wider interval that mostly says
how different the tasks are.

## What the interval is not

The interval describes differences between tasks in this particular set. Modes ran
sequentially, and bootstrapping does not remove temperature drift or time-of-day
effects. A narrowly positive interval therefore does not establish a robust
general gain.

It also says nothing about correctness. A mode can be faster and still answer
differently, and that is a separate question from throughput.
