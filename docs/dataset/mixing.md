# Dataset mixing

With 80% new tasks and 20% replay:

$$
p_{\mathrm{train}}
=
0.8\, p_{\mathrm{new}}
+
0.2\, p_{\mathrm{replay}} .
$$

For 600 contexts:

$$
N_{\mathrm{new}} = 480,
\qquad
N_{\mathrm{replay}} = 120 .
$$

## What mixing is for

Replay limits drift. The parent already behaves acceptably on the old
distribution, and a purely new-task shard can quietly degrade it, especially with a
tiny update budget. A 4:1 mix is a compromise between specialising on new tasks and
keeping old behaviour.

The exact shares are a proposal for an experiment, not a measured optimum. Nothing
here shows that 80/20 beats any other ratio. It is a starting point that is cheap
to vary.

## Why the ratio is not the whole story

The 600 contexts are only meaningful if they are 600 independent contexts. If the
new and replay pools overlap, or if both language variants of one file land on
opposite sides, the effective ratio is not 0.8/0.2. That is the subject of
[splits and leakage](splits.md).
