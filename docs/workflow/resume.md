# Weight seed vs exact resume

Starting from a model export and resuming an interrupted optimizer are different
operations.

| Artifact | Contents | Use |
| --- | --- | --- |
| GGUF | Exported parameters and metadata | Run the draft or seed new training |
| Safetensors | Model parameters with PyTorch names | Publish inspectable tensors |
| Resume checkpoint | Master weights, optimizer, scaler, RNG, cursor and configuration identity | Continue interrupted optimization |

A GGUF with a fresh optimizer does not restore AdamW moments or the old
training trajectory. The [long selector run](../experiments/selector-long.md),
for example, started from the pilot's best GGUF with a new optimizer.

## Recovery state

Long runs saved FP32 trainable weights, optimizer moments and step, scaler,
Python and CPU/CUDA RNG, epoch, cursor, phase step, LR and history.
The best GGUF and its metadata were kept separately from the latest resume.

Resume files were written atomically: finish a temporary file, flush and fsync,
then replace the working checkpoint. If writing failed or disk space ran out
before replacement, the previous checkpoint remained.

## Three step counters behind v1.2.1

| State | Step |
| --- | ---: |
| Best selector seed in its own run | 58,864 |
| Best checkpoint in the new KL run | 52 |
| Latest KL resume | 660 |
| Public v1.2.1 weights | KL step 52 |

These counters cannot be added into one training-step total. The latest resume
and the selected public weights also need not describe the same model state.

See [experiment selection](experiment-selection.md) for the selection rule and
[optimizer state memory](training-state.md) for storage costs.
