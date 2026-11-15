# Splits and leakage

Splitting by family must satisfy

$$
\mathcal{F}_{\mathrm{train}} \cap \mathcal{F}_{\mathrm{val}}
=
\mathcal{F}_{\mathrm{train}} \cap \mathcal{F}_{\mathrm{test}}
=
\mathcal{F}_{\mathrm{val}} \cap \mathcal{F}_{\mathrm{test}}
=
\varnothing .
$$

Two language variants of the same file are not independent sources. Neither are a
question and its paraphrase, or a document and its summary. Splitting JSONL lines
without looking at the family is not enough.

## Why the family is the unit

The draft imitates one frozen model on a narrow task distribution. Near-duplicate
contexts make validation look better than the model is: the block can be predicted
from a sibling record seen during training, so accuracy reflects memorised families
rather than generalisation to a new task.

The failure is silent. The loss curve looks fine, and the only symptom is a
benchmark that refuses to reproduce the validation gain.

## Practical check

- Build the family key from where the content came from, not from the file name
  alone.
- Verify the three intersections are empty on the actual sample lists, not on the
  intended design.
- Remember the counting unit when reporting sizes: 600 contexts split 480/120 is a
  statement about contexts, not files.
