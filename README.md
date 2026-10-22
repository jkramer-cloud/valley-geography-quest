# Valley Geography Quest — Version 3

A lightweight browser geography game for school Chromebooks.

## What changed

- **Start Round** button: changing game mode, grade, region, round length, or play style prepares the round but does not start the clock. Both the timer and the first question start together when the student presses Start Round.
- **Review Map** (Find the State and 90-Second Map Sprint only): after a resolved question, the target state remains colored green with a ✓ for correct, or red with a × for missed or skipped, until the round ends. The map stays reviewable after closing the end-of-round results.
- Students may turn off permanent map markings using **State map feedback → Classic**.
- Practice mode has no deadline. Wrong tries are counted toward accuracy but do not mark a target state as permanently incorrect; the correct response marks it green when completed.
- The game retains existing local nickname progress under the same browser storage key as V1 and V2.
- No Hub update is required. URL and repository stay the same.

## GitHub update

Upload **index.html, styles.css, data.js, map-data.js, game.js** to the root of the existing `valley-geography-quest` repository, replacing the existing files. Keep all five filenames. Commit and reload with Ctrl+Shift+R.

## Pedagogical notes

The ✓ / × markers measure the result of a *question*, not permanent mastery of a state. A student can retry via a new round or use the no-penalty Practice style.

## Storage

Progress and selected map-feedback setting are saved only in the browser. Do not use real student names on shared classroom devices.
