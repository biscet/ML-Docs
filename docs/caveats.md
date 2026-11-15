# What formulas cannot tell you

- A low loss does not guarantee high runtime acceptance.
- High acceptance does not guarantee speedup once drafting costs are counted.
- Identical parent and candidate answers are not a failure. Preserving the answer
  is what correct acceleration should do.
- Divergence from no-draft needs its own investigation: precision, sampling,
  batching, state check and rollback. A defect in a specific component has not
  been proven.
- The 854 direct labels are a fact. That adding more will produce the missing gain
  is a hypothesis, and a testable one.
- More data or more anchors do not remove the need for an independent test.
- The full 262,144-token window was not tested by this Stage-2 benchmark.

## How to use the list

Each item marks a place where a measurement can be mistaken for a conclusion. When
a report claims Stage-2 helped, check in order:

1. Did loss and accuracy improve on held-out families?
2. Did the gain survive rounding and the exported runtime?
3. Did the benchmark's paired interval stay positive?
4. Are the answers still the target's answers?

Only after all four does the claim concern the product rather than the trainer.
