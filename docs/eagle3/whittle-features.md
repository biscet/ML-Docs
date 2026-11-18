# Whittle features for EAGLE-3

## How EAGLE-3 works

EAGLE-3 speeds up generation through speculative decoding. A small draft model
proposes several tokens, and Whittle checks them in one forward pass. In a
greedy example with draft tokens `A B C`, Whittle might accept `A` and pick `D`
at the next position. The output continues with `A D`, and `B C` are discarded.
See [greedy verification](../runtime/verification.md).

EAGLE-3 predicts token probabilities directly. At the first step it uses
features from several Whittle layers and the embedding of the latest known
token. In later steps it feeds back its own previous hidden state and the
embedding of the token it just proposed. Training also runs several steps with
this hidden-state feedback. The paper calls it *training-time test*.
[EAGLE-3 paper, section 3](https://arxiv.org/html/2503.01840v3#S3).

## Which states the exporter saves

The exporter reads the attention inputs of Whittle Q5 blocks 2, 20 and 37,
counting from zero. Before attention, Whittle's learned mixer combines four
hyper-connection streams into a vector of 2048 values. The contribution from
n-gram memory also passes through the mixer. [Whittle model card](https://huggingface.co/whittleOrg/Whittle-Qwen-3.8-35B-A3B).

Let $u_p^{(\ell)}$ be the attention input of block $\ell$ at position $p$.
The exporter concatenates the three vectors in block order.

$$
a_p = \operatorname{concat}(u_p^{(2)}, u_p^{(20)}, u_p^{(37)})
$$

The 6144-value vector $a_p$ is stored in `aux_hidden_state`. EAGLE-3 then
projects it to the draft model's hidden size with a learned layer.

Whittle has 40 trunk blocks. The exporter's index `40` selects the final state
after the output mixer, just before the LM head. During training, the LM head
turns this state into the teacher's next-token distribution.

## Feature file

Each SpecForge file holds one sequence of $T$ tokens.

| Field | Shape | Type |
| --- | --- | --- |
| `input_ids` | `[T]` | int64 |
| `loss_mask` | `[T]` | int64, values 0 or 1 |
| `aux_hidden_state` | `[1, T, 6144]` | FP16 |
| `hidden_state` | `[1, T, 2048]` | FP16 |

The exporter and server use the same `qwen4exp` feature mode in llama.cpp.
During decoding, the draft model receives the three attention inputs in the
order specified in the draft GGUF. The server checks the layout ID
`native-attn-mix-v1` when loading the model.

The token embeddings and LM head come from the quantized Whittle GGUF and stay
frozen during training. Saving the features and converting the head to FP16 can
introduce small rounding differences.

## Token alignment

At rollout depth 0, the draft decoder uses position $p$, projected features
from row $p$ and the embedding of token $x_{p+1}$. It predicts $x_{p+2}$.
For example, with $p=10$ it reads features from row 10 and token 11 to predict
token 12.

At training depth $d$, SpecForge takes the input token $x_j$ from the dataset.
The final Whittle state $h_j$ gives the target distribution $P_j$ for $x_{j+1}$.
Here $H_{\mathrm{W}}$ is Whittle's LM head.

$$
j = p+d+1, \qquad P_j = \operatorname{softmax}(H_{\mathrm{W}}(h_j))
$$

SpecForge compares the distributions on the draft vocabulary. It reads the
loss mask at row $j$ and skips rows past the end of the sequence.
[SpecForge objective code](https://github.com/sgl-project/SpecForge/blob/91d8a5a5443c5b93a905f8eead79f23a00311a41/specforge/algorithms/objectives/protocols/eagle3.py).

The two FP16 tensors take $(3 \cdot 2048 + 2048) \cdot 2 = 16{,}384$ bytes per
token. At 100,000 tokens that is about 1.53 GiB, plus IDs, masks and metadata.

See the [offline training run on V100](offline-v100.md).
