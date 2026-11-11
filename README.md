# NFSU2 Studio

**A browser-based save editor for Need for Speed: Underground 2.** Edit your Career and Arcade garages, customize vehicles, and experiment with performance setups without modifying the game's files.

## 🎮 Open the editor

**[Launch NFSU2 Studio in your browser](https://xdomokun.github.io/nfsu2-studio/)**

No installation required. The editor runs locally in your browser; your save files are processed on your device.

## Features

- **Career garage:** Manage garage slots, add or replace vehicles, edit cash and career progress, and unlock available customization parts for the selected car.
- **Arcade garage:** Assign vehicles to all 20 slots, move or swap them via drag & drop, and fill the garage with Street or Traffic Cars.
- **46 vehicles:** 31 Street Cars and 15 Traffic Cars, all with image previews and searchable selection.
- **Performance editing:** Upgrade parts, adjust Dyno setups, use race presets, and apply separate experimental tuning profiles to Traffic Cars.
- **Game physics data:** Integrated vehicle baseline data extracted from a modded GLOBALB file; optionally load another GLOBALB for comparison.
- **Save handling:** Import compatible NFSU2 save files or ZIP exports, then export the edited save with repaired checksums.
- **Languages:** English and German.

## Getting started

1. **[Open NFSU2 Studio](https://xdomokun.github.io/nfsu2-studio/)**.
2. Load a compatible save file or a ZIP export from [nfsu2.xyz](https://nfsu2.xyz/).
3. Choose **Arcade** or **Career** and make your changes.
4. Export your edited save and import it back into your game workflow.

**Always back up your original save before editing.** Some experimental Traffic Car tuning and newly generated garage configurations may not behave as expected in-game.

## Performance indicators

The Top Speed, Acceleration and Handling bars are **estimates** based on savegame upgrades, tuning and available vehicle baseline data. They are inspired by the game's interface, but **do not reproduce the game's verified internal rating formula**. Higher bars do not guarantee higher real-world in-game performance.

## Project structure

```text
nfsu2-studio/
├── index.html       # Complete editor: HTML, CSS and JavaScript
├── images/          # Street and Traffic Car previews
└── README.md
```

The editor needs no build step. For GitHub Pages, place `index.html` and `images/` at the site root.

## Disclaimer

NFSU2 Studio is an unofficial fan project and is not affiliated with or endorsed by Electronic Arts or EA Black Box. *Need for Speed* and related assets belong to their respective owners. Vehicle artwork and third-party components may have separate rights; no open-source license is implied for them.
