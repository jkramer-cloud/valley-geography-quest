# Valley Geography Quest — V2: Timed Challenge and PNW Map Improvements

A lightweight geography game for the Naches Learning Hub. No build system or third-party JavaScript is needed.

## Major improvements from Version 1

- **Find the State** recognizes a correct map click, gives 100 points, and automatically advances after a brief visual highlight. The 90-second sprint also advances without requiring the Next button.
- A **large timer, number of questions remaining, and mistakes remaining** are permanently visible in an uncluttered strip above the map. Students receive a clear **Round Complete**, **Time Is Up**, or **Mistake Limit Reached** summary.
- A **Play Style** selector has two modes:
  - **Challenge:** Countdown plus a limited number of incorrect answers before the round ends; allowances depend on the selected grade range and round length.
  - **Practice:** No deadline or mistake limit. Wrong answers can be retried, and accuracy still reflects the number of correct and incorrect attempts.
- Final results report correct answers, mistakes, accuracy percentage, points, and time.
- **PNW Explorer** has numbered place markers with visible categories for communities, mountainous terrain, and waterways. It zooms dynamically to the choices. The generator supplies 4–6 options and prevents markers from appearing too close together.
- **State Flag Match** has been removed from the menu due to external image availability problems and classroom feedback. State Explorer no longer depends on flag image requests.
- Existing nickname profiles, scores, streaks, and progress use the same browser storage key as V1. Data is not synchronized across devices.

## Current game modes

1. Find the State — click the named state
2. Type the State — type the name of the highlighted state
3. Name Bank Match — use a word bank for a highlighted state
4. Capital Challenge — multiple choice for younger grades; typed capitals for grades 9–12
5. 90-Second Map Sprint — locate states quickly
6. PNW Explorer — approximate locations of communities, mountains, waterways and landmarks
7. State Explorer — free study with no mistakes or time limits

## Example challenge allowances

| Grade range | 10 questions | 25 questions | 50 questions |
|---|---:|---:|---:|
| Grades 3–5 | 4 mistakes | 7 mistakes | 10 mistakes |
| Grades 6–8 | 3 mistakes | 6 mistakes | 9 mistakes |
| Grades 9–12 | 2 mistakes | 5 mistakes | 8 mistakes |

The countdown adjusts to grade band and question count. The 90-second sprint remains fixed at 90 seconds in Challenge mode. PNW rounds cap at the number of available unique locations (28 in this build).

## Files to upload

Upload or replace all **five** root-level website files in the existing `valley-geography-quest` GitHub repository:

- `index.html`
- `styles.css`
- `data.js`
- `map-data.js`
- `game.js`

**Do not upload these files to the main Learning Hub repository.** That hub already points to the existing website at `https://jkramer-cloud.github.io/valley-geography-quest/`.

No Learning Hub update is needed: this release does not change the game's URL or the Hub category.

## Limitations

- PNW landmark points are **approximate classroom map locations**, not surveyed GPS positions; waterways and mountain ranges are represented by points rather than full geographic shapes.
- State shapes are simplified and Alaska/Hawaii are shown as cartographic insets.
- Profiles save only in this browser's local storage. Private windows, cleared browser data, and different school devices do not share progress.
- This is instructional practice, not a formal Washington standards assessment.

## Validation

The update was checked with automated Chromium interactions for all seven modes, including correct clicks, automatic advancement, wrong-answer retries, mistake limit, 90-second expiration, and multiple PNW marker choices. PNW marker separation and minimum choice counts were also checked across all 28 locations and three grade ranges. Classroom device testing is still advised.
