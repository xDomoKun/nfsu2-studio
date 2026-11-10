# Underground Studio v1.7.13

Complete, static GitHub Pages project. Extract the ZIP to your repository root and publish. The editor processes NFSU2 saves locally in the browser.

## Changes in v1.7.13

- Career selected car: new **Unlock all parts** action. Sets the mapped 420 availability bytes for that car only (body, graphics, specialties, performance) based on known ProfileCreator ranges. **Does not install parts**, change the engine/handling, or alter Dyno profiles. Can undo the last unlock while the same file/slot is selected. The in-game part-shop behavior is *not yet verified*; make a save backup.
- Quick Race / My Cars: the full **31 street cars + 15 Traffic Cars** catalog is available through a searchable, filtered chooser for all 20 independent generic slots. Includes experimental generated street-car stock records if the save has no existing same-model donor. Where available, same-model career/generic payload is preferred. Existing original Traffic Mod templates remain intact; arbitrary generic slot installation is still subject to in-game testing.
- Arcade car images: preview, gallery and grid reuse all 43 bundled images by their exact vehicle hash. Minivan, Hatchback 1 and Panel Van still await user-supplied verified pictures; no mismatched images are substituted.
- The old confirmed original-20 Traffic Mod restoration, career garage and all existing Traffic performance presets are retained.

## Safety

Always back up before import. Valid checksums and an in-editor vehicle image do NOT guarantee an arcade car is playable. For brand-new generated standard cars, test single slots first. Garage slot 1 in Career Mode must remain occupied and unlocked. `unlockAllParts()` uses experimental availability bits, not the native game's complete event/unlock system; it might not make all parts purchasable in the actual game.

---

# Underground Studio v1.7.12

**Complete static, GitHub Pages-compatible project.** Extract all ZIP files to the repository root (`index.html` is in the ZIP root). Open the editor in a browser, or publish by pushing the extracted files to your GitHub Pages branch.

## Latest verified gameplay reports (Traffic Coupe)

| Profile | In-game result | Interpretation |
| --- | --- | --- |
| B03 | Drivable | Baseline |
| P01 | Drivable | Wider ECU/Turbo curve; actual speed improvement has not yet been measured |
| H01 | **Not drivable** | Vehicle falls; tires spin in place |
| PH01 | **Not drivable** | Vehicle falls; tires spin in place |
| D04 | **Not drivable** | 4-part stage flag combination; precise cause not established |
| D01 | **Highest displayed Handling bar according to player** | Not confirmation of drivability, grip or faster cornering |
| D02, D03 | Not yet confirmed | Remain isolated tests |

## Changes in 1.7.12

- **D04 disabled** in the UI and API following a failed in-game driving test. Preserve its saved-byte signature for recovery of saves previously edited with D04.
- **One-click legacy recovery** now covers H01, PH01 **and D04**. The Traffic Coupe returns to B03; other Traffic Cars reset their saved tuning to neutral stock. The original imported file is not overwritten.
- **D01 shown as the most promising displayed Handling rating**, with clear distinction between an on-screen bar and real-world driving/handling. Actual driving behavior still needs verification.
- **D02 and D03** remain isolated experimental flag tests. No new combined profile introduced while D01 driving behavior is unknown.
- Existing B03, P01, G01, G02, T01, K01/Stock, D01, D02, D03 configurations remain byte-for-byte unchanged. No vehicle identity, visuals, other garage slots, ZIP format, or checksums have changed.

## Next test (original file backed up)

1. Confirm **D01 actually moves and corners normally** in game; rating bars are not enough.
2. Test D02 and D03 separately only if desired, always restoring a known-good B03 save between tests.
3. If D01 is drivable, compare its corner grip with B03 on the same course. Only afterward consider controlled B03/P01 + D01 combinations.

## Project contents

- `index.html` in repository root
- Separate JS/CSS code including `traffic-performance-presets.js` and `traffic-performance-presets-ui.js`
- `jszip.min.js` included locally for offline import/export
- `images/` regular car images, `images/traffic/` existing verified traffic images
- `README.md` with change notes

**Save-only caution:** Valid checksum and rating bars cannot establish gameplay drivability. Keep an untouched backup and test only one variation at a time. Career slot 1 must remain occupied/unlocked.

---

## Previous version development notes (historical)

# Underground Studio 1.7.11

Complete offline/static GitHub Pages project. Extract all ZIP contents to the repository root (`index.html` at root). Keep all JS/CSS files and `images/` together.

## In-game findings (reported by player)

- **B03: drivable**, tested Traffic Coupe baseline.
- **P01: drivable**, wider ECU and Turbo curve. Actual speed advantage over B03 still not measured.
- **H01: NOT drivable**, vehicle falls and wheels spin while stationary.
- **PH01: NOT drivable**, same failure, because it includes H01 handling changes.
- The problem is associated with H01-specific handling flags, but the precise flag(s) or engine behavior are **not yet identified**.

## Changes in v1.7.11

- **H01 and PH01 removed/blocked from profile application.** Old H01 and PH01 saves can still be detected and restored through a one-click recovery action (B03 on Coupe; stock on other cars).
- **P01 marked as drivable only for the tested Traffic Coupe**. Untested traffic models are not assumed safe.
- **Four NEW diagnostic profiles** in a collapsed `Handling · Diagnostic Tests` section, each based on B03 and changing *only one field or one group* (none is verified drivable):
  - `D01`: Unique upgrade slot 5 only (relative to B03)
  - `D02`: Unique upgrade slot 6 only
  - `D03`: Unique upgrade slot 8 only
  - `D04`: performance part bytes 30, 35, 36, 37 only
- Exact mapping of these flag IDs to vehicle physics is not confirmed; these are diagnosis tools, **not** recommended handling enhancements.
- Existing B03, P01, G01, G02, T01, K01 / Stock values remain byte-for-byte unchanged, as do vehicle identity, images, regular-car shop, drag-and-drop import and Slot 1 safeguards.

## Suggested test plan

Make a working backup. Use the same Traffic Coupe and one diagnostic at a time: D01 → D02 → D03 → D04. After each, observe whether it spawns on the road, drives, turns and brakes; always restore a known-good B03 save before testing the next variant. Do not combine flags until their effects are proven. A vehicle falling through the map may indicate unsupported configuration, not a tunable grip value. For performance comparison, test P01 and B03 using the same stretch and time acceleration/speed instead of relying on menu bars.

---

# Underground Studio 1.7.9

Offline NFSU2 / nfsu2.xyz save editor · full GitHub Pages project. Extract all ZIP files into the repository root, leaving `index.html`, CSS, JS and `images/` paths intact. No build step. English default / German optional.

## Changes in v1.7.9

- **Three additional experimental Traffic performance choices**, separate from the original five and not verified in game: **P01** broadens ECU + Turbo power curves from B03 using 200-capped saved Dyno values, **H01** keeps B03 Dyno but enables the documented Stage-3 suspension flags and suspension/brakes/tires Unique flags, **PH01** combines P01 + H01. This is a SAVE-ONLY experiment, not a modification of the engine physics. There is no guarantee of more horsepower, grip, or higher speed. Compare in actual gameplay, not just the in-menu three rating bars.
- The original **K01/Stock, B03, G01, G02 and T01 bytes remain unchanged**. All eight choice buttons identify the applied profile, and guarded per-car Undo is retained.
- **Traffic Appearance / Body Shop entirely removed from the displayed Traffic view**: the Shop tab is hidden, switching from a regular car's Shop view to Traffic goes to the simplified profile view automatically. Normal cars still have their full Shop and Body Shop.
- **Global drag & drop** of a save ZIP / SAV / DAT file from Finder or Explorer works on **every editor page**, even after a save was already opened. A full-window drop indicator appears while dragging; the Files page also has a permanent clickable drop area. The old file picker and start-page drop zone still work. Invalid imports do not replace the previously loaded save.
- The editor does not insert Minivan/Hatchback 1 pictures. User will provide them later. Slot 01 protection and save checksum/fingerprint repair are unchanged.

## In-game tests to run

Use the same car, road, race mode and input for B03 versus P01/H01/PH01; log 0–100 acceleration, max speed and stability/grip in identical corners. H01/PH01 may change visible rating bars without a measurable handling change. Save original ZIP and keep slot 01 unlocked/occupied.

---

# Underground Studio 1.7.8

Offline browser-based save editor for **Need for Speed: Underground 2 / nfsu2.xyz**. Complete GitHub Pages-compatible ZIP: extract and publish *all files* including `index.html` in the repository root. English default; German available.

## New in 1.7.8 — Separate performance-tuning views

- **Traffic Cars (15 types):** Simplified, dedicated performance view with **five clickable profile cards**: Original K01 / Stock (depending on car), B03, G01 (final 105), G02 (final 125), and T01 (high-RPM turbo). Shows active profile, specific vehicle, short description, and safe Undo.
- The full normal-car Dyno sliders and Auto-Tune, Parts Shop and stage/Unique controls are **hidden only while a Traffic Car is selected**. These underlying features and save values remain unchanged; no data are deleted by switching the view.
- **Standard cars:** Retain the full detailed Performance Shop, Auto-Tune, five individual Dyno race setups, gear/ECU/turbo controls and body shop.
- Traffic Cars keep their **Body Shop** on the separate appearance tab. A link directs them to their performance profiles instead of showing stage-upgrade controls that could conflict with the profiles.
- Regular-car **whole-garage Auto-Tune now excludes Traffic Cars** so a bulk normal-car operation cannot silently overwrite the new Traffic-specific B03/G01/G02/T01 setup.
- No tuning preset formulas, slot IDs, traffic templates, vehicle images, or save serialization were changed in this release. Per-car Undo still refuses to overwrite tuning modified after applying a preset.

**Testing:** UI routing, regular/Traffic selection, all five profile buttons, safe Undo, and export checksums validated in browser-level tests. B03 is the user's subjective Traffic Coupe driving favorite; G01/G02/T01 and transfer to other traffic vehicles remain unverified performance experiments. Keep backups before every in-game test. Hatchback 1 and Minivan have confirmed gameplay support; original car images are still pending.

## Project structure

- `index.html`, local `*.js`, `*.css`, `jszip.min.js`, `images/`, `images/traffic/`, `README.md` are included in the release archive.

---

# Underground Studio 1.7.7

Offline save editor for **Need for Speed: Underground 2 / nfsu2.xyz**. Works from the extracted static files or GitHub Pages; English default, German optional.

## Changes in 1.7.7 — Traffic performance testing

- Traffic Coupe **B03_BOTH_UNIQUES** remains unchanged and is the **subjective, user-tested favorite**, not a measured optimum.
- The B03 performance reference is now selectable on **all 15 career Traffic Cars** (native slots 1–5 and supported extended garage slots 6–10). Effects on other models remain **experimental**; no engine assets are modified.
- Added controlled, reversible B03-derived tuning tests for the five saved Dyno race types:
  - **G01**: final drive 105 (longer than B03 115), to investigate top-speed tradeoffs.
  - **G02**: final drive 125 (shorter than B03 115), to investigate acceleration tradeoffs.
  - **T01**: high-RPM Turbo curve broadened, while the B03 ECU, parts and Uniques are unchanged.
- For the Coupe, **Original K01** preserves the exact historic reference. For all other Traffic Cars, **Stock** clears saved performance upgrades and resets Dyno values to neutral (it does not reconstruct the car's engine physics).
- Each test edits **only the selected vehicle's** performance flags, nine Unique upgrades and five Dyno setups. Identity, geometry, visual parts, ownership, and other cars are preserved.
- Per-car **Undo** is guarded by vehicle ID and the exact applied snapshot; if further manual changes were made, it will not silently overwrite them.
- The user confirmed **Hatchback 1 and Minivan** drive correctly in-game. Images are intentionally still pending; no placeholders or speculative images were added.

## Suggested in-game comparison

Use the same Traffic Car, save, track, driving conditions and race mode for B03, G01, G02 and T01. Keep original backups, export each setup independently, and note 0–100 km/h, 0–200 km/h, maximum speed, boost gauge and whether the car remains driveable. Turbo needle movement is not proof of engine boost. These setups are **tests**; no speed increase or numerical speed cap is guaranteed.

## Quick start

1. Extract the ZIP. Open `index.html` or upload the *contents* to the root of a GitHub Pages repo.
2. Load an nfsu2.xyz save ZIP. Always back up the original.
3. In Career Garage, select a Traffic Car, open **Acceleration & Top Speed**, choose B03 or a test setup, and export the save ZIP. Keep **career garage slot 01** occupied and unlocked at all times.

## Project structure

- `index.html` · GitHub Pages entry point
- `*.js` · all save processing and UI modules, including traffic performance test bench
- `*.css` · app styles
- `jszip.min.js` · local ZIP dependency
- `images/` · regular car images
- `images/traffic/` · matched Traffic Car images, with no invented Hatchback 1/Minivan photos

---

# Underground Studio 1.7.6

Offline save editor for Need for Speed: Underground 2 / nfsu2.xyz.
**English is the default language; German is available in the app.**

## Quick start

1. Extract the entire ZIP (including the `images/` directory).
2. Open `index.html` in a browser or publish the complete contents of this ZIP to the root of your GitHub Pages repository.
3. Open an nfsu2.xyz ZIP save or compatible career save; back up your original before exporting modified files.

This is a static, browser-only project. It requires no server/backend or build step. Keep the `index.html`, `.js`, `.css`, and `images/` paths together as packaged.

## Changes in 1.7.6

- Added **experimental, reconstructed** Minivan and Hatchback 1 traffic template records, derived from Panel Van and Hatchback 2 templates but using the matching NFSU2 engine model hashes. These are not verified original 2014 mod records.
- Both models can now be selected for import into the career garage. The on-screen label identifies them as experimental. Their genuine appearance and in-game driveability have **not** been confirmed.
- Career Garage slot 01 is a **mandatory occupied, unlocked slot**; the UI prevents removing/locking slot 01. A warning is shown if slot 01 is empty or locked, and save exports are blocked until it has a valid car.
- Source mod's original generic My Cars templates remain available for the original configuration install flow.

## Changes in 1.7.5

- Fixed the career Garage replace flow for already-occupied slots when selecting traffic cars.
- De-duplicated the traffic catalog by internal model hash and clarified numbered Sedan/Taxi/Hatchback variants.
- Van (Panel Van), Parcel Van, and Minivan are distinct model entries. Removed an incorrect Minivan image association.
- Added 12 previously supplied and matched traffic-car images under `images/traffic/` (no placeholder for unverified Minivan/Panel Van images).

## Testing and limitations

- Browser-level tests confirmed 15/15 traffic catalog entries can be applied to occupied career slots using their intended model IDs. Save checksums, export, and repeat import checks passed.
- The two reconstructed templates are **experimental**. Real NFSU2 game testing is still required to verify geometry/appearance, loading, and driveability.
- Slot 01 safety check is based on the reported crash case and should not be treated as a guarantee against every invalid save combination.
- Traffic engine performance tuning is **unchanged** in v1.7.6; it will be addressed after the vehicle catalog/game verification.

## Project layout

- `index.html` — website and editor interface, GitHub Pages entry point
- `*.js` — bundled application and save-processing modules
- `*.css` — application styling
- `jszip.min.js` — ZIP import/export dependency shipped locally
- `images/` — 31 regular-car images
- `images/traffic/` — 12 available, verified traffic-car images
- `README.md` — project usage and release information

## Previous version notes

# Underground Studio 1.7.4 (previous release)

Offline save editor for NFS Underground 2 / nfsu2.xyz. Open `index.html` from the ZIP or use the single-file `.html` release. English default, German option.

## Changes in 1.7.4
- Every newly installed or replaced career car now starts with **stock performance**: all installed performance flags off, all nine Unique upgrades off, and all five 41-byte Dyno setups neutral (100). Existing cars are unaffected until the user chooses INSTALL CAR. Slot handles, ownership, identity, and visual-part hashes remain intact.
- **Factory appearance limitation:** the current save-only installer may use model-dependent donor visuals; it does not have a verified factory appearance template for every unseen model. Therefore `stock` here means stock *performance*, not guaranteed factory body and paint.
- Body Shop now explicitly displays **(Experimental)** in both languages.
- Traffic cars in Add / Replace Car are alphabetically sorted by their *displayed* English or German names.
- All prior functionality, images, traffic presets and exports remain intact.

## Earlier changes
- Remove Car from Slot: marks selected, unlocked car as unowned while preserving its native record/handle. Requires another usable car in garage; create a backup and switch away from the car in-game before importing. This is **experimental**, not confirmed for active-car references or all extended-slot cases.
- Career Stage dropdown and Apply Stage button are stacked vertically.
- Install All Parts follows hackch's MAX OUT: 54 active non-visual installed-part bytes (excluding inactive IDs 33/34 and aero-derived 56–67), plus nine Unique values. No purchase bookkeeping or car physics is changed. These parts can conflict.
- When a category has every active installed-part flag set, its Extreme button is visibly selected, including after MAX OUT. The raw count remains accurate (`installed/available`); Extreme indicates MAX OUT display state rather than a conflict-free Stage 3 installation.
- The duplicate Unique-upgrades panel is hidden; the nine toggles in the Performance Shop remain available.
- Garage cards, 31 offline car images, traffic career presets, Dyno editor and existing backup/export workflow remain intact.

## Source
Compared with https://hackch.github.io/NFSU2-Savegame-Editor/ and project technical notes, including the MIT implementation documentation.

Always keep your original game save before editing. Tests cover file structure and simulated UI; gameplay removal needs an in-game test.
