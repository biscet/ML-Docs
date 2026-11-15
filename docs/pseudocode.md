# One training step

```python
# The target has already generated token_ids and features.
# Its weights do not change.

batch = next_batch()
width = 8 if global_step % 4 == 0 else 4
anchors = choose_one_anchor_per_record(batch, width)

context = last_target_features_before_anchor(batch, anchors, limit=384)
noise = [anchor_token, MASK, ..., MASK]
gold = next_target_tokens(batch, anchors, count=width - 1)
gold_previous = target_predecessors(batch, anchors, count=width - 1)

hidden = draft(noise, context)
logits = frozen_target_head(hidden[:, 1:])

ce = full_vocabulary_cross_entropy(logits, gold)
candidates = topk(logits, k=16)
scores = selector(logits, hidden[:, 1:], gold_previous, candidates)
selector_ce = cross_entropy_where_gold_is_in_candidates(scores, gold)

loss = ce + 0.5 * selector_ce

scaled_loss = scaler.scale(loss)
scaled_loss.backward()
scaler.unscale_(optimizer)

if gradients_are_finite():
    clip_grad_norm_(draft.parameters(), max_norm=1.0)
    scaler.step(optimizer)
    scaler.update()
else:
    # Weights are not updated. The scale is reduced.
    # The same batch with the same anchors is retried.
    skip_update_and_retry_same_batch()
```

## What it leaves out

The sketch shows computation only. The real code also validates files, shapes and
values, manages seeds, restores state and writes checkpoints. Each piece has its
own page:

| Symbol in the sketch | Page |
| --- | --- |
| `choose_one_anchor_per_record` | [Anchor sampling](data/anchor-sampling.md) |
| `last_target_features_before_anchor` | [Context window](data/context-window.md) |
| `draft(...)` | [Layer stack](architecture/overview.md) |
| `frozen_target_head` | [Output head](architecture/output-head.md) |
| `full_vocabulary_cross_entropy` | [Cross-entropy](objective/cross-entropy.md) |
| `selector(...)` | [Selector scoring](objective/selector-scoring.md) |
| `loss = ce + 0.5 * selector_ce` | [Total loss](objective/total-loss.md) |
| `clip_grad_norm_`, `scaler.*` | [Optimization](optimization/gradient-clipping.md) |
