// The class website uses script.js.
// This file remains so older links to index.js still open the menu.
document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks || window.Pathshala) {
    return;
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });
});
