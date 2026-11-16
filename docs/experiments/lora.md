# LoRA pilot

The first run checked whether the Ornith draft could use Whittle Q5 features.
It trained the full FP32 feature projection `fc` and added rank-8 LoRA adapters
to selected attention, MLP and `candidate_selector.hidden_projection` linear
layers. Other draft parameters stayed frozen.

## Weight update

The local `AdaptLinear` implementation used

$$
W_{\mathrm{effective}} = W_0 + 2BA.
$$

Here $W_0$ is the frozen matrix; $A$ and $B$ are adapter matrices whose product
has rank at most eight. The factor 2 belongs to this implementation.

## Configuration

| Setting | Value |
| --- | --- |
| Training prompts | 8: 4 RU, 4 EN |
| Validation prompts | 4: 2 RU, 2 EN |
| New target tokens | Up to 160 per prompt |
| Updates | 80 |
| Learning rate | 1e-4 |
| Optimizer | AdamW, eps 1e-6, weight decay 0.01 |
| Gradient clipping | Norm 1.0 |
| Feature context | Up to 96 tokens |
| Block width | 4 |
| Selector CE coefficient | 0.25 |

The loss combined token CE with selector CE on positions where the correct
token appeared in the draft's top-16.

## What the pilot established

The run exercised loading all 96 tensors, matching the Python model, capturing
Q5 features, backward and merging LoRA corrections into GGUF.

All four validation examples already had accuracy 1.0 before training. With
eight training prompts and 80 updates, this checked the training path but did
not establish broad generalization.

Archive source: `experiments/00-initial-adaptation/scripts/train_trial.py`.
