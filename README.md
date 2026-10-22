# Valley Geography Quest — Version 1

A standalone, lightweight geography learning game for the Naches Learning Hub. Students can locate and type U.S. states, match state names from a word bank, identify state capitals, practice from state flags, race a 90-second clock, study individual state facts, and explore map landmarks in Washington and the Pacific Northwest.

## GitHub repository

- **Name:** `valley-geography-quest`
- **Description:** `Interactive U.S. geography challenges with all 50 states, capitals, flag matching, timed map races, Pacific Northwest landmarks, and saved student progress.`
- **Expected site:** `https://jkramer-cloud.github.io/valley-geography-quest/`

## Files to upload to the repository root

- `index.html` — interface and accessibility labels
- `styles.css` — three visual themes and responsive layouts
- `data.js` — curated capitals, regions, state facts, gameplay modes
- `map-data.js` — embedded 50-state vector shapes and PNW landmark locations
- `game.js` — questions, game controls, progress, scores, timers

Upload exactly these five files to the root of the GitHub repository. Do not upload the ZIP itself. In GitHub Pages settings, deploy the `main` branch from `/(root)`.

This is a purely static site: no server, API keys, third-party JavaScript, mapping service, Google sign-in, or student accounts are needed. The map is stored locally; only flag images are fetched from an optional external source. If images are blocked by a school network, flag challenges display a notice and the other practice modes continue to function.

## Eight gameplay choices

1. Find the State — read a state name and click its location.
2. Type the State — identify the highlighted state by typing its name.
3. Name Bank Match — select or drag a name from a four-item bank to the highlighted state.
4. Capital Challenge — choose from four capitals (grades 3–8) or type the capital (grades 9–12).
5. State Flag Match — identify a real state flag; requires network access to remote images.
6. 90-Second Map Sprint — locate as many states as possible in a timed round.
7. PNW Explorer — locate regional cities, rivers, mountains, and landmarks, with approximate marker locations.
8. State Explorer — click any state to see its capital, region, flag, and a factual note.

Modes have region filters (All, West, Midwest, South, Northeast) and 10-, 25-, or 50-question rounds where applicable. Students can select grade-range settings; the initial differentiated challenge is mainly question presentation (multiple choice vs. typed capital), not a full separate grade-level curriculum.

## Saved progress and privacy

- Stores player nicknames and overall progress in the browser's localStorage.
- Remembers per-mode and region-specific clue exposure and prioritizes states seen less often.
- Tracks correct/incorrect answers, streaks, completed sessions, and passport stars.
- Provides a JSON progress export for teacher review.
- Does not sync across Chromebooks. Clearing browser data or private browsing may remove records. Encourage nicknames, not real student names.

## Intended educational use

These are original questions intended to support mapping and geographic literacy. They do not establish standards mastery. Capitals and facts should be periodically reviewed for accuracy as materials are expanded.

## Map and flag data sources

- U.S. state shapes were programmatically simplified from the `UScounties` boundaries distributed in `mpl_toolkits.basemap_data`, derived from U.S. Census mapping data. Alaska and Hawaii are **repositioned as schematic insets**; the map is not suitable for measurement.
- A separately available U.S. atlas dataset is the Census-derived [TopoJSON U.S. Atlas](https://github.com/topojson/us-atlas), with its own license. This game does not download or require that package at runtime.
- Flag images, where accessible, are requested from [telco-dev-flags](https://github.com/dodotdev/telco-dev-flags). The game does not store or sublicense these images. Flag availability and official design updates are externally dependent.
- Regional point coordinates are approximate locators for gameplay, not surveyed boundaries or engineering locations.

## Future development roadmap

- Expand the U.S. question bank with state symbols, rivers, landforms, geographic regions, and teacher-reviewed facts.
- Build grade 5–8 and 9–12 geography mission packs with evidence, short readings, and short-response questions.
- Bundle reviewed current state flags locally for fully offline practice if licensing and file sizes permit.
- Create a separate **World Atlas Expedition** using country polygons, flags, capital cities, continents, and country-specific source data.
- Expand the Pacific Northwest map to Washington counties, Cascade volcanoes, rivers, tribal geography, and Yakima Valley historical/cultural content with appropriate review.
