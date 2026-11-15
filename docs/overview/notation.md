# Notation

Token indices start at zero. $x_t$ is a token ID, not a character, a word or a
line of code. A Russian word or one line of source code can take several tokens.

| Symbol | Meaning | In this trainer |
| --- | --- | --- |
| $\phi$ | Base-model weights, the target | Frozen Q5 model |
| $\theta$ | Trainable draft weights | 526,251,520 parameters |
| $V$ | Vocabulary size | 248,320 |
| $P$ | Number of prompt tokens | Depends on the record |
| $G$ | Number of new target tokens | At most 320 in Stage-2 |
| $N = P + G$ | Length of the captured sequence | Prompt plus answer |
| $a$ | Index of the anchor token | One per record |
| $b$ | Block width, anchor included | 4 or 8 |
| $m = b - 1$ | Predicted tokens in a block | 3 or 7 |
| $B$ | Records in a mini-batch | Up to 4 |
| $A$ | Anchors per record | 1 in the executed pass |
| $C$ | Window of target features for the draft | 384 positions |
| $K$ | Selector candidate-list size | 16 |

## Four counters that get mixed up

- $G$: how many tokens the target generated.
- $m$: how many future positions one training block predicts.
- $A$: how many such blocks came from one answer.
- Optimizer updates: how many times the weights actually changed.

Only the last one counts weight changes. One update can consume several records,
several anchors and several predicted positions per record. The
[854 direct labels](../validation/training-positions.md) of this run are not 854
updates.

## Reading conventions

- $\arg\max$ returns the argument with the largest value.
- $\mathbf{1}[\text{condition}]$ is one if the condition holds, zero otherwise.
- $\odot$ is element-wise multiplication.
- $\mathbb{E}$ is the expectation.
- $\sum$ adds values, $\prod$ multiplies them.
- $\log$ is the natural logarithm.
- The selector score $s_{i,j}(v \mid r)$ belongs to candidate $v$ at position $j$
  of record $i$, given predecessor $r$.
- Superscripts in brackets such as $\bar h_t^{(\ell)}$ are layer indices.
  Subscripts such as $x_t$ are positions.

## Where symbols come from

This page defines them once. Later pages reuse them:

| Symbols | Used in |
| --- | --- |
| $P, G, N, a, b, m, B, A$ | [anchors](../data/anchors-and-blocks.md), [validation](../validation/validation-windows.md) |
| $C$ | [context window](../data/context-window.md) |
| $K$ | [top-16](../architecture/output-head.md), [selector](../objective/selector-scoring.md) |
| $\phi, \theta, V$ | everywhere |
