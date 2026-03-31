import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

const rootFiles = ["index.html", "index.js", "style.css", "data.js", "LICENSE"];
const assetDirs = ["public", "vendor", "tiles"];

function copyDirectory(sourceDir, destinationDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }
  fs.mkdirSync(destinationDir, { recursive: true });

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

// Clean dist on every build to avoid stale files in deployments.
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

rootFiles.forEach((fileName) => {
  const sourcePath = path.join(root, fileName);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, path.join(dist, fileName));
  }
});

assetDirs.forEach((directoryName) => {
  copyDirectory(path.join(root, directoryName), path.join(dist, directoryName));
});

console.log("Static files copied to dist/");
