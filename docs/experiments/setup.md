# Shared training setup

Whittle Q5 generated the continuations and hidden features. Early runs used its
token IDs as hard labels. The later KL branch also captured
[full-vocabulary probabilities](../objective/forward-kl.md).

## Models

The draft started from Ornith 1.5 DFlash2. Its dimensions fit the required
architecture, but its weights still needed adaptation to Whittle features.

| Draft property | Value |
| --- | ---: |
| Parameters | 526,251,520 |
| Layers / tensors | 6 / 96 |
| Hidden / intermediate size | 2,048 / 6,144 |
| Attention / KV heads | 32 / 8 |
| Head dimension | 128 |
| Vocabulary | 248,320 |
| Architectural block size | 16 |
| Selector rank | 256 |
| Candidates per position | 16 |

Whittle's weights, token embedding and output LM head stayed frozen. The
embedding and head were read from the target Q5 GGUF.

## Features

Capture used target layers [1, 6, 11, 16, 22, 27, 32, 37]. The Python model
configuration used indices one lower. Four hyper-connection residual streams
were averaged at each selected layer.

Each token supplied eight vectors of 2,048 values, concatenated into 16,384
features. See [feature capture](../data/feature-capture.md) and
[projection](../data/feature-projection.md) for the formulas.

## Anchors and width

An anchor is a known token inside a captured Whittle answer. The draft receives
the preceding feature context and a block with masked future positions:

```text
Input, width 4:  [known anchor, MASK, MASK, MASK]
Direct labels:  [next token, next token, next token]
```

Width includes the anchor: width 4 gives three future labels, width 8 gives
seven. Architectural block size 16 does not mean every training step predicted
16 tokens.

The LoRA pilot used up to 96 feature tokens before the anchor. Later trainers
used a 384-token window. Capture could process a much longer prompt and answer;
each backward used the selected feature window, not necessarily the full prompt.

## Data consistency

Token labels, hidden features and soft targets must refer to the same text and
target configuration. Editing the text invalidates the old token and feature
alignment. A longer capture alone does not increase the number of positions
receiving direct token loss.

For the counters used throughout the notes, see [notation](../overview/notation.md).
