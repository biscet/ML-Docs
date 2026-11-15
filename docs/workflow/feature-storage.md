# Feature storage

## Cost per token

One token stores eight vectors of 2,048 values in FP16:

$$
8 \cdot 2048 \cdot 2 = 32768\ \text{bytes} = 32\ \text{KiB}.
$$

For a sequence of $N$ tokens:

$$
F_{\mathrm{bytes}} = N \cdot 32768 .
$$

Example, a 5,000-token prompt and a 320-token answer:

$$
F = 5320 \cdot 32768
= 174{,}325{,}760\ \text{bytes}
= 166.25\ \text{MiB}.
$$

A single long record can cost more than a hundred megabytes on disk. Capture is
cheap in compute per token and expensive in bytes, so planning happens in advance
rather than at write time.

## Planning estimate

The planner uses a conservative figure:

$$
\widehat{F}_i
=
\left(P_i + G_{\max} + 1\right) \cdot 32768 .
$$

A shard must satisfy

$$
\sum_{i \in \text{shard}} \widehat{F}_i \le F_{\mathrm{budget}} .
$$

Records per shard are capped separately. In the executed plan the feature budget
of a train shard was up to 8 GiB. That is not a limit on total occupied space:
validation features, checkpoints and exports sit outside it.

## Why the estimate is conservative

It assumes the answer reached $G_{\max}$ and adds one token of slack. A record that
stopped early still reserves as if it had not. Erring this way keeps a shard from
overflowing later, when the remaining options are truncating features or
re-sharding.
