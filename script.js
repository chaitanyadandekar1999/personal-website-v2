(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade + lift the landing text as the user scrolls through the pinned section.
  var wrap = document.getElementById("landing-wrap");
  var heading = document.querySelector("#landing h1");

  // About sits right after the pinned landing section — fade it in based on its
  // own position instead of an intersection threshold, so it's already visible
  // the moment it reaches the viewport (no dead scroll after the landing fade).
  var about = document.querySelector(".reveal-scroll");

  function updateLanding() {
    if (wrap && heading) {
      var rect = wrap.getBoundingClientRect();
      var progress = -rect.top / (rect.height - window.innerHeight);
      progress = Math.min(1, Math.max(0, progress));

      if (reduceMotion) {
        heading.style.opacity = progress > 0.5 ? 0 : 1;
      } else {
        heading.style.opacity = String(1 - progress);
        heading.style.transform = "translateY(" + (progress * -24) + "px)";
      }
    }

    if (about) {
      if (reduceMotion) {
        about.style.opacity = 1;
        about.style.transform = "none";
      } else {
        var aboutRect = about.getBoundingClientRect();
        var revealDistance = window.innerHeight * 0.3;
        var aboutProgress = (window.innerHeight - aboutRect.top) / revealDistance;
        aboutProgress = Math.min(1, Math.max(0, aboutProgress));
        about.style.opacity = String(aboutProgress);
        about.style.transform = "translateY(" + ((1 - aboutProgress) * 16) + "px)";
      }
    }
  }

  window.addEventListener("scroll", updateLanding, { passive: true });
  window.addEventListener("resize", updateLanding);
  updateLanding();

  // Reveal remaining content sections as they enter the viewport.
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
