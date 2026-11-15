# Один шаг обучения

```python
# Target уже сгенерировал token_ids и признаки.
# Его веса не меняются.

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
    # Веса не обновляются. Масштаб уменьшается.
    # Тот же батч с теми же anchor повторяется.
    skip_update_and_retry_same_batch()
```

## Что осталось за кадром

Схема показывает только вычисления. В настоящем коде есть ещё проверки файлов, форм
и значений, работа с seed, восстановление состояния и запись checkpoint. У каждого
куска своя страница:

| Символ в схеме | Страница |
| --- | --- |
| `choose_one_anchor_per_record` | [Выбор anchor](data/anchor-sampling.md) |
| `last_target_features_before_anchor` | [Окно контекста](data/context-window.md) |
| `draft(...)` | [Стек слоёв](architecture/overview.md) |
| `frozen_target_head` | [Output head](architecture/output-head.md) |
| `full_vocabulary_cross_entropy` | [Cross-entropy](objective/cross-entropy.md) |
| `selector(...)` | [Скоринг селектора](objective/selector-scoring.md) |
| `loss = ce + 0.5 * selector_ce` | [Общий loss](objective/total-loss.md) |
| `clip_grad_norm_`, `scaler.*` | [Оптимизация](optimization/gradient-clipping.md) |
