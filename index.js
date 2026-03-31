"use strict";

(function () {
  const Marzipano = window.Marzipano;
  const bowser = window.bowser;
  const screenfull = window.screenfull;
  const data = window.APP_DATA;

  const panoElement = document.querySelector("#pano");
  const sceneNameElement = document.querySelector("#titleBar .sceneName");
  const sceneListElement = document.querySelector("#sceneList");
  const sceneElements = document.querySelectorAll("#sceneList .scene");
  const sceneListToggleElement = document.querySelector("#sceneListToggle");
  const autorotateToggleElement = document.querySelector("#autorotateToggle");
  const fullscreenToggleElement = document.querySelector("#fullscreenToggle");
  const fullscreenTargetElement = document.querySelector("#tourExperience");

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
  window.addEventListener("touchstart", function () {
    document.body.classList.remove("no-touch");
    document.body.classList.add("touch");
  });

  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add("tooltip-fallback");
  }

  // ---------- Marzipano initialization ----------
  const viewer = new Marzipano.Viewer(panoElement, {
    controls: {
      mouseViewMode: data.settings.mouseViewMode,
    },
  });

  const scenes = data.scenes.map(function (sceneData) {
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

  scenes.forEach(function (sceneObject) {
    const link = document.querySelector(
      '#sceneList .scene[data-id="' + sceneObject.data.id + '"]',
    );
    if (!link) {
      return;
    }
    link.addEventListener("click", function () {
      switchScene(sceneObject);
      if (document.body.classList.contains("mobile")) {
        hideSceneList();
      }
    });
  });

  registerViewControlButtons(viewer);

  // ---------- Educational showcase UI ----------
  initShowcaseContent();
  initTabs();
  initFaq();
  initFooterYear();
  initScrollReveal();
  initParallax();

  switchScene(scenes[0]);

  function switchScene(sceneObject) {
    stopAutorotate();
    sceneObject.view.setParameters(sceneObject.data.initialViewParameters);
    sceneObject.scene.switchTo();
    startAutorotate();
    updateSceneName(sceneObject);
    updateSceneList(sceneObject);
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
        img.src = navigator.onLine ? url : localGalleryFallbacks[index % localGalleryFallbacks.length];
        img.alt = "Dynamic showcase image " + (index + 1);
        img.addEventListener("error", function () {
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
        "Add tiles for the scene folder, then update data.js and add a matching scene item in the list.",
      ],
    ];

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
