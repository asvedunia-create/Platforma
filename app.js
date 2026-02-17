const viewContainer = document.getElementById("view-container");
const dockButtons = document.querySelectorAll(".dock-btn");

function loadView(viewName) {
  const template = document.getElementById(`${viewName}-template`);

  if (!template) {
    viewContainer.textContent = "Неможливо завантажити вікно.";
    return;
  }

  viewContainer.replaceChildren(template.content.cloneNode(true));
}

dockButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dockButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    loadView(button.dataset.view);
  });
});

loadView("dashboard");
