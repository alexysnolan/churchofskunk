(() => {
  "use strict";

  const $ = (parent, selector) => parent.querySelector(selector);

  function make(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  // Reject JavaScript or other unexpected URL schemes from JSON links.
  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value.trim(), document.baseURI);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function normalizeArt(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (String(raw.display ?? "").trim().toUpperCase() !== "Y") return null;

    const image = safeUrl(raw.image);
    if (!image) return null; // An artwork needs a valid image to appear.

    const title = String(raw.title ?? "").trim() || "Untitled";
    const artist = String(raw.artist ?? "").trim() || "Artist unknown";

    return {
      id: String(raw.id ?? ""),
      title,
      artist,
      image,
      description: String(raw.description ?? "").trim(),
      category: String(raw.category ?? "").trim() || "Other",
      artistLink: safeUrl(raw.artistLink),
      alt: String(raw.alt ?? "").trim() || `${title}, by ${artist}`
    };
  }

  function createViewer() {
    const dialog = make("dialog", "cos-art-viewer");
    dialog.setAttribute("aria-label", "Artwork viewer");

    const inner = make("div", "cos-art-viewer__inner");
    const close = make("button", "cos-art-viewer__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close artwork viewer");

    const imageArea = make("div", "cos-art-viewer__image-area");
    const image = make("img", "cos-art-viewer__image");
    const imageError = make("p", "cos-art-viewer__image-error", "Image could not be loaded.");
    imageError.hidden = true;
    imageArea.append(image, imageError);

    const counter = make("p", "cos-art-viewer__counter");
    const title = make("h3", "cos-art-viewer__title");
    const artist = make("p", "cos-art-viewer__artist");
    const description = make("p", "cos-art-viewer__description");
    const link = make("a", "cos-art-viewer__link", "Artist's website or profile");
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const nav = make("div", "cos-art-viewer__nav");
    const previous = make("button", "", "← Previous");
    const next = make("button", "", "Next →");
    previous.type = next.type = "button";
    nav.append(previous, next);
    inner.append(close, imageArea, counter, title, artist, description, link, nav);
    dialog.append(inner);
    document.body.append(dialog);

    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });

    return { dialog, image, imageError, counter, title, artist, description, link, previous, next };
  }

  async function initGallery(root) {
    const grid = $(root, ".cos-art-grid");
    const filters = $(root, ".cos-art-filters");
    const status = $(root, ".cos-art-status");

    if (!grid || !filters || !status) {
      console.warn("Art gallery: missing grid, filters, or status container.");
      return;
    }

    const viewer = createViewer();
    let allArt = [];
    let currentArt = [];
    let selectedIndex = 0;
    let activeCategory = null; // null means all categories.

    function updateViewer() {
      const art = currentArt[selectedIndex];
      if (!art) return;

      viewer.image.hidden = false;
      viewer.imageError.hidden = true;
      viewer.image.src = art.image;
      viewer.image.alt = art.alt;
      viewer.counter.textContent = `${selectedIndex + 1} of ${currentArt.length}`;
      viewer.title.textContent = art.title;
      viewer.artist.textContent = `By ${art.artist}`;
      viewer.description.textContent = art.description;
      viewer.description.hidden = !art.description;
      viewer.link.hidden = !art.artistLink;
      if (art.artistLink) viewer.link.href = art.artistLink;
      else viewer.link.removeAttribute("href");
      viewer.previous.disabled = viewer.next.disabled = currentArt.length < 2;
    }

    viewer.image.addEventListener("error", () => {
      viewer.image.hidden = true;
      viewer.imageError.hidden = false;
    });

    function openViewer(index) {
      selectedIndex = index;
      updateViewer();
      if (!viewer.dialog.open) viewer.dialog.showModal();
    }

    function moveViewer(delta) {
      if (currentArt.length < 2) return;
      selectedIndex = (selectedIndex + delta + currentArt.length) % currentArt.length;
      updateViewer();
    }

    viewer.previous.addEventListener("click", () => moveViewer(-1));
    viewer.next.addEventListener("click", () => moveViewer(1));
    viewer.dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); moveViewer(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); moveViewer(1); }
      // Escape is handled automatically by the native <dialog>.
    });

    function makeCard(art, index) {
      const card = make("button", "cos-art-card");
      card.type = "button";
      card.setAttribute("aria-label", `View ${art.title}, by ${art.artist}`);

      const thumb = make("span", "cos-art-thumb");
      const image = make("img");
      image.src = art.image;
      image.alt = ""; // The button already has an accessible name.
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        image.remove();
        thumb.classList.add("cos-art-thumb--missing");
        thumb.textContent = "Image unavailable";
      });

      const caption = make("span", "cos-art-caption");
      caption.append(
        make("span", "cos-art-title", art.title),
        make("span", "cos-art-artist", `By ${art.artist}`)
      );
      thumb.append(image);
      card.append(thumb, caption);
      card.addEventListener("click", () => openViewer(index));
      return card;
    }

    function renderGrid() {
      currentArt = activeCategory === null
        ? allArt
        : allArt.filter(art => art.category === activeCategory);

      const fragment = document.createDocumentFragment();
      currentArt.forEach((art, index) => fragment.append(makeCard(art, index)));

      if (!currentArt.length) {
        fragment.append(make("p", "cos-art-empty", "No artwork to display in this category yet."));
      }
      grid.replaceChildren(fragment);
      status.textContent = `${currentArt.length} artwork${currentArt.length === 1 ? "" : "s"} showing`;
    }

    function renderFilters() {
      const categories = [...new Set(allArt.map(art => art.category))]
        .sort((a, b) => a.localeCompare(b));

      filters.hidden = categories.length < 2;
      filters.replaceChildren();
      if (categories.length < 2) return;

      for (const category of [null, ...categories]) {
        const button = make("button", "cos-art-filter", category === null ? "All Artwork" : category);
        button.type = "button";
        button.setAttribute("aria-pressed", String(category === activeCategory));
        button.addEventListener("click", () => {
          activeCategory = category;
          for (const item of filters.children) {
            item.setAttribute("aria-pressed", String(item === button));
          }
          renderGrid();
        });
        filters.append(button);
      }
    }

    const source = root.dataset.artSrc || "../LISTS/art.json";
    status.textContent = "Loading artwork…";

    try {
      const response = await fetch(source, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const records = Array.isArray(data) ? data : data.artworks ?? data.art;
      if (!Array.isArray(records)) throw new Error("Expected a JSON array of artworks.");

      // Hide N, missing, or invalid display values *before* making filters/cards.
      allArt = records.map(normalizeArt).filter(Boolean);
      if (!allArt.length) {
        filters.hidden = true;
        grid.replaceChildren(make("p", "cos-art-empty", "No artwork is currently on display."));
        status.textContent = "";
        return;
      }

      renderFilters();
      renderGrid();
    } catch (error) {
      console.error("Could not load the Church of Skunk art gallery:", error);
      filters.hidden = true;
      status.textContent = "The art gallery is temporarily unavailable. Please try again later.";
    }
  }

  function start() {
    document.querySelectorAll(".cos-art-gallery").forEach(initGallery);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
