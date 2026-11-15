# How the target creates training data

The autoregressive model defines a distribution over the next token:

$$
p_\phi(x_t=v\mid x_{<t})
=
\operatorname{softmax}(\ell^T_t)_v .
$$

The capture utility picks greedily:

$$
x_t=\arg\max_{v\in\{1,\ldots,V\}}\ell^T_{t,v} .
$$

The target reads the prompt, then generates a continuation. Its own token IDs
become the draft's labels. This is hard-label training: the target's full
probability distribution never enters the loss.

In particular, this run did not use a KL loss such as

$$
\sum_v p_\phi(v)\log\frac{p_\phi(v)}{q_\theta(v)} .
$$

That would be a valid distillation objective, but it is not what was executed.
The practical difference: only the argmax token carries information, so a
position where the target was nearly torn between two tokens looks exactly like a
position where it was certain.

## Why capture instead of generating online

Capturing once separates the expensive part (target generation) from the cheap
part (draft updates):

- the target runs without gradients and its weights stay frozen;
- token IDs and hidden features are written to disk and re-read by the trainer;
- the same shard can be traversed with different anchor choices.

The price is that the draft only sees the sampled continuation, never the
alternatives the target did not emit.

## Related pages

- [Feature capture](feature-capture.md): which hidden states are kept.
- [Feature projection](feature-projection.md): how 16,384 numbers per token
  become 2,048.
- [Training positions](../validation/training-positions.md): how many labels
  this produced in practice.
