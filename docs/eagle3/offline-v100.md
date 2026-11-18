# Offline EAGLE-3 training on V100

llama.cpp loads Whittle Q5 entirely onto a 32 GB V100 and streams its
[hidden states](whittle-features.md) to disk. Once capture finishes, the target
GGUF is unloaded. SpecForge trains a one-layer draft model from the cached
features using frozen token embeddings and the LM head.

## Capture, train and export

1. Prepare JSONL records with Whittle token IDs and a loss mask. The exporter
   reads each sequence in chunks and carries the teacher's state between chunks.
2. Write one SpecForge checkpoint per record and group the files into shards.
   The exporter writes files atomically. A rerun with the same manifest skips
   finished records. The manifest identifies the model file, input digest,
   exporter binary and feature layout.
3. Train in FP16 with SDPA, a batch size of 1 and 4 gradient accumulation steps.
   The run uses gradient checkpointing and keeps FP32 AdamW master weights on
   the GPU. Vocab mapping and tiled teacher projection limit memory use during
   loss computation. The draft vocabulary has 32,000 tokens. Rollout runs
   for three steps.
4. To resume from a training checkpoint, keep the same cache, sample order and
   accumulation settings. Export the trained checkpoint to FP16 GGUF with the
   layout ID and load it in the patched server with `draft-eagle3`.

The run used Whittle patches on top of
[llama.cpp 5297534](https://github.com/ggml-org/llama.cpp/commit/52975342ff6b85127ff31930d39e36725fd08809)
and [SpecForge 91d8a5a](https://github.com/sgl-project/SpecForge/commit/91d8a5a5443c5b93a905f8eead79f23a00311a41).
The runtime port includes a Volta Flash Attention path for narrow queries and
K-quant/MXFP4 conversion.

## Smoke run on 18 November 2026

| What was counted | Result |
| --- | ---: |
| Whittle model buffers on V100 | 23,958.74 MiB |
| Captured records | 4 |
| Token rows | 767 |
| Shards | 2 |
| Optimizer updates | 1 |
| Output tokens in one server request | 8 |
| Draft tokens proposed | 15 |
| Draft tokens accepted | 0 |

A second capture skipped all four records. The patched server loaded the
exported GGUF and answered one request. Measuring acceptance and speed requires
a trained draft model and a benchmark with a fixed request set.
