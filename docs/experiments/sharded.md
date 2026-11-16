# DatasetDflash v3: sharded continuation

This stage continued on DFlash DeepSeek TraceMix, a published corpus of
50,000 contexts. Capture and training ran shard by shard to limit the feature
files kept on disk.

## Shard cycle

1. Select a shard.
2. Generate Whittle answers and features, then verify capture.
3. Train, evaluate the candidate and save a consistent state.
4. Get the mentor's decision and move to the next shard.

A shard had to be committed as complete before advancing the saved cursor.
An interrupted shard could not be counted as fully trained after restart.

DeepSeek Flash received aggregate numeric reports and suggested continuing,
stopping or changing LR. Whittle Q5 still supplied labels and hidden states.
Updates used token CE plus selector CE.

## Configuration

All draft parameters were trainable. Base LR started at 5e-6 and dropped to
2.5e-6 after step 7,026. The projection and input normalization kept their 3x
LR multiplier.

The run used batch 4, a 384-token feature window, FP32 master weights and FP16
autocast. Recoverable overflow retried the same batch; see
[mixed precision](../optimization/mixed-precision.md).

## Saved releases

| State | Selected step | Loss | Token accuracy | Correct-prefix proxy |
| --- | ---: | ---: | ---: | ---: |
| Parent, re-evaluated for this stage | 0 | 4.219917 | 46.9029% | 2.396484 |
| v1.1.0 Nightly | 4,978 | 3.9292 | 49.50% | 2.5703 |
| v1.2.0 | 9,074 | 3.869143 | 50.3906% | 2.621094 |

By v1.2.0, training had processed 142 of 176 shards in the first pass:
36,296 usable traces. The first pass was unfinished. Versions v1.1.0 and
v1.2.0 are snapshots of one continuation.

The next experiments branched from v1.2.0; see the [run history](index.md).
