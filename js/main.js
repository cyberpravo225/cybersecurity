// THEME
const themeBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

themeBtn.onclick = () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};

const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);

// BURGER
const menuBtn = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-list");

menuBtn.onclick = () => {
  const open = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", !open);
};
