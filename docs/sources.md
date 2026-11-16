# Sources

## Code behind the Stage-2 walkthrough

| Part | File or function |
| --- | --- |
| Capture and saving of features | `capture/capture.cpp`, stream-averaging patch |
| Projection, attention, MLP, convolutions, selector | `source/zmodel.py` |
| CE, selector CE, anchor sampling, validation | `scripts/train_shard.py` |
| Clipping and AMP handling | `scripts/amp_step.py` |
| Moving windows and checkpoint age | `scripts/strategy.py` |
| Speed measurement | `scripts/benchmark.py` |
| Server-side acceptance counters | `tools/server/server-context.cpp` of the compatible runtime |

Names refer to the implementation that was analysed. This does not claim that any
third-party DFlash2 version uses the same coefficients and metrics. Those files
belong to the internal trainer and are not part of this repo.

## Primary sources

- [DFlash: Block Diffusion for Flash Speculative Decoding](https://arxiv.org/html/2602.06036v1)
- [DFlash2: method description](https://inco.ai/blog/dflash2/)
- [NVIDIA: DFlash2 trainer and metric definitions](https://docs.nvidia.com/nemo/automodel/nightly/nemo-automodel/nemo_automodel/components/speculative/dflash/dflash2_core)
- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)
- [PyTorch AdamW](https://docs.pytorch.org/docs/2.8/generated/torch.optim.AdamW.html)
- [PyTorch AMP](https://docs.pytorch.org/docs/2.8/notes/amp_examples.html)

## Provenance

The numbers of the executed stage were cross-checked against saved reports and
batch sizes. Proposals for the next dataset live in a separate Stage-2 dataset
review, which is not part of this repository.

The [Whittle experiment history](experiments/index.md) covers training through
16 November 2026. Results were transcribed from the supplied training history;
the underlying runs and archive tests were not rerun here.
[Coach archive and sources](experiments/coach.md) maps the referenced scripts
and records the reported verification scope. The separate archive is not
included in this repository.

## Public weights and datasets

- [Whittle DFlash2](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2)
- [Weight snapshot v1.0.0](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2/tree/v1.0.0)
- [Weight snapshot v1.2.0](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2/tree/v1.2.0)
- [Immutable publication commit for v1.2.1](https://huggingface.co/biscet/Whittle-35B-A3B-DFlash2/commit/7c12955b782befff10cde7b28e170f8cec789a19)
- [DFlash DeepSeek TraceMix](https://huggingface.co/datasets/biscet/DFlash-DeepSeek-TraceMix)
- [DFlash TraceMix Lite v1.0.0](https://huggingface.co/datasets/biscet/DFlash-TraceMix-Lite/tree/v1.0.0)

For reproduction, use the experiment's code, configuration and input hashes.
A mutable model README alone does not identify a training run.
