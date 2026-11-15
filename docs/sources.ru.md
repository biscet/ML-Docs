# Источники

## Код, с которым сверялся документ

| Часть | Файл или функция |
| --- | --- |
| Захват и сохранение признаков | `capture/capture.cpp`, патч усреднения потоков |
| Проекция, attention, MLP, свёртки, селектор | `source/zmodel.py` |
| CE, selector CE, выбор anchor, валидация | `scripts/train_shard.py` |
| Clipping и обработка AMP | `scripts/amp_step.py` |
| Скользящие окна и возраст checkpoint | `scripts/strategy.py` |
| Замер скорости | `scripts/benchmark.py` |
| Серверные счётчики acceptance | `tools/server/server-context.cpp` совместимого runtime |

Названия относятся к разобранной реализации. Это не утверждение, что любая
сторонняя версия DFlash2 использует те же коэффициенты и метрики. Эти файлы
принадлежат внутреннему тренеру и в репозиторий не входят.

## Основные источники

- [DFlash: Block Diffusion for Flash Speculative Decoding](https://arxiv.org/html/2602.06036v1)
- [DFlash2: описание метода](https://inco.ai/blog/dflash2/)
- [NVIDIA: DFlash2 trainer и определения метрик](https://docs.nvidia.com/nemo/automodel/nightly/nemo-automodel/nemo_automodel/components/speculative/dflash/dflash2_core)
- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)
- [PyTorch AdamW](https://docs.pytorch.org/docs/2.8/generated/torch.optim.AdamW.html)
- [PyTorch AMP](https://docs.pytorch.org/docs/2.8/notes/amp_examples.html)

## Происхождение чисел

Числа выполненного этапа сверены с сохранёнными отчётами и размерами батчей.
Предложения по следующему датасету лежат в отдельном разборе Stage-2, которого в
этом репозитории нет.

Русская исходная заметка сохранена дословно в
[`original/dflash-training-formulas.ru.md`](https://github.com/biscet/lm-docs/blob/main/original/dflash-training-formulas.ru.md),
чтобы перевод можно было сравнить с оригиналом.
