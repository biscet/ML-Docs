# Prefix proxy

The prefix proxy counts the correct run from the start of the block:

$$
J_i^{\mathrm{offline}}
=
\sum_{j=1}^{m}
\prod_{r=1}^{j} c_{i,r} .
$$

Example:

```text
Correct per position: [1, 1, 0, 1, 1, 0, 1]
Accuracy:             5 / 7
Prefix:               2
```

After the first error the remaining correct tokens no longer extend the prefix. A
block of `[1, 1, 1, 0, 0, 0, 0]` has lower accuracy but a prefix of three.

Mean over examples:

$$
\operatorname{PrefixProxy}
=
\frac{1}{B}\sum_i J_i^{\mathrm{offline}} .
$$

## Reading the value

With $b = 8$ the maximum is seven. The reported 2.621 does not mean the server
accepted 2.621 of its three draft tokens on average. Those are different
procedures on different data.

The proxy is still the closest offline analogue of what verification rewards,
since verification also stops at the first mismatch. Its weakness is that it
ignores the feedback loop: a wrong token at position one changes the input for
position two, and a teacher-forced proxy never sees that.
