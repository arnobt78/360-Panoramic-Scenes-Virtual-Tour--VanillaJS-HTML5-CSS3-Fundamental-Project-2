# 360° Panoramic Scenes Virtual Tour - JavaScript (Vanilla), HTML5, CSS3, Marzipano Viewer Library Fundamental Project 2 (Framework-free SPA)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Marzipano](https://img.shields.io/badge/Marzipano-360°_Viewer-1f8ceb)](https://www.marzipano.net/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

A beginner-friendly, framework-free 360° virtual tour web app designed for learning modern frontend fundamentals while building something practical and interactive. It demonstrates how to combine panoramic scene rendering, reusable UI patterns, responsive design, and deployment-ready structure using only vanilla JavaScript, HTML, and CSS.

- **Live Demo:** [https://360-panoramic-tour.vercel.app/](https://360-panoramic-tour.vercel.app/)

![Demo Screenshot 1](https://github.com/user-attachments/assets/7b8b2513-1dcb-48c8-a217-3e764fba73e5)
![Demo Screenshot 2](https://github.com/user-attachments/assets/a8d6f8c0-7985-4709-af20-41d60764144a)
![Demo Screenshot 3](https://github.com/user-attachments/assets/dcc83401-6697-4bf0-b980-954ea513c8e4)
![Demo Screenshot 4](https://github.com/user-attachments/assets/71277421-fc6a-42c3-b616-28de4376e864)
![Demo Screenshot 5](https://github.com/user-attachments/assets/16802d7f-8fb3-40d0-86eb-58a23d855aa9)
![Demo Screenshot 6](https://github.com/user-attachments/assets/f1bc51db-d785-47a2-862c-00b227d3e64d)

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack & Libraries](#tech-stack--libraries)
- [Project Structure](#project-structure)
- [How the Project Works](#how-the-project-works)
- [Environment Variables (.env)](#environment-variables-env)
- [Installation & Local Run](#installation--local-run)
- [Linting & Build](#linting--build)
- [Deployment (Vercel)](#deployment-vercel)
- [Detailed File Walkthrough](#detailed-file-walkthrough)
- [Reusability Guide](#reusability-guide)
- [Extending the Project](#extending-the-project)
- [Beginner Learning Notes](#beginner-learning-notes)
- [API / Backend Notes](#api--backend-notes)
- [Keywords](#keywords)
- [Conclusion](#conclusion)

---

## Project Overview

`360-virtual-tour` is a static Single Page Application (SPA) that lets users:

- explore multiple 360° panoramic scenes,
- switch scenes using sidebar navigation and hotspot links,
- use autorotate and fullscreen controls,
- interact with a modern educational UI shell (cards, tabs, table, FAQ, badges, gallery).

The app uses scene data from `data.js` and renders visuals from tiled panoramic assets stored under `tiles/`.

---

## Key Features

- Interactive 360° panorama viewer using Marzipano
- Scene-to-scene navigation via clickable hotspots
- Info hotspot modal support on mobile
- Scene list sidebar with current-scene highlight
- Fullscreen stage mode for immersive viewing
- Autorotate toggle
- Responsive layout (desktop + mobile)
- Reusable UI sections for educational showcase:
  - feature cards
  - tabs
  - FAQ dropdowns
  - badge stats
  - dynamic gallery with offline fallback
- SEO metadata optimized for discoverability
- Vercel-ready static deployment pipeline (`dist/` output)

---

## Tech Stack & Libraries

### Core

- **JavaScript (Vanilla)**: app logic, interactivity, rendering helpers
- **HTML5**: semantic structure
- **CSS3**: custom design system, animation, responsiveness

### Libraries

- **[Marzipano](https://www.marzipano.net/):** renders and controls 360° panoramic scenes
- **Screenfull:** normalized fullscreen API behavior across browsers
- **Bowser:** browser capability detection/fallback handling
- **Reset CSS (`vendor/reset.min.css`)**: baseline style normalization

### Tooling

- **ESLint:** code quality checks
- **Node scripts:** static file build/copy for deployment

---

## Project Structure

```bash
360-virtual-tour/
├── index.html                     # Main page structure + metadata
├── index.js                       # Viewer setup + reusable UI rendering logic
├── style.css                      # Full styling system and responsive rules
├── data.js                        # Scene graph, hotspots, initial camera params
├── tiles/                         # Panorama tiles + preview assets per scene
├── public/
│   ├── favicon.svg                # Favicon / logo
│   └── images/                    # UI control icons
├── vendor/                        # Third-party browser libraries
├── scripts/
│   └── copy-static.mjs            # Build script to create dist/
├── docs/                          # Project/deployment/styling notes
├── package.json                   # Scripts + dev dependencies
├── vercel.json                    # Build/output/SPA rewrite config
└── README.md                      # Project documentation
```

---

## How the Project Works

### 1) Scene Data Layer (`data.js`)

Defines a global `APP_DATA` object with:

- scene ids and names,
- tile level sizes,
- initial yaw/pitch/fov,
- link hotspots (`target` scene),
- info hotspots (title/text blocks),
- viewer settings.

### 2) Viewer Layer (`index.js`)

- initializes Marzipano viewer,
- creates scene instances dynamically from `APP_DATA`,
- binds controls (up/down/left/right/zoom),
- handles sidebar switching,
- handles fullscreen/autorotate,
- renders additional educational UI modules.

### 3) UI Layer (`index.html` + `style.css`)

- top navigation and hero section,
- embedded tour stage,
- reusable content sections (cards, tabs, gallery, table, FAQ),
- responsive behavior and transitions.

---

## Environment Variables (.env)

This project runs **without any required `.env` file**.

### Required variables

- **None**

### Optional variables (only if you extend functionality)

If you later move to dynamic image APIs or analytics:

- `UNSPLASH_ACCESS_KEY` (only if using official Unsplash API endpoints)
- `VITE_ANALYTICS_ID` or similar (if analytics integration is added in future)

For the current setup, image fallback works without keys, and deployment is purely static.

---

## Installation & Local Run

### Option A: Simple static server (fastest)

```sh
python3 -m http.server 8000
```

Open: [http://localhost:8000](http://localhost:8000)

### Option B: Node workflow

```sh
npm install
npm run build
```

Then serve `dist/` with any static server.

---

## Linting & Build

### Lint

```sh
npm run lint
```

### Build

```sh
npm run build
```

Build output goes to `dist/` via `scripts/copy-static.mjs`.

---

## Deployment (Vercel)

This project is configured as a plain JS static app:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA rewrite to avoid refresh 404:
  - all routes rewrite to `/index.html`

See full deployment instructions in:

- `docs/VERCEL-PLAIN-JS-DEPLOY.md`

---

## Detailed File Walkthrough

### `index.html`

- contains SEO metadata,
- loads styles/scripts/vendors,
- defines all layout sections and Marzipano control elements.

### `index.js`

- reusable helper functions for element creation/rendering,
- scene creation and event wiring,
- hotspot creation logic,
- mobile/desktop mode handling,
- section rendering for gallery/cards/tabs/FAQ.

### `style.css`

- color tokens and design variables,
- reusable classes (`max-w-9xl`, cards, badges, tables),
- scene control skinning,
- responsive breakpoints,
- reduced-motion accessibility handling.

### `data.js`

- source of truth for all scenes/hotspots.

### `scripts/copy-static.mjs`

- copies runtime files and directories to `dist/`,
- cleans stale build output before each build.

---

## Reusability Guide

You can reuse this project in other virtual tour apps by copying:

- `index.js` scene bootstrap + hotspot functions
- `style.css` control styles and section components
- `scripts/copy-static.mjs` static deployment build logic

### Reuse pattern example (UI render helper)

```js
function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === "string") el.textContent = text;
  return el;
}
```

This keeps rendering logic clean and beginner-friendly.

---

## Extending the Project

### Add a new scene

1. Add scene tiles under `tiles/<scene-id>/`
2. Add scene object in `data.js`
3. Add matching sidebar item in `index.html` (or generate dynamically if you prefer)

### Add a new hotspot

Add to `linkHotspots` or `infoHotspots` in the target scene object in `data.js`.

### Add a new educational section

1. Create a container in `index.html`
2. Add styles in `style.css`
3. Render with a reusable `init...()` function in `index.js`

---

## Beginner Learning Notes

This project is useful to learn:

- DOM selection, events, and state-by-class toggles
- modular vanilla JS patterns without frameworks
- responsive CSS strategies
- progressive enhancement for fullscreen and touch behavior
- static deployment architecture (build + rewrite)
- SEO metadata fundamentals in pure HTML

---

## API / Backend Notes

- **Backend:** None
- **Database:** None
- **External runtime API:** None required
- **Architecture type:** fully static frontend SPA

All scene and navigation logic is client-side and data-driven from local files.

---

## Keywords

360° virtual tour, panoramic scenes, Marzipano, Vanilla JavaScript, HTML5, CSS3, SPA, hotspot navigation, fullscreen panorama, responsive UI, educational frontend project, static deployment, Vercel.

---

## Conclusion

This project is a practical and educational foundation for anyone learning frontend fundamentals through an interactive real-world build. It is intentionally framework-free, easy to inspect, and simple to extend into real estate tours, campus walkthroughs, museums, hospitality previews, and more.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
