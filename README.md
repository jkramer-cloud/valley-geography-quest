# Valley Geography Quest v4.0 — Regions, Zoom & Personal Time Trials

Updated October 29, 2026. Adds four corner regions, north/south/east/west halves, auto-focus map framing, always-available East Coast magnification, and comparable timed personal records.

## IMPORTANT: Apply this update to your EXISTING GitHub repository

1. Open `jkramer-cloud/valley-geography-quest` on GitHub, branch `main`.
2. Extract this ZIP, then upload the **three updated files** `index.html`, `styles.css`, and `game.js` to the repository root, allowing them to replace their existing versions.
3. **Keep the existing `data.js` and `map-data.js` files in the repository.** They contain all 50 states, geographic coordinates, capitals, facts, and the detailed U.S. boundaries. They have deliberately not been replaced by this update.
4. Confirm that all five files remain in the repository root, then allow GitHub Pages to deploy and refresh https://jkramer-cloud.github.io/valley-geography-quest/ (Ctrl+Shift+R).

## Regions

Existing U.S. Census regions (Northeast, Midwest, South, West) remain available.
New: northern / southern halves, eastern / western halves, and northwest / northeast / southwest / southeast corner groups. The new directional areas use stable, **approximate educational state-center groupings** (not official Census divisions). Alaska is assigned northwest and Hawaii southwest, while their map shapes remain inset.

Selecting a region automatically frames its continental state shapes where possible. Buttons above the map: Region view, East Coast +, zoom +/−, and All U.S. These zoom controls do not change which states are part of the selected quiz. East Coast magnification is available regardless of the currently chosen U.S. state region. PNW Explorer retains its separate numbered-marker zoom behavior.

## Timing and personal records

A new `Time Trial · race the stopwatch` play style runs without a deadline and records actual time for finishing the selected questions. Challenge and Practice modes retain their existing rules and also log completed/ended runs. Personal records are grouped by mode, selected region, question count, grade, and play style. Clean best time requires completing the entire round with no misses. The fastest completion (including mistakes) and recent attempts are displayed separately; the history shows time changes relative to prior completions. Failed rounds are recorded as attempts, not personal-best completions.

Records live under each nickname in the existing `valley_geo_quest_profiles_v1` browser local-storage key. Existing progress is preserved. Timings are not synchronized between browsers or devices; classroom-wide rankings are not implemented. Do not use real student names in shared-browser nicknames.

## Preservation

The existing start button/timer sync, review marks, map gameplay, hint and skip mechanics, optional Practice mode, PNW Explorer, grade levels, themes, passport stars and exported profile data remain available.
