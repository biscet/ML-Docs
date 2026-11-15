# Context window

## Which features the draft sees

Target features are taken strictly before the anchor, with no future correct
answers:

$$
f_{\max(0,a-C)}, \ldots, f_{a-1},
$$

where $C = 384$.

If the context is shorter than $C$, zeros are prepended on the left and closed off
by the attention mask. The draft never receives padding as if it were real
context.

## What the draft combines

- The anchor token, through the frozen embedding $E$.
- The preceding target features, through the projection $W_f$ and attention.

The split is deliberate. The anchor is the only token-level information in the
block preamble, everything else arrives as continuous states. Future positions of
the block carry MASK embeddings, not labels.

## What a fixed window implies

- Context longer than 384 positions is truncated on the left, so the closest
  context survives.
- A model trained with $C = 384$ is specialised to that horizon. Evaluating it
  with a much longer context would not test what was trained.
- Long prompts cost the same 384 positions as short ones. That is why the
  [storage estimate](../workflow/feature-storage.md) works from $P + G$ and not
  from context width.

## Related pages

- [Attention](../architecture/attention.md): how key and value pairs are formed
  from this window.
- [Anchors and masked blocks](anchors-and-blocks.md): what the block itself holds.
