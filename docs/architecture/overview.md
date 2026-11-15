# Draft layer stack

The draft has six decoder layers. Each one combines attention, a SwiGLU MLP,
residual connections and the extra dynamic convolutions DFlash2 adds.

## Order inside a layer

1. dynamic convolution before attention;
2. attention over the block states and the target context;
3. dynamic convolution after attention;
4. dynamic convolution before the MLP;
5. the SwiGLU MLP;
6. dynamic convolution after the MLP.

Residual connections carry the block states around each sub-layer, so a
convolution modulates the signal instead of replacing it. The
[convolutions page](convolutions.md) explains why post-convolution coefficients
are prepared at the start of their sub-layer.

## Inputs and outputs

| Object | Shape per record | Origin |
| --- | --- | --- |
| Block states $Z$ | $b \times 2048$ | anchor embedding plus MASK embeddings, then the layer stack |
| Context states $U$ | $C \times 2048$ | projected target features |
| Block logits | $b \times V$ | frozen target output head |

Only the last $m$ rows of the block are trained. The anchor row is known input,
not a prediction.

## Parameter budget

The stack is small next to the target but not trivial: about 526 million
trainable parameters. The input projection alone holds
$2048 \times 16384 \approx 33.6$ million weights. Everything else, meaning the
embedding table, the output head and the captured features, is frozen or reused.

## Related pages

- [Attention](attention.md)
- [MLP](mlp.md)
- [Dynamic convolutions](convolutions.md)
- [Output head and top-16](output-head.md)
