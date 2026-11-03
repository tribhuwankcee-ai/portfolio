// ===== ELEMENTS =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

// ===== FOOTER YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== THEME TOGGLE (remembers choice) =====
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch (e) {}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", function () {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("portfolio-theme", next);
  } catch (e) {}
});

// ===== MOBILE MENU =====
menuToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach(function (section) {
  observer.observe(section);
});

// ===== CONTACT FORM (validation + opens email app) =====
function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "form-status " + type;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  [form.name, form.email, form.message].forEach(function (field) {
    field.classList.remove("invalid");
  });

  if (name === "") {
    form.name.classList.add("invalid");
    showStatus("Please enter your name.", "error");
    return;
  }
  if (!emailPattern.test(email)) {
    form.email.classList.add("invalid");
    showStatus("Please enter a valid email address.", "error");
    return;
  }
  if (message.length < 10) {
    form.message.classList.add("invalid");
    showStatus("Please write a message of at least 10 characters.", "error");
    return;
  }

  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
  window.location.href = "mailto:tribhuwankcee@gmail.com?subject=" + subject + "&body=" + body;

  showStatus("Thank you, " + name + "! Your email app is opening.", "success");
  form.reset();
});