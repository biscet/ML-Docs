# DFlash Coach archive and sources

The source note describes a separate archive,
`dflash-coach-experiments-2026-11-16`. Its trainer code, reports and verification
files are not included in this documentation repository.

The experiment pages were edited and translated from that note. The training
runs and archive checks described below were not rerun while preparing these
pages.

## Baseline and experimental code

The baseline was Coach v1.0.0, Git snapshot
`088cb726ac43ae4b1ee0e8209be209f7b1080ecf`. According to the source note, all
50 shared files matched the verification copy by SHA-256; only the archive
listing `PUBLIC_FILES.json` was absent there. This comparison covers those
package copies, not every installation.

Later experiments were separate snapshots. They added checkpoint seeding,
dense anchors, position weighting, self-conditioned evaluation, selector-only
training, continuous recovery, partial unfreeze and soft-target KL.
They also limited open memmaps and file descriptors, and reserved disk space
for atomic checkpoints and exports.

These modes were not integrated into a common `coach.py` command. The archive's
add-only patch adds documentation and `experiments/` without replacing baseline
`coach.py`, `scripts/` or configuration. A shared CLI would need separate
interface and configuration work.

Coach's code version and Whittle's weight version are independent:
Whittle v1.2.1 does not imply Coach v1.2.1.

## Source map inside the archive

Script paths below are relative to each experiment's `scripts/` directory.

| Experiment directory | Files to inspect |
| --- | --- |
| `00-initial-adaptation` | `train_trial.py`, `train_projects.py` |
| `01-stage2` | `checkpoint_seed.py`, `train_shard.py` |
| `02-dense8` | `anchor_sampling.py`, `amp_step.py` |
| `03-dpace-paired` | `position_loss.py` |
| `04-selector-only` | `selector_scope.py` |
| `05-selector-long`, `06-selector-continuous` | Long-run snapshots; `06` contains `train_long.py` and `longrun_state.py` |
| `07-ce-kl-partial` | `train_chunk.py`, `selector_scope.py`, `soft_targets.py`, `capture_soft.cpp`, `verify_soft_capture.py` |

Other archive entries:

| Path | Contents |
| --- | --- |
| `README.md` | Archive guide |
| `baseline/dflash-coach-v1.0.0.zip` | Original Coach package |
| `docs/dflash-training-methods.md` | Training history used for this chapter |
| `docs/experiment-results.json` | Selected numbers, without source tasks or answers |
| `docs/COACH-CHANGES.md` | Changes relative to baseline |
| `patches/add-experiments.patch` | Add-only patch |
| `verification/` | Check reports |
| `SOURCE-MANIFEST.json`, `SHA256SUMS` | Hashes and records of machine-path substitutions |

## Reported verification

The source note records 91 passing CPU tests: 64 baseline tests and 27
specialized tests. Syntax checks covered 202 Python files. The add-only patch
was applied to clean Coach v1.0.0 while preserving baseline files.

The portable package had unit-test and synthetic offline-demo coverage. A full
GPU run of the public portable package as one product was not completed.
Experimental sources had been used for GPU training; packaging those snapshots
does not establish a new end-to-end GPU test.

[Sources](../sources.md) links the public weights and datasets.
