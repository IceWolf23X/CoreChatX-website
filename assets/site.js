const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeKey = "corechatx-theme";

const getStoredTheme = () => {
  try {
    return localStorage.getItem(themeKey);
  } catch (_) {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem(themeKey, theme);
  } catch (_) {
    // Ignore storage failures so the toggle still works for the current page.
  }
};

const normalizeTheme = (theme) => (theme === "light" ? "light" : "dark");

const applyTheme = (theme) => {
  const nextTheme = normalizeTheme(theme);

  if (nextTheme === "light") {
    root.dataset.theme = "light";
  } else {
    root.removeAttribute("data-theme");
  }

  if (themeMeta) {
    themeMeta.setAttribute("content", nextTheme === "light" ? "#f7f8ff" : "#070812");
  }

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.setAttribute("aria-pressed", String(nextTheme === "light"));
    button.setAttribute(
      "aria-label",
      nextTheme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
    button.title = nextTheme === "light" ? "Switch to dark theme" : "Switch to light theme";

    const label = button.querySelector(".theme-toggle-text");
    if (label) {
      label.textContent = nextTheme === "light" ? "Dark" : "Light";
    }
  });
};

applyTheme(root.dataset.theme === "light" ? "light" : getStoredTheme());

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (navLinks && !navLinks.querySelector(".theme-toggle")) {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.innerHTML =
    '<span class="theme-toggle-icon" aria-hidden="true"></span><span class="theme-toggle-text"></span>';

  themeToggle.addEventListener("click", () => {
    const currentTheme = root.dataset.theme === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
  });

  navLinks.appendChild(themeToggle);
  applyTheme(root.dataset.theme === "light" ? "light" : getStoredTheme());
}

const moreToggle = document.querySelector(".more-toggle");
const secondaryFeatures = document.querySelector("#secondary-features");

if (moreToggle && secondaryFeatures) {
  moreToggle.addEventListener("click", () => {
    const willOpen = secondaryFeatures.hasAttribute("hidden");
    secondaryFeatures.toggleAttribute("hidden", !willOpen);
    secondaryFeatures.classList.toggle("is-open", willOpen);
    moreToggle.setAttribute("aria-expanded", String(willOpen));
    moreToggle.textContent = willOpen ? "Hide extra features" : "See more features";
  });
}

document.querySelectorAll("[data-animated-details] details").forEach((details) => {
  const summary = details.querySelector("summary");
  if (!summary) {
    return;
  }

  let animation = null;

  const setHeight = (height) => {
    details.style.height = `${height}px`;
  };

  const finish = (open) => {
    details.open = open;
    details.classList.remove("is-animating");
    details.style.height = "";
    details.style.overflow = "";
    animation = null;
  };

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    if (animation) {
      animation.cancel();
    }

    const startHeight = details.offsetHeight;
    details.classList.add("is-animating");
    details.style.overflow = "hidden";

    if (details.open) {
      const endHeight = summary.offsetHeight;
      animation = details.animate(
        { height: [`${startHeight}px`, `${endHeight}px`] },
        { duration: 240, easing: "cubic-bezier(.2, .8, .2, 1)" }
      );
      setHeight(endHeight);
      animation.onfinish = () => finish(false);
      animation.oncancel = () => finish(false);
      return;
    }

    details.open = true;
    const endHeight = details.scrollHeight;
    setHeight(startHeight);
    animation = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 260, easing: "cubic-bezier(.2, .8, .2, 1)" }
    );
    setHeight(endHeight);
    animation.onfinish = () => finish(true);
    animation.oncancel = () => finish(true);
  });
});

const resourcePages = {
  "features.html": "./features.html",
  "installation.html": "./installation.html",
  "configuration.html": "./configuration.html",
  "faq.html": "./faq.html",
};

const resourceLinks = [
  {
    label: "Product",
    title: "Product Overview",
    copy: "Complete product view for server owners.",
    href: "./features.html",
  },
  {
    label: "Setup",
    title: "Installation Guide",
    copy: "Standalone Paper and Velocity network setup.",
    href: "./installation.html",
  },
  {
    label: "Config",
    title: "Configuration Reference",
    copy: "Exact files, defaults, permissions, and runtime notes.",
    href: "./configuration.html",
  },
  {
    label: "FAQ",
    title: "Complete FAQ",
    copy: "Common platform, setup, bridge, and storage questions.",
    href: "./faq.html",
  },
  {
    label: "Ops",
    title: "Troubleshooting",
    copy: "Startup, reload, routing, bridge, and data checks.",
    href: "./configuration.html#troubleshooting",
  },
  {
    label: "Release",
    title: "2026.2.5 Notes",
    copy: "bStats metrics, public-chat ignore modes, legacy formatting permission groups, and cleaner Discord startup logs.",
    href: "./index.html#latest-release",
  },
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const docLayout = document.querySelector(".doc-layout");
const docArticle = docLayout?.querySelector(".markdown-body");

if (docLayout && docArticle && resourcePages[currentPage]) {
  if (!docLayout.querySelector(".resource-sidebar")) {
    const resourceSidebar = document.createElement("aside");
    resourceSidebar.className = "resource-sidebar";
    resourceSidebar.setAttribute("aria-label", "Related resources");
    resourceSidebar.innerHTML = `<strong>Resources</strong>${resourceLinks
      .map((item) => {
        const isCurrent = resourcePages[currentPage] === item.href ? " is-current" : "";
        return `
          <a class="side-resource-card${isCurrent}" href="${item.href}">
            <span>${item.label}</span>
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </a>
        `;
      })
      .join("")}`;
    docArticle.insertAdjacentElement("afterend", resourceSidebar);
  }
}

const escapeCodeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char])
  );

// Lightweight highlighting for generated config blocks; the underlying text remains copy/paste friendly.
const highlightConfigValue = (value) => {
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const trimmed = value.trim();

  if (!trimmed) {
    return escapeCodeHtml(value);
  }

  let className = "config-token-value";

  if (/^(true|false|null)$/i.test(trimmed)) {
    className = "config-token-literal";
  } else if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    className = "config-token-number";
  } else if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    className = "config-token-string";
  }

  return `${escapeCodeHtml(leading)}<span class="${className}">${escapeCodeHtml(
    trimmed
  )}</span>${escapeCodeHtml(trailing)}`;
};

const highlightYamlLine = (line) => {
  const keyMatch = line.match(/^(\s*)(-\s+)?((?:"[^"]+"|'[^']+'|[^:#\s][^:]*?))(:)(.*)$/);

  if (!keyMatch) {
    return escapeCodeHtml(line);
  }

  const [, indent, dash = "", key, colon, value] = keyMatch;

  return `${escapeCodeHtml(indent)}${escapeCodeHtml(
    dash
  )}<span class="config-token-key">${escapeCodeHtml(
    key.trimEnd()
  )}</span><span class="config-token-punctuation">${colon}</span>${highlightConfigValue(value)}`;
};

const highlightPropertiesLine = (line) => {
  const propertyMatch = line.match(/^(\s*)([A-Za-z0-9_.-]+)(\s*=\s*)(.*)$/);

  if (!propertyMatch) {
    return escapeCodeHtml(line);
  }

  const [, indent, key, separator, value] = propertyMatch;

  return `${escapeCodeHtml(indent)}<span class="config-token-key">${escapeCodeHtml(
    key
  )}</span><span class="config-token-punctuation">${escapeCodeHtml(
    separator
  )}</span>${highlightConfigValue(value)}`;
};

const highlightJsonLine = (line) => {
  const match = line.match(/^(\s*)("[^"]+")(\s*:\s*)(.*?)(,?\s*)$/);

  if (!match) {
    return escapeCodeHtml(line);
  }

  const [, indent, key, separator, value, suffix] = match;

  return `${escapeCodeHtml(indent)}<span class="config-token-key">${escapeCodeHtml(
    key
  )}</span><span class="config-token-punctuation">${escapeCodeHtml(
    separator
  )}</span>${highlightConfigValue(value)}${escapeCodeHtml(suffix)}`;
};

document
  .querySelectorAll(".code-block code.language-yml, .code-block code.language-yaml, .code-block code.language-properties, .code-block code.language-json")
  .forEach((code) => {
    if (code.dataset.highlighted === "true") {
      return;
    }

    const language = [...code.classList].find((className) => className.startsWith("language-")) || "";
    const highlighter = language.includes("properties")
      ? highlightPropertiesLine
      : language.includes("json")
        ? highlightJsonLine
        : highlightYamlLine;

    code.dataset.highlighted = "true";
    code.innerHTML = code.textContent
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => {
        const comment = /^\s*#/.test(line);
        const content = comment
          ? `<span class="config-token-comment">${escapeCodeHtml(line)}</span>`
          : highlighter(line);

        return `<span class="config-code-line${comment ? " is-comment" : ""}">${content}</span>`;
      })
      .join("");
  });
