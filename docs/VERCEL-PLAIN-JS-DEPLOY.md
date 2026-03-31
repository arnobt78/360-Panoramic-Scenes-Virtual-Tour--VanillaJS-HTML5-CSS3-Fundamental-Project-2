# Deploy a Plain JavaScript (HTML/CSS/JS) Project on Vercel

This guide shows how to deploy a static site (no framework) so Vercel gets a clear **build output** and serves your `index.html`. Copy the steps and files below into any plain JS project.

---

## Why this is needed

Vercel expects a **build step** and an **output directory**. A plain JS project usually has no build. So we:

1. Add a small Node script that copies your static files into a `dist/` folder.
2. Point Vercel’s **Output Directory** to `dist`.
3. Vercel runs the build, gets `dist/` with `index.html` at the root, and serves it.

---

## 1. Create the build script

Create **`scripts/copy-static.mjs`** in your project root:

```javascript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

// Root-level files to copy (customize for your project)
["index.html", "script.js", "styles.css"].forEach((f) => {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, f));
  }
});

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Static assets folder (e.g. images, favicon) – customize or remove if you don't have one
copyDir(path.join(root, "public"), path.join(dist, "public"));
```

**Customize:**

- **Root files:** Change the array `["index.html", "script.js", "styles.css"]` to match your files (e.g. add `favicon.ico`, other `.js`/`.css`).
- **Assets folder:** If you use a different folder than `public` (e.g. `assets`, `img`), change the last line to `copyDir(path.join(root, "assets"), path.join(dist, "assets"))` (and ensure your HTML references the same paths).
- **No assets folder:** Remove or comment out the `copyDir(...)` call if you have no such folder.

---

## 2. Add build scripts to `package.json`

In **`package.json`**, add or update the `scripts` section:

```json
"scripts": {
  "build": "node scripts/copy-static.mjs",
  "vercel-build": "node scripts/copy-static.mjs"
}
```

- If your `package.json` has `"type": "module"`, the script can stay as `.mjs` (or use `.js` with `import`).
- If there is no `"type": "module"`, either add `"type": "module"` or rename the script to `copy-static.cjs` and use `require("fs")` / `require("path")` instead of `import`, and run `node scripts/copy-static.cjs` in the scripts above.

---

## 3. Add `vercel.json` in the project root

Create **`vercel.json`**:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- **`buildCommand`** – runs the copy script so `dist/` is created.
- **`outputDirectory`** – tells Vercel to serve from `dist` (where `index.html` lives).
- **`rewrites`** – optional: sends all routes to `index.html` (useful for client-side routing or clean URLs). If you only have a single `index.html` and no routing, you can omit `rewrites`.

---

## 4. Ignore `dist` in Git

In **`.gitignore`**, ensure you have:

```
dist
```

So the built `dist/` folder is not committed; Vercel will build it on deploy.

---

## 5. Vercel project settings (dashboard)

In the Vercel project:

1. **Settings → General → Root Directory**  
   Set to the folder that contains this project (e.g. `image-swiper-jquery`) if the repo has multiple apps.

2. **Settings → Build & Deployment**
   - **Build Command:** `npm run build` (or leave override off so Vercel uses the script from `package.json`).
   - **Output Directory:** `dist`.
   - **Framework Preset:** Other (or leave as detected).

3. Save and redeploy.

---

## 6. Check locally (optional)

From the project root:

```bash
npm run build
```

Then open `dist/index.html` in a browser or run a local server from `dist/` (e.g. `npx serve dist -l 3000`) to confirm paths (e.g. to `script.js`, `styles.css`, `public/...`) work.

---

## Quick checklist for a new project

| Step | Action |
|------|--------|
| 1 | Create `scripts/copy-static.mjs` (adjust file list and `public` if needed). |
| 2 | Add `"build"` and `"vercel-build"` in `package.json` → `node scripts/copy-static.mjs`. |
| 3 | Add `vercel.json` with `buildCommand`, `outputDirectory`: `"dist"`, and optional `rewrites`. |
| 4 | Add `dist` to `.gitignore`. |
| 5 | In Vercel: set Output Directory to `dist`, then deploy. |

After that, pushing to the connected branch should build and serve your plain JS project from `index.html` in `dist/`.
