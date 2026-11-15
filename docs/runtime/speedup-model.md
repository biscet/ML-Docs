# Why acceptance is not speedup

Let:

- $t_{\mathrm{AR}}$ be the time to decode one token normally;
- $t_{\mathrm{draft}}$ be the time to propose a block;
- $t_{\mathrm{verify}}$ be the time for the target to verify the block;
- $t_{\mathrm{overhead}}$ cover service work and state rollback.

A crude stationary model:

$$
\boxed{
\operatorname{Speedup}
\approx
\frac{
\mathbb{E}[L_{\mathrm{cycle}}]\, t_{\mathrm{AR}}
}{
t_{\mathrm{draft}} + t_{\mathrm{verify}} + t_{\mathrm{overhead}}
}
}
$$

## Reading the ratio

The numerator grows with accepted tokens per cycle. The denominator grows with
everything needed to get them. A draft can guess better while spending too much
time doing it. A bigger block can guess more tokens and still end up slower than a
smaller one, because verification scales with width and long blocks are less
likely to survive intact.

The formula explains the trade-off. It does not predict the outcome. Real times
have to be measured, which is what the [benchmark](benchmark.md) is for.

## Two things it implies for tuning

- Block width is a joint choice of quality and cost, not a quality knob. Widening
  it moves both terms in the denominator and adds a bonus token only when the
  whole block survives.
- Better offline ranking helps only if it lengthens the accepted prefix. Accuracy
  gained after the first error does not move $\mathbb{E}[L_{\mathrm{cycle}}]$ at
  all.
