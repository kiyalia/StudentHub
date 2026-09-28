/* StudentHub - Practical 4: DOM manipulation, events and UI interactivity */
document.addEventListener("DOMContentLoaded", () => {

  /* 1. Notification banner */
  const banner = document.getElementById("notificationBanner");
  const closeBannerBtn = document.getElementById("closeBanner");
  if (banner && closeBannerBtn) {
    if (sessionStorage.getItem("bannerClosed") === "yes") banner.classList.add("hidden");
    closeBannerBtn.addEventListener("click", () => {
      banner.classList.add("hidden");
      sessionStorage.setItem("bannerClosed", "yes");
    });
  }

  /* 2. Hamburger menu */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const primaryNav = document.getElementById("primary-nav");
  if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");
      hamburgerBtn.classList.toggle("open", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", isOpen);
    });
  }

  /* 3. Light / dark theme switcher (saved in localStorage) */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "\u2600\uFE0F Light mode" : "\uD83C\uDF19 Dark mode";
    localStorage.setItem("studenthub-theme", theme);
  }
  applyTheme(localStorage.getItem("studenthub-theme") || "light");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* 4. Collapsible FAQ (accordion) */
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const isExpanded = question.getAttribute("aria-expanded") === "true";
      faqQuestions.forEach(other => {                     // close all others
        if (other !== question) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });
      question.setAttribute("aria-expanded", String(!isExpanded));
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + "px";
    });
  });

  /* 5. Image / content slider */
  const slides = document.querySelectorAll(".slide");
  if (slides.length) {
    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");
    const dotsContainer = document.getElementById("sliderDots");
    let current = 0, timer;
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => { goTo(i); resetAuto(); });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".dot");
    function goTo(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }
    const startAuto = () => { timer = setInterval(() => goTo(current + 1), 4000); };
    const resetAuto = () => { clearInterval(timer); startAuto(); };
    nextBtn.addEventListener("click", () => { goTo(current + 1); resetAuto(); });
    prevBtn.addEventListener("click", () => { goTo(current - 1); resetAuto(); });
    startAuto();
  }

  /* 6. Modal popup */
  const openModalBtn = document.getElementById("openModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  if (openModalBtn && modalOverlay) {
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalOkBtn = document.getElementById("modalOkBtn");
    const openModal = () => { modalOverlay.classList.add("open"); closeModalBtn.focus(); };
    const closeModal = () => { modalOverlay.classList.remove("open"); openModalBtn.focus(); };
    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    modalOkBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
    });
  }
});
