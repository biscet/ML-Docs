# Optimizer state and checkpoint memory

A rough estimate for $W$ trainable parameters:

$$
\underbrace{4W}_{\text{current FP32 weights}}
+
\underbrace{2W}_{\text{best FP16 weights}}
+
\underbrace{4W + 4W}_{\text{two Adam moments}}
\approx 14W\ \text{bytes}.
$$

With $W = 526{,}251{,}520$ that is about 6.862 GiB before bookkeeping.

## Why two copies exist

The run keeps the FP32 master weights the optimizer updates, and separately an FP16
copy of the best checkpoint so far. Without the second copy, best would have to be
reconstructed by re-evaluating and re-saving, or lost once the run moves past its
minimum. This run did move past it: the minimum sat at 9090 while training went on
to 9130.

## Peak disk usage

With atomic checkpoint replacement the old and new file coexist for a while.
Working space should cover roughly

$$
F_{\mathrm{validation}}
+
F_{\mathrm{train\ shard}}
+
2F_{\mathrm{checkpoint}}
+
F_{\mathrm{GGUF}}
+
F_{\mathrm{other}} .
$$

The estimate does not replace a real disk check. Metadata, allocated blocks, hard
links and other processes can change the picture, sometimes a lot.
