# MLP

Each of the six layers has a SwiGLU MLP:

$$
\operatorname{MLP}(z)
=
W_{\mathrm{down}}
\left(
\operatorname{SiLU}(W_{\mathrm{gate}}z)
\odot
W_{\mathrm{up}}z
\right),
$$

$$
\operatorname{SiLU}(x) = x\,\sigma(x).
$$

The intermediate width is 6144.

## What the gate does

The gate branch decides, per unit, how much of the up projection survives. Inside
a block of masked positions this works like a content-dependent filter. A
position with weak local context can be suppressed, while a position that looks
like a familiar continuation passes through almost unchanged.

The cost is a third weight matrix per layer compared with a plain two-matrix MLP.
That is part of why the draft sits at 526 million parameters rather than well
below.

## Position in the layer

The MLP is preceded and followed by [dynamic convolutions](convolutions.md). The
convolution after the MLP uses coefficients prepared for that sub-layer, not a
fresh projection of the MLP's own output.
