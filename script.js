(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade + lift the landing text as the user scrolls through the pinned section.
  var wrap = document.getElementById("landing-wrap");
  var heading = document.querySelector("#landing h1");

  function updateLanding() {
    if (!wrap || !heading) return;
    var rect = wrap.getBoundingClientRect();
    var progress = -rect.top / (rect.height - window.innerHeight);
    progress = Math.min(1, Math.max(0, progress));

    if (reduceMotion) {
      heading.style.opacity = progress > 0.5 ? 0 : 1;
      return;
    }

    heading.style.opacity = String(1 - progress);
    heading.style.transform = "translateY(" + (progress * -24) + "px)";
  }

  window.addEventListener("scroll", updateLanding, { passive: true });
  window.addEventListener("resize", updateLanding);
  updateLanding();

  // Reveal content sections as they enter the viewport.
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
