# What DFlash2 trains

| Model | Symbol | State in this run | Job |
| --- | --- | --- | --- |
| Base model (target) | $\phi$ | Frozen | Answers, and supplies tokens and hidden features as training data |
| Draft model | $\theta$ | Trained | Predicts the target's next tokens in blocks |

The target already knows how to answer. The draft is not being taught the task
itself. It learns to anticipate one frozen model's continuations, so that at
inference the target can check several tokens in a single forward pass.

A normal fine-tune would change $\phi$. Here it does not, and that one decision
shapes the rest of the trainer:

- Labels are the target's own greedy tokens, not human references.
- Input features are captured once from the target and reused.
- The draft can only become a cheaper approximation of the teacher's
  next-token choices. It cannot beat the teacher at the task.

## What is trainable

The whole draft stack moves, including:

- the input projection $W_f$ and its RMSNorm gain $\gamma$;
- six decoder layers: attention, SwiGLU, dynamic convolutions, residuals;
- the selector tables $A$, $B$ and the gate projection $W_g$.

Two large objects stay frozen and never enter the optimizer:

- the embedding table $E$, which turns anchor token IDs into inputs;
- the output head $W_{\mathrm{out}}$, which turns draft hidden states into logits.

Reusing the target's embedding and head keeps the vocabulary aligned at no extra
parameter cost, and it puts the draft's logits in exactly the space the target
verifies.

## The two prediction tasks

The draft is trained on two coupled objectives, both described in the
[Objective](../objective/cross-entropy.md) chapter:

1. Block prediction. From one known anchor token plus masked positions, predict
   the next $m = b - 1$ tokens of the target's continuation. This is a
   full-vocabulary cross-entropy over a short block.
2. Candidate re-ranking. At each of those positions, reorder the draft's own
   top-16 list with a selector that sees the previous token. This is a
   cross-entropy over the candidate list only.

The second task exists because runtime verification does not run a softmax over
the vocabulary. It walks the shortlist. A draft that puts the right token first
inside its own shortlist is worth more than one with slightly lower
full-vocabulary loss but worse ordering.

## Scope

Everything below describes this trainer and this run. Coefficients, metric
definitions and acceptance accounting differ between implementations, so the
numbers are evidence about one configuration, not about DFlash2 in general.
