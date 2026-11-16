# Teacher-forced и self-conditioned оценка

[Score селектора](../objective/selector-scoring.md) зависит от предыдущего
токена. При оценке его можно подавать двумя способами.

| Способ | Предыдущий токен на следующей позиции |
| --- | --- |
| Teacher-forced | Правильный токен target |
| Self-conditioned | Токен, только что выбранный селектором |

Self-conditioned оценка проходит блок по собственному greedy-пути селектора.
Она позволяет измерить число подряд правильных будущих токенов до первой
ошибки. В реализации использовалась функция `greedy_selector_path`.

## Одни веса, разная accuracy

В опыте uniform/D-PACE одна и та же родительская модель получила:

| Способ | Token accuracy |
| --- | ---: |
| Teacher-forced | Около 62.5651% |
| Self-conditioned | Около 61.9141% |

Между замерами веса не обновлялись. Разницу дал вход предыдущего токена.

Обучающий selector loss оставался teacher-forced. Добавление self-conditioned
оценки не вводило scheduled sampling или обучение через differentiable rollout.

## Сравнение запусков

Вместе с accuracy нужно хранить способ оценки, ширину блока и проверочные
данные. Ширина 4 даёт три будущие позиции, ширина 8 даёт семь. Prefix и
accuracy из разных конфигураций напрямую не сравниваются.

Даже self-conditioned offline prefix остаётся [proxy](prefix-proxy.md).
Он не является серверным счётчиком acceptance или замером скорости.

Парные результаты приведены в [uniform и D-PACE](../experiments/position-weighting.md).
Роль prefix в позднем отборе описана в [выборе checkpoint](../workflow/experiment-selection.md).
