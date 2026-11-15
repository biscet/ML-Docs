# Export and rounding

Training weights are FP32, the exported draft is F16:

$$
W_{\mathrm{export}}
=
\operatorname{Round}_{\mathrm{FP16}}\left(W_{\mathrm{master}}\right).
$$

A change small enough vanishes in that rounding. It is not an export bug, it is the
resolution of the artefact that actually ships.

## Two compute paths

Validation in Python and execution of the GGUF file use different code paths,
kernel choices and accumulation orders. Together with rounding, that means a small
offline gain has to be checked in the real runtime and cannot be transferred
automatically:

- the offline validator measures the framework path on two fixed windows;
- the exported model is F16 and runs in another engine;
- the benchmark measures that engine end to end, draft overhead included.

A gain that survives all three is real. A gain that only appears in the first one
belongs to the validator.

## Why anyone checks this

The Stage-2 candidate improved validation loss by about 0.028% and accuracy by
about 0.056 percentage points. Both are small enough that rounding and path
differences could plausibly explain them. That is why the run ended with a
[benchmark and a paired interval](../runtime/benchmark.md) instead of a claim built
on validation alone.
