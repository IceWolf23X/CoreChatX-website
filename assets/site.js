const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

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
    href: "./configuration.html#troubleshooting-quick-reference",
  },
  {
    label: "Release",
    title: "Production Validation",
    copy: "Pre-player checklist for final server checks.",
    href: "./configuration.html#production-validation-checklist",
  },
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const docLayout = document.querySelector(".doc-layout");
const docArticle = docLayout?.querySelector(".markdown-body");

if (docLayout && docArticle && resourcePages[currentPage]) {
  if (!document.querySelector("#resource-sidebar-styles")) {
    const style = document.createElement("style");
    style.id = "resource-sidebar-styles";
    style.textContent = `
      @media (min-width: 961px) {
        .doc-layout {
          grid-template-columns: 250px minmax(0, 1fr) 280px;
        }
      }

      .resource-sidebar {
        position: sticky;
        top: 98px;
        max-height: calc(100svh - 120px);
        overflow: auto;
        display: grid;
        gap: 10px;
        border: 1px solid var(--line);
        border-radius: var(--radius);
        background: rgba(17, 20, 38, 0.82);
        padding: 14px;
      }

      .resource-sidebar > strong {
        color: var(--text);
        margin: 2px 8px 8px;
      }

      .side-resource-card {
        display: block;
        border: 1px solid rgba(139, 150, 255, 0.14);
        border-radius: var(--radius-sm);
        background: rgba(8, 11, 24, 0.34);
        padding: 14px;
        transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
      }

      .side-resource-card:hover,
      .side-resource-card:focus-visible {
        transform: translateY(-2px);
        border-color: var(--line-strong);
        background: rgba(24, 28, 49, 0.7);
      }

      .side-resource-card.is-current {
        border-color: rgba(151, 126, 255, 0.46);
        background: rgba(139, 150, 255, 0.1);
      }

      .side-resource-card span {
        display: inline-block;
        width: fit-content;
        border: 1px solid rgba(151, 126, 255, 0.3);
        border-radius: 999px;
        color: var(--accent);
        font-size: 0.72rem;
        font-weight: 900;
        line-height: 1;
        margin-bottom: 12px;
        padding: 5px 8px;
      }

      .side-resource-card h3 {
        margin-bottom: 7px;
        font-size: 0.96rem;
      }

      .side-resource-card p {
        color: var(--muted);
        font-size: 0.86rem;
        line-height: 1.45;
        margin: 0;
      }

      @media (max-width: 960px) {
        .resource-sidebar {
          position: static;
          max-height: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

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
