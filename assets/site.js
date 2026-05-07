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
