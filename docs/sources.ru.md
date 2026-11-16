# Источники

## Код разбора Stage-2

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

## Происхождение материала

Числа выполненного этапа сверены с сохранёнными отчётами и размерами батчей.
Предложения по следующему датасету лежат в отдельном разборе Stage-2, которого в
этом репозитории нет.

[История экспериментов Whittle](experiments/index.md) охватывает обучение по
состоянию на 16 ноября 2026 года. Результаты перенесены из переданной истории
обучения; сами прогоны и тесты архива заново не запускались.
[Описание архива Coach](experiments/coach.md) связывает
темы с исходниками и указывает объём зафиксированных проверок. Сам отдельный
архив в репозиторий не входит.

## Публичные веса и датасеты

- [Whittle DFlash2](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2)
- [Срез весов v1.0.0](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2/tree/v1.0.0)
- [Срез весов v1.2.0](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2/tree/v1.2.0)
- [Неизменяемый commit публикации v1.2.1](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2/commit/7c12955b782befff10cde7b28e170f8cec789a19)
- [DFlash DeepSeek TraceMix](https://huggingface.co/datasets/biscet/DFlash-DeepSeek-TraceMix)
- [DFlash TraceMix Lite v1.0.0](https://huggingface.co/datasets/biscet/DFlash-TraceMix-Lite/tree/v1.0.0)

Для воспроизведения нужны код опыта, конфигурация и хеши входов.
Одного изменяемого README модели недостаточно, чтобы определить запуск.
