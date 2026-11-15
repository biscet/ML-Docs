# Checkpoint selection and the mentor

The best weights were picked by minimum validation loss among the saved checks:

$$
s^{*}
=
\arg\min_{s \in \mathcal{E}} \mathcal{L}_{\mathrm{val}}(s) .
$$

$\mathcal{E}$ is the set of checked checkpoints, not every internal step. New
checks after the Stage-2 shards ran at steps 9076, 9090, 9102, 9116 and 9130. The
parent's saved result at step 9074 also took part.

The best step was 9090, although the last trained step was 9130.

## What best means here

Best refers to the selected validation loss. It does not mean top speed on all
tasks, and it does not mean best acceptance. Those are different measurements on
different data, and this run selected on loss alone.

The minimum landing two checks before the end is informative. Further updates
kept lowering the loss on their own batches while validation got slightly worse.
With 56 updates and a fixed learning rate, that is the expected shape of mild
overfitting to a small shard.

## Mentor inputs

The mentor got moving averages, for example

$$
\mu_{\mathrm{recent}}
=
\frac{1}{10}\sum_{i=t-9}^{t} L_i ,
$$

and the age of the best checkpoint:

$$
\operatorname{Age}_{\mathrm{best}} = s_{\mathrm{current}} - s_{\mathrm{best}} .
$$

Its decision is not described by a proven convergence formula:

$$
\pi_{\mathrm{LLM}}\left(\text{metrics}, \text{history}\right)
\longrightarrow
\left(\text{continue/stop}, \eta_{\mathrm{next}}, \text{reason}\right).
$$

It is a model deciding over the information it was given. In the executed stage
the windows partly included the parent's history. Stopping after 56 updates does
not prove the new corpus was exhausted. It records what the advisor decided with
the evidence at hand.
