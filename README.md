# 360° Panoramic Scenes Virtual Tour Brain Tree - JavaScript (Vanilla), HTML5, CSS3, History API, Intersection Observer Fundamental Project 2 (Framework-free SPA)

A browser-based 360° virtual tour, a Braintree web application. It allows users to explore panoramic scenes, navigate between different rooms or areas, and interact with hotspots for information or navigation. The app is built using [Marzipano](https://www.marzipano.net/), a 360° media viewer library, and is fully client-side, requiring no backend server.

- **Live Demo:** [https://braintree-virtual-tour.netlify.app/](https://braintree-virtual-tour.netlify.app/)

---

## Table of Contents

- [Project Summary](#project-summary)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [How It Works](#how-it-works)
- [How to Run](#how-to-run)
- [Component & API Walkthrough](#component--api-walkthrough)
- [Reusing Components](#reusing-components)
- [Example Usage](#example-usage)
- [Keywords](#keywords)
- [Conclusion](#conclusion)

---

## Features

- Interactive 360° panoramic viewer
- Scene navigation via clickable hotspots
- Info hotspots for contextual information
- Responsive design for desktop and mobile
- Fullscreen and autorotate support
- Scene list for quick navigation
- Keyboard and button controls for view movement and zoom

---

## Project Structure

```bash
360-virtual-tour/
├── data.js              # Scene and hotspot configuration (JSON)
├── index.html           # Main HTML file
├── index.js             # Main JavaScript logic
├── style.css            # Custom styles
├── vendor/              # Third-party libraries (Marzipano, Bowser, etc.)
├── /public/images                 # UI icons and images
└── tiles/               # Panoramic image tiles for each scene
```

---

## Technologies Used

- **HTML5/CSS3/JavaScript**: Core web technologies
- **[Marzipano](https://www.marzipano.net/)**: 360° panorama viewer
- **Bowser**: Browser detection
- **Screenfull**: Fullscreen API wrapper
- **Eric Meyer's Reset CSS**: CSS reset for cross-browser consistency

---

## How It Works

- The app loads scene and hotspot data from `data.js`.
- `index.html` provides the UI structure, including the panorama container, scene list, and controls.
- `index.js` initializes Marzipano, loads scenes, sets up navigation and info hotspots, and manages UI interactions (fullscreen, autorotate, etc).
- Panoramic images are stored in the `tiles/` directory, organized by scene and resolution level.
- The UI is styled via `style.css` and uses icons from the `/public/images` folder.

---

## How to Run

1. **Clone or download the repository.**
2. **Start a local HTTP server in the project directory:**
   - With Python 3:

     ```sh
     python3 -m http.server 8000
     ```

   - With Python 2:

     ```sh
     python -m SimpleHTTPServer 8000
     ```

3. **Open your browser and go to:**
   [http://localhost:8000](http://localhost:8000)

---

## Component & API Walkthrough

### 1. `data.js`

- Contains a global `APP_DATA` object with all scene definitions, levels, initial view parameters, and hotspot data.
- Each scene has:
  - `id`, `name`, `levels` (tile resolutions), `faceSize`, `initialViewParameters`, `linkHotspots`, `infoHotspots`.

### 2. `index.html`

- Loads all scripts and styles.
- Contains UI elements: panorama container (`#pano`), scene list, title bar, control buttons.

### 3. `index.js`

- Initializes Marzipano viewer and loads scenes from `APP_DATA`.
- Sets up navigation and info hotspots.
- Handles UI events: scene switching, autorotate, fullscreen, view controls.
- Responsive: switches between desktop and mobile layouts.

### 4. `style.css`

- Styles for layout, controls, scene list, hotspots, and responsive design.

### 5. `vendor/`

- `marzipano.js`: 360° viewer library
- `bowser.min.js`: Browser detection
- `screenfull.min.js`: Fullscreen API
- `reset.min.css`: CSS reset

### 6. `tiles/`

- Contains subfolders for each scene (e.g., `0-entrance/`), each with preview and tiled images for multiple resolutions and cube faces.

### 7. `/public/images`

- UI icons for controls and hotspots (e.g., play, pause, fullscreen, info, arrows).

---

## Reusing Components

- **Marzipano Integration**: You can reuse the Marzipano setup (`index.js`) in other projects by providing your own `data.js` and image tiles.
- **Hotspot Logic**: The functions for creating link and info hotspots are modular and can be adapted for other interactive 360° viewers.
- **UI Controls**: The control logic (autorotate, fullscreen, view movement) is generic and can be ported to similar projects.

---

## Example Usage

To add a new scene:

1. Add a new folder in `tiles/` with the required image tiles and a `preview.jpg`.
2. Add a new scene object in `data.js` with the correct `id`, `name`, and parameters.
3. Add a new entry in the scene list in `index.html`.

To add a hotspot:

- Add a `linkHotspot` or `infoHotspot` entry in the relevant scene in `data.js`.

---

## Keywords

360°, panorama, virtual tour, Marzipano, JavaScript, web app, interactive, hotspot, fullscreen, responsive, scene navigation, info hotspot, open source

---

## Conclusion

This project is a robust template for building interactive 360° virtual tours on the web. It is easy to extend with new scenes, hotspots, and UI customizations. Perfect for real estate, education, museums, or any scenario requiring immersive navigation.

---

Happy coding! :sparkles:

Thank you!
