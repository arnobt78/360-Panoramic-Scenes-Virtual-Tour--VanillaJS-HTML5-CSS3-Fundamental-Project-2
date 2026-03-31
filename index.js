"use strict";

(function () {
  // Core third-party libraries are injected globally via script tags in index.html.
  const Marzipano = window.Marzipano;
  const bowser = window.bowser;
  const screenfull = window.screenfull;
  const data = window.APP_DATA;

  const panoElement = document.querySelector("#pano");
  const sceneNameElement = document.querySelector("#titleBar .sceneName");
  const sceneListElement = document.querySelector("#sceneList");
  const sceneListUlElement = document.querySelector("#sceneList .scenes");
  let sceneElements = [];
  const sceneListToggleElement = document.querySelector("#sceneListToggle");
  const autorotateToggleElement = document.querySelector("#autorotateToggle");
  const fullscreenToggleElement = document.querySelector("#fullscreenToggle");
  const fullscreenTargetElement = document.querySelector("#tourExperience");
  const sceneSearchInputElement = document.querySelector("#sceneSearchInput");
  const sceneTypeFilterElement = document.querySelector("#sceneTypeFilter");
  const clearSceneFiltersBtnElement = document.querySelector("#clearSceneFiltersBtn");
  const floorMiniMapElement = document.querySelector("#floorMiniMap");
  const loadingOverlayElement = document.querySelector("#sceneLoadingOverlay");
  const tourPrevBtnElement = document.querySelector("#tourPrevBtn");
  const tourNextBtnElement = document.querySelector("#tourNextBtn");
  const tourPlayBtnElement = document.querySelector("#tourPlayBtn");
  const tourProgressBarElement = document.querySelector("#tourProgressBar");
  const shortcutHelpBtnElement = document.querySelector("#shortcutHelpBtn");
  const shortcutModalElement = document.querySelector("#shortcutModal");
  const closeShortcutModalBtnElement = document.querySelector("#closeShortcutModalBtn");
  const copySceneLinkBtnElement = document.querySelector("#copySceneLinkBtn");

  // ---------- Reusable DOM helpers ----------
  function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (typeof text === "string") {
      el.textContent = text;
    }
    return el;
  }

  function clearAndAppend(root, nodes) {
    root.innerHTML = "";
    nodes.forEach((node) => root.appendChild(node));
  }

  function sanitize(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ---------- Device mode detection ----------
  // We map viewport size into body classes so CSS can switch UI behavior.
  if (window.matchMedia) {
    const mql = window.matchMedia("(max-width: 680px), (max-height: 560px)");
    const setMode = function () {
      document.body.classList.toggle("mobile", mql.matches);
      document.body.classList.toggle("desktop", !mql.matches);
    };
    setMode();
    mql.addEventListener("change", setMode);
  } else {
    document.body.classList.add("desktop");
  }

  document.body.classList.add("no-touch");
  // On first touch interaction, flip into touch mode for hover/focus UI adjustments.
  window.addEventListener("touchstart", function () {
    document.body.classList.remove("no-touch");
    document.body.classList.add("touch");
  });

  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add("tooltip-fallback");
  }

  // ---------- Marzipano initialization ----------
  // Viewer is the main camera/render controller for panoramic scenes.
  const viewer = new Marzipano.Viewer(panoElement, {
    controls: {
      mouseViewMode: data.settings.mouseViewMode,
    },
  });

  const scenes = data.scenes.map(function (sceneData) {
    // Build tile source path from scene id; Marzipano requests level tiles on demand.
    const source = Marzipano.ImageUrlSource.fromString(
      "tiles/" + sceneData.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: "tiles/" + sceneData.id + "/preview.jpg" },
    );
    const geometry = new Marzipano.CubeGeometry(sceneData.levels);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      (100 * Math.PI) / 180,
      (120 * Math.PI) / 180,
    );
    const view = new Marzipano.RectilinearView(
      sceneData.initialViewParameters,
      limiter,
    );

    // A scene combines source + geometry + view config.
    const scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    sceneData.linkHotspots.forEach(function (hotspot) {
      const element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
      });
    });

    sceneData.infoHotspots.forEach(function (hotspot) {
      const element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
      });
    });

    return { data: sceneData, scene, view };
  });

  const uiState = {
    activeFloor: "all",
    activeType: "",
    searchTerm: "",
    guidedTourPlaying: false,
    guidedTourTimer: null,
    guidedTourStepMs: 5000,
    currentSceneId: scenes[0] ? scenes[0].data.id : "",
  };

  const autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2,
  });

  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add("enabled");
  }

  autorotateToggleElement.addEventListener("click", toggleAutorotate);
  sceneListToggleElement.addEventListener("click", toggleSceneList);

  if (screenfull.enabled) {
    document.body.classList.add("fullscreen-enabled");
    fullscreenToggleElement.addEventListener("click", function () {
      if (fullscreenTargetElement) {
        // Toggle only the tour stage so panorama becomes true viewport fullscreen.
        screenfull.toggle(fullscreenTargetElement);
      } else {
        screenfull.toggle();
      }
    });
    screenfull.on("change", function () {
      fullscreenToggleElement.classList.toggle("enabled", screenfull.isFullscreen);
    });
  } else {
    document.body.classList.add("fullscreen-disabled");
  }

  if (!document.body.classList.contains("mobile")) {
    showSceneList();
  }

  renderFloorMiniMap();
  renderSceneTypeFilter();
  renderSceneList();
  attachSceneFilterHandlers();
  attachGuidedTourHandlers();
  attachShortcutHandlers();
  attachCopyLinkHandler();

  registerViewControlButtons(viewer);

  // ---------- Educational showcase UI ----------
  initShowcaseContent();
  initTabs();
  initFaq();
  initFooterYear();
  initScrollReveal();
  initParallax();

  switchScene(resolveInitialSceneFromUrl() || scenes[0]);

  function switchScene(sceneObject) {
    showSceneLoadingOverlay();
    // Reset camera to scene's initial angles each time for predictable UX.
    stopAutorotate();
    sceneObject.view.setParameters(sceneObject.data.initialViewParameters);
    sceneObject.scene.switchTo();
    startAutorotate();
    updateSceneName(sceneObject);
    updateSceneList(sceneObject);
    uiState.currentSceneId = sceneObject.data.id;
    updateTourProgress(sceneObject);
    syncSceneToUrl(sceneObject.data.id);
    window.setTimeout(hideSceneLoadingOverlay, 320);
  }

  function updateSceneName(sceneObject) {
    sceneNameElement.innerHTML = sanitize(sceneObject.data.name);
  }

  function updateSceneList(sceneObject) {
    sceneElements.forEach((el) => {
      const isCurrent = el.getAttribute("data-id") === sceneObject.data.id;
      el.classList.toggle("current", isCurrent);
    });
  }

  function showSceneList() {
    sceneListElement.classList.add("enabled");
    sceneListToggleElement.classList.add("enabled");
  }

  function hideSceneList() {
    sceneListElement.classList.remove("enabled");
    sceneListToggleElement.classList.remove("enabled");
  }

  function toggleSceneList() {
    sceneListElement.classList.toggle("enabled");
    sceneListToggleElement.classList.toggle("enabled");
  }

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains("enabled")) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(2500, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    autorotateToggleElement.classList.toggle("enabled");
    if (autorotateToggleElement.classList.contains("enabled")) {
      startAutorotate();
    } else {
      stopAutorotate();
    }
  }

  function normalizeSceneMeta(sceneData) {
    return {
      floor: sceneData.floor || "General",
      type: sceneData.type || "Other",
      tags: Array.isArray(sceneData.tags) ? sceneData.tags : [],
    };
  }

  function getFilteredScenes() {
    return scenes.filter(function (sceneObject) {
      const sceneData = sceneObject.data;
      const meta = normalizeSceneMeta(sceneData);
      const searchText = (
        sceneData.name +
        " " +
        meta.floor +
        " " +
        meta.type +
        " " +
        meta.tags.join(" ")
      ).toLowerCase();
      const matchesFloor =
        uiState.activeFloor === "all" || meta.floor === uiState.activeFloor;
      const matchesType =
        !uiState.activeType || meta.type.toLowerCase() === uiState.activeType;
      const matchesSearch =
        !uiState.searchTerm ||
        searchText.indexOf(uiState.searchTerm.toLowerCase()) !== -1;
      return matchesFloor && matchesType && matchesSearch;
    });
  }

  function renderSceneList() {
    const filtered = getFilteredScenes();
    sceneListUlElement.innerHTML = "";

    if (filtered.length === 0) {
      const empty = createElement("li", "text", "No scenes match this filter.");
      sceneListUlElement.appendChild(empty);
      sceneElements = [];
      return;
    }

    filtered.forEach(function (sceneObject) {
      const anchor = createElement("a", "scene");
      const item = createElement("li", "text", sceneObject.data.name);
      anchor.href = "javascript:void(0)";
      anchor.setAttribute("data-id", sceneObject.data.id);
      anchor.appendChild(item);
      anchor.addEventListener("click", function () {
        switchScene(sceneObject);
        if (document.body.classList.contains("mobile")) {
          hideSceneList();
        }
      });
      sceneListUlElement.appendChild(anchor);
    });

    sceneElements = sceneListElement.querySelectorAll(".scene");
    const currentScene = findSceneById(uiState.currentSceneId);
    if (currentScene) {
      updateSceneList(currentScene);
    }
  }

  function renderFloorMiniMap() {
    if (!floorMiniMapElement) {
      return;
    }
    const floors = Array.from(
      new Set(
        scenes.map(function (sceneObject) {
          return normalizeSceneMeta(sceneObject.data).floor;
        }),
      ),
    );
    const allFloors = ["all"].concat(floors);
    floorMiniMapElement.innerHTML = "";
    allFloors.forEach(function (floorName) {
      const label = floorName === "all" ? "All Floors" : floorName;
      const chip = createElement("button", "floor-chip", label);
      chip.type = "button";
      chip.classList.toggle("active", uiState.activeFloor === floorName);
      chip.addEventListener("click", function () {
        uiState.activeFloor = floorName;
        renderFloorMiniMap();
        renderSceneList();
      });
      floorMiniMapElement.appendChild(chip);
    });
  }

  function renderSceneTypeFilter() {
    if (!sceneTypeFilterElement) {
      return;
    }
    const types = Array.from(
      new Set(
        scenes.map(function (sceneObject) {
          return normalizeSceneMeta(sceneObject.data).type;
        }),
      ),
    );
    sceneTypeFilterElement.innerHTML = '<option value="">All types</option>';
    types.forEach(function (typeName) {
      const option = createElement("option");
      option.value = typeName.toLowerCase();
      option.textContent = typeName;
      sceneTypeFilterElement.appendChild(option);
    });
  }

  function attachSceneFilterHandlers() {
    if (sceneSearchInputElement) {
      sceneSearchInputElement.addEventListener("input", function (event) {
        uiState.searchTerm = event.target.value.trim();
        renderSceneList();
      });
    }
    if (sceneTypeFilterElement) {
      sceneTypeFilterElement.addEventListener("change", function (event) {
        uiState.activeType = event.target.value;
        renderSceneList();
      });
    }
    if (clearSceneFiltersBtnElement) {
      clearSceneFiltersBtnElement.addEventListener("click", function () {
        uiState.searchTerm = "";
        uiState.activeType = "";
        uiState.activeFloor = "all";
        if (sceneSearchInputElement) {
          sceneSearchInputElement.value = "";
        }
        if (sceneTypeFilterElement) {
          sceneTypeFilterElement.value = "";
        }
        renderFloorMiniMap();
        renderSceneList();
      });
    }
  }

  function getCurrentSceneIndex() {
    return scenes.findIndex(function (sceneObject) {
      return sceneObject.data.id === uiState.currentSceneId;
    });
  }

  function goToNextScene() {
    const index = getCurrentSceneIndex();
    if (index < 0) {
      return;
    }
    switchScene(scenes[(index + 1) % scenes.length]);
  }

  function goToPrevScene() {
    const index = getCurrentSceneIndex();
    if (index < 0) {
      return;
    }
    const nextIndex = (index - 1 + scenes.length) % scenes.length;
    switchScene(scenes[nextIndex]);
  }

  function adjustZoom(delta) {
    const current = findSceneById(uiState.currentSceneId);
    if (!current) {
      return;
    }
    const currentParams = current.view.parameters();
    current.view.setParameters({
      fov: currentParams.fov + delta,
    });
  }

  function nudgeView(deltaYaw, deltaPitch) {
    const current = findSceneById(uiState.currentSceneId);
    if (!current) {
      return;
    }
    const params = current.view.parameters();
    current.view.setParameters({
      yaw: params.yaw + deltaYaw,
      pitch: params.pitch + deltaPitch,
    });
  }

  function setGuidedTourPlaying(isPlaying) {
    uiState.guidedTourPlaying = isPlaying;
    if (tourPlayBtnElement) {
      tourPlayBtnElement.textContent = isPlaying ? "Tour Pause" : "Tour Play";
    }
    if (!isPlaying && uiState.guidedTourTimer) {
      window.clearInterval(uiState.guidedTourTimer);
      uiState.guidedTourTimer = null;
    }
    if (isPlaying && !uiState.guidedTourTimer) {
      uiState.guidedTourTimer = window.setInterval(function () {
        goToNextScene();
      }, uiState.guidedTourStepMs);
    }
  }

  function updateTourProgress(sceneObject) {
    if (!tourProgressBarElement) {
      return;
    }
    const index = scenes.findIndex(function (item) {
      return item.data.id === sceneObject.data.id;
    });
    const progress = ((index + 1) / scenes.length) * 100;
    tourProgressBarElement.style.width = progress + "%";
  }

  function attachGuidedTourHandlers() {
    if (tourNextBtnElement) {
      tourNextBtnElement.addEventListener("click", goToNextScene);
    }
    if (tourPrevBtnElement) {
      tourPrevBtnElement.addEventListener("click", goToPrevScene);
    }
    if (tourPlayBtnElement) {
      tourPlayBtnElement.addEventListener("click", function () {
        setGuidedTourPlaying(!uiState.guidedTourPlaying);
      });
    }
  }

  function openShortcutModal() {
    if (!shortcutModalElement) {
      return;
    }
    shortcutModalElement.classList.add("open");
    shortcutModalElement.setAttribute("aria-hidden", "false");
  }

  function closeShortcutModal() {
    if (!shortcutModalElement) {
      return;
    }
    shortcutModalElement.classList.remove("open");
    shortcutModalElement.setAttribute("aria-hidden", "true");
  }

  function attachShortcutHandlers() {
    if (shortcutHelpBtnElement) {
      shortcutHelpBtnElement.addEventListener("click", openShortcutModal);
    }
    if (closeShortcutModalBtnElement) {
      closeShortcutModalBtnElement.addEventListener("click", closeShortcutModal);
    }
    if (shortcutModalElement) {
      shortcutModalElement.addEventListener("click", function (event) {
        if (event.target.matches("[data-close-shortcuts='true']")) {
          closeShortcutModal();
        }
      });
    }
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeShortcutModal();
        return;
      }
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        if (screenfull.enabled) {
          screenfull.toggle(fullscreenTargetElement || undefined);
        }
      } else if (event.code === "Space") {
        event.preventDefault();
        toggleAutorotate();
      } else if (event.key === "n" || event.key === "N") {
        goToNextScene();
      } else if (event.key === "p" || event.key === "P") {
        goToPrevScene();
      } else if (event.key === "ArrowLeft") {
        nudgeView(-0.08, 0);
      } else if (event.key === "ArrowRight") {
        nudgeView(0.08, 0);
      } else if (event.key === "ArrowUp") {
        nudgeView(0, -0.05);
      } else if (event.key === "ArrowDown") {
        nudgeView(0, 0.05);
      } else if (event.key === "+" || event.key === "=") {
        adjustZoom(-0.06);
      } else if (event.key === "-" || event.key === "_") {
        adjustZoom(0.06);
      }
    });
  }

  function showSceneLoadingOverlay() {
    if (loadingOverlayElement) {
      loadingOverlayElement.classList.add("active");
    }
    if (fullscreenTargetElement) {
      fullscreenTargetElement.classList.add("scene-switching");
    }
  }

  function hideSceneLoadingOverlay() {
    if (loadingOverlayElement) {
      loadingOverlayElement.classList.remove("active");
    }
    if (fullscreenTargetElement) {
      fullscreenTargetElement.classList.remove("scene-switching");
    }
  }

  function syncSceneToUrl(sceneId) {
    const hash = "#scene=" + encodeURIComponent(sceneId);
    if (window.location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
  }

  function resolveInitialSceneFromUrl() {
    const hash = window.location.hash || "";
    if (hash.indexOf("#scene=") !== 0) {
      return null;
    }
    const sceneId = decodeURIComponent(hash.replace("#scene=", ""));
    return findSceneById(sceneId);
  }

  function attachCopyLinkHandler() {
    if (!copySceneLinkBtnElement) {
      return;
    }
    copySceneLinkBtnElement.addEventListener("click", function () {
      const sceneId = uiState.currentSceneId;
      const url = window.location.origin + window.location.pathname + "#scene=" + encodeURIComponent(sceneId);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      }
      copySceneLinkBtnElement.textContent = "Copied";
      window.setTimeout(function () {
        copySceneLinkBtnElement.textContent = "Copy Link";
      }, 1200);
    });
  }

  function registerViewControlButtons(activeViewer) {
    const velocity = 0.7;
    const friction = 3;
    const controls = activeViewer.controls();
    const buttonMap = [
      ["upElement", "#viewUp", "y", -velocity],
      ["downElement", "#viewDown", "y", velocity],
      ["leftElement", "#viewLeft", "x", -velocity],
      ["rightElement", "#viewRight", "x", velocity],
      ["inElement", "#viewIn", "zoom", -velocity],
      ["outElement", "#viewOut", "zoom", velocity],
    ];

    // Register press-and-hold controls (up/down/left/right/zoom) on icon buttons.
    buttonMap.forEach(([methodName, selector, axis, speed]) => {
      const element = document.querySelector(selector);
      controls.registerMethod(
        methodName,
        new Marzipano.ElementPressControlMethod(element, axis, speed, friction),
        true,
      );
    });
  }

  function initShowcaseContent() {
    // Beginner-friendly data arrays can be edited without changing rendering logic.
    // Section content is data-driven so learners can edit arrays only.
    const featureItems = [
      ["Immersive Panorama", "Marzipano viewer with smooth scene transitions."],
      ["Modular UI", "Reusable cards, tabs, badges, and dropdown blocks."],
      ["Mobile First", "Responsive stacks and touch-friendly controls."],
      ["Deploy Ready", "Vercel SPA rewrite and static file friendly structure."],
    ];
    const galleryUrls = [
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
    ];
    const localGalleryFallbacks = [
      "/tiles/0-entrance/preview.jpg",
      "/tiles/1-main-corridor/preview.jpg",
      "/tiles/2-sun-lounge/preview.jpg",
      "/tiles/3-lounge-a/preview.jpg",
      "/tiles/4-lounge-b/preview.jpg",
      "/tiles/7-kitchen/preview.jpg",
    ];

    const featureRoot = document.querySelector("#featureCards");
    const heroBadgeRoot = document.querySelector("#heroBadges");
    const galleryRoot = document.querySelector("#dynamicGallery");
    const statsRoot = document.querySelector("#statsBadges");
    const tableRoot = document.querySelector("#sceneTable");
    const quickJumpRoot = document.querySelector("#sceneQuickJump");
    const sceneFilter = document.querySelector("#sceneFilter");

    clearAndAppend(
      heroBadgeRoot,
      ["Beginner Friendly", "Pure Vanilla", "Reusable Components", "Smooth UI"].map(
        (name) => createElement("span", "badge", name),
      ),
    );

    clearAndAppend(
      featureRoot,
      featureItems.map(([title, desc]) => {
        const card = createElement("article", "feature-card reveal");
        card.appendChild(createElement("h3", "", title));
        card.appendChild(createElement("p", "", desc));
        return card;
      }),
    );

    clearAndAppend(
      galleryRoot,
      galleryUrls.map((url, index) => {
        const item = createElement("figure", "gallery-item reveal");
        const img = createElement("img");
        // Offline-first: use Unsplash when online, fallback to local previews when offline.
        img.src = navigator.onLine ? url : localGalleryFallbacks[index % localGalleryFallbacks.length];
        img.alt = "Dynamic showcase image " + (index + 1);
        img.addEventListener("error", function () {
          // If remote image fails, recover instantly with local scene preview.
          img.src = localGalleryFallbacks[index % localGalleryFallbacks.length];
        });
        item.appendChild(img);
        return item;
      }),
    );

    const totalHotspots = data.scenes.reduce(function (sum, sceneData) {
      return sum + sceneData.linkHotspots.length + sceneData.infoHotspots.length;
    }, 0);

    const stats = [
      ["Scenes", String(data.scenes.length)],
      ["Hotspots", String(totalHotspots)],
      ["Tech Stack", "HTML + CSS + JS"],
      ["Deployment", "Vercel SPA"],
    ];

    clearAndAppend(
      statsRoot,
      stats.map(([k, v]) => {
        const tile = createElement("div", "badge-tile");
        tile.appendChild(createElement("strong", "", v));
        tile.appendChild(createElement("p", "", k));
        return tile;
      }),
    );

    // Render a compact scene summary table for educational inspection.
    tableRoot.innerHTML =
      "<thead><tr><th>Scene</th><th>Links</th><th>Info</th></tr></thead>" +
      "<tbody>" +
      data.scenes
        .map(function (sceneData) {
          return (
            "<tr><td>" +
            sanitize(sceneData.name) +
            "</td><td>" +
            sceneData.linkHotspots.length +
            "</td><td>" +
            sceneData.infoHotspots.length +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody>";

    const quickJumpButtons = scenes.slice(0, 6).map(function (sceneObject) {
      const btn = createElement("button", "quick-jump-btn", sceneObject.data.name);
      btn.type = "button";
      btn.addEventListener("click", function () {
        switchScene(sceneObject);
        document.querySelector("#tour").scrollIntoView({ behavior: "smooth" });
      });
      return btn;
    });
    clearAndAppend(quickJumpRoot, quickJumpButtons);

    sceneFilter.innerHTML =
      '<option value="">Jump to a scene</option>' +
      scenes
        .map(function (sceneObject) {
          return (
            '<option value="' +
            sceneObject.data.id +
            '">' +
            sanitize(sceneObject.data.name) +
            "</option>"
          );
        })
        .join("");

    sceneFilter.addEventListener("change", function (event) {
      const selectedId = event.target.value;
      if (!selectedId) {
        return;
      }
      const targetScene = findSceneById(selectedId);
      if (targetScene) {
        // Dropdown jump: switch directly to chosen scene.
        switchScene(targetScene);
      }
    });
  }

  function initTabs() {
    const root = document.querySelector("#learningTabs");
    const tabData = [
      {
        key: "components",
        title: "Reusable Components",
        text: "This project uses reusable render functions for cards, badges, gallery items and scene quick-jump actions.",
      },
      {
        key: "animation",
        title: "Animation Basics",
        text: "Intersection Observer drives fade/slide entrance. CSS transitions handle easing and smooth state changes.",
      },
      {
        key: "deployment",
        title: "Deployment",
        text: "A static setup with SPA rewrites allows clean refresh behavior on Vercel routes.",
      },
    ];

    const nav = createElement("div", "tabs-nav");
    const panel = createElement("article", "learning-panel");

    function renderTab(tabKey) {
      // Tab content swaps text panel without reloading sections.
      const current = tabData.find((item) => item.key === tabKey) || tabData[0];
      panel.innerHTML =
        "<h3>" + sanitize(current.title) + "</h3><p>" + sanitize(current.text) + "</p>";
      nav.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === current.key);
      });
    }

    tabData.forEach((item) => {
      const button = createElement("button", "tab-btn", item.title);
      button.type = "button";
      button.dataset.tab = item.key;
      button.addEventListener("click", function () {
        renderTab(item.key);
      });
      nav.appendChild(button);
    });

    root.appendChild(nav);
    root.appendChild(panel);
    renderTab(tabData[0].key);
  }

  function initFaq() {
    const root = document.querySelector("#faqDropdowns");
    const items = [
      [
        "Do I need an Unsplash API key?",
        "No. The page currently uses public Unsplash image URLs. You can add official API integration later if needed.",
      ],
      [
        "Why no framework?",
        "This is intentionally a beginner-focused vanilla project so you can learn direct DOM, events and CSS systems.",
      ],
      [
        "How do I add a new scene?",
        "Step 1: Create a new folder in tiles/ using the new scene id (for example tiles/12-new-room/) and include preview.jpg plus the z/f/y/x tile structure generated by Marzipano tools. Step 2: Add a new scene object in data.js with id, name, levels, faceSize, initialViewParameters, and hotspot arrays. Step 3: Add or update linkHotspots so the new scene can be reached from existing scenes. Step 4: Add a matching sidebar link in index.html with the same data-id value. Step 5: Run npm run build and open the project to verify scene switching, camera start position, and hotspot navigation.",
      ],
      [
        "How do I add or edit hotspots?",
        "Open data.js and update either linkHotspots (for scene-to-scene navigation) or infoHotspots (for text popups). Each hotspot needs yaw and pitch to place it correctly inside the 360 image. For link hotspots, set target to a valid scene id. For info hotspots, provide title and text.",
      ],
      [
        "How do I customize the UI design?",
        "Most visual customization is in style.css. Start with :root color variables, then adjust shared classes like .section-shell, .feature-card, and .tour-stage. Layout spacing and responsive behavior are controlled by .max-w-9xl and media queries near the bottom of style.css.",
      ],
      [
        "How do I deploy safely on Vercel?",
        "Use npm run build to generate dist/, then deploy with vercel.json settings (buildCommand and outputDirectory). The rewrite rule sends all routes to index.html, which prevents refresh 404 issues in SPA-style navigation.",
      ],
    ];

    // Native <details> gives accessible dropdown behavior with minimal JS.
    clearAndAppend(
      root,
      items.map(([q, a]) => {
        const details = createElement("details", "faq-item");
        const summary = createElement("summary", "", q);
        const answer = createElement("p", "", a);
        details.appendChild(summary);
        details.appendChild(answer);
        return details;
      }),
    );
  }

  function initScrollReveal() {
    const allRevealElements = document.querySelectorAll(".reveal");
    // IntersectionObserver runs one-time reveal animations as cards enter viewport.
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    allRevealElements.forEach((el) => io.observe(el));
  }

  function initParallax() {
    const layer = document.querySelector(".parallax-layer");
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    // Keep the background visually stable while scrolling.
    // If you want to re-enable parallax later, add a body class and animate carefully.
    layer.style.backgroundPosition = "center center";
  }

  function initFooterYear() {
    const line = document.querySelector("#copyrightLine");
    if (!line) {
      return;
    }
    // Keep copyright year current automatically.
    line.textContent = "\u00a9 " + new Date().getFullYear() + ". All rights reserved.";
  }

  function createLinkHotspotElement(hotspot) {
    const wrapper = createElement("div", "hotspot link-hotspot");
    const icon = createElement("img", "link-hotspot-icon");
    const tooltip = createElement("div", "hotspot-tooltip link-hotspot-tooltip");
    const targetData = findSceneDataById(hotspot.target);

    icon.src = "/public/images/link.png";
    icon.style.transform = "rotate(" + hotspot.rotation + "rad)";
    tooltip.textContent = targetData ? targetData.name : "Go to scene";

    // Clicking a link hotspot navigates to another scene id.
    wrapper.addEventListener("click", function () {
      const targetScene = findSceneById(hotspot.target);
      if (targetScene) {
        switchScene(targetScene);
      }
    });

    stopTouchAndScrollEventPropagation(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);
    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    const wrapper = createElement("div", "hotspot info-hotspot");
    const header = createElement("div", "info-hotspot-header");
    const iconWrapper = createElement("div", "info-hotspot-icon-wrapper");
    const icon = createElement("img", "info-hotspot-icon");
    const titleWrapper = createElement("div", "info-hotspot-title-wrapper");
    const title = createElement("div", "info-hotspot-title");
    const closeWrapper = createElement("div", "info-hotspot-close-wrapper");
    const closeIcon = createElement("img", "info-hotspot-close-icon");
    const text = createElement("div", "info-hotspot-text");

    icon.src = "/public/images/info.png";
    closeIcon.src = "/public/images/close.png";
    title.innerHTML = hotspot.title;
    text.innerHTML = hotspot.text;

    iconWrapper.appendChild(icon);
    titleWrapper.appendChild(title);
    closeWrapper.appendChild(closeIcon);
    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);
    wrapper.appendChild(header);
    wrapper.appendChild(text);

    // Mobile modal mirrors hotspot content to ensure readability on small screens.
    const modal = createElement("div", "info-hotspot-modal");
    modal.innerHTML = wrapper.innerHTML;
    document.body.appendChild(modal);

    const toggle = function () {
      wrapper.classList.toggle("visible");
      modal.classList.toggle("visible");
    };
    wrapper.querySelector(".info-hotspot-header").addEventListener("click", toggle);
    modal.querySelector(".info-hotspot-close-wrapper").addEventListener("click", toggle);

    stopTouchAndScrollEventPropagation(wrapper);
    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(element) {
    [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
      "wheel",
      "mousewheel",
    ].forEach((eventName) => {
      // Prevent hotspot interaction from also panning/zooming the panorama.
      element.addEventListener(eventName, function (event) {
        event.stopPropagation();
      });
    });
  }

  function findSceneById(id) {
    return scenes.find((sceneObject) => sceneObject.data.id === id) || null;
  }

  function findSceneDataById(id) {
    return data.scenes.find((sceneData) => sceneData.id === id) || null;
  }
})();
