# Dynamic convolutions

DFlash2 adds short convolutions whose coefficients are produced per token. A
simplified form of one of them:

$$
\operatorname{Conv}(z)_{t,g,c}
=
\sum_{r=0}^{1}
\left(
w_{r,g,c} + d_{t,r,g}
\right) z_{t-r,g,c}.
$$

- Two taps: the current position and the previous one.
- Channels are grouped, 16 per group.
- $w$ are trainable base coefficients.
- $d$ come from the token state through a linear projection.
- At the start of a block the missing previous position becomes zero.

## Why the coefficients move

A fixed convolution blends the same way everywhere. Here $d_{t,r,g}$ lets the
token choose how much to borrow from its predecessor. A position in the middle of
a repetitive continuation can copy forward, a position after a topic change can
close the tap.

## Where they sit

There are convolutions before and after attention, and before and after the MLP.
A post-convolution gets its coefficients during the preparation stage of its
sub-layer. They are not necessarily recomputed from that sub-layer's output.

## What this costs

These convolutions tie neighbouring positions together. Their parameters live in
the same training graph as everything else, but they have no labels of their own
and learn only through the block's token losses. An error at one position can
also reach its neighbours within the same forward pass, so per-position accuracy
is not independent across $j$.
