const apps = {
  dashboard: { title: "🏠 Огляд ISMS" },
  controls: { title: "🛡️ Контролі ІБ" },
  risks: { title: "⚠️ Реєстр ризиків" },
  tasks: { title: "✅ Завдання" },
};

const windowsRoot = document.getElementById("windows");
const clock = document.getElementById("clock");
let zIndex = 10;

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function bringToFront(windowEl) {
  zIndex += 1;
  windowEl.style.zIndex = String(zIndex);
}

function makeDraggable(windowEl, handle) {
  let startX = 0;
  let startY = 0;
  let left = 0;
  let top = 0;

  handle.addEventListener("mousedown", (event) => {
    bringToFront(windowEl);
    startX = event.clientX;
    startY = event.clientY;

    const rect = windowEl.getBoundingClientRect();
    left = rect.left;
    top = rect.top;

    function onMove(moveEvent) {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      windowEl.style.left = `${left + dx}px`;
      windowEl.style.top = `${top + dy}px`;
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });
}

function openApp(appName) {
  const existing = document.querySelector(`[data-window="${appName}"]`);
  if (existing) {
    existing.classList.remove("hidden");
    bringToFront(existing);
    return;
  }

  const app = apps[appName];
  const template = document.getElementById(`app-${appName}`);
  if (!app || !template) return;

  const windowEl = document.createElement("article");
  windowEl.className = "window";
  windowEl.dataset.window = appName;
  windowEl.style.left = `${170 + document.querySelectorAll('.window').length * 28}px`;
  windowEl.style.top = `${70 + document.querySelectorAll('.window').length * 24}px`;

  windowEl.innerHTML = `
    <header class="window-header">
      <h2 class="window-title">${app.title}</h2>
      <div class="window-actions">
        <button type="button" data-action="min">—</button>
        <button type="button" data-action="close">✕</button>
      </div>
    </header>
    <div class="window-body"></div>
  `;

  windowEl.querySelector(".window-body").append(template.content.cloneNode(true));

  windowEl.addEventListener("mousedown", () => bringToFront(windowEl));
  windowEl.querySelector('[data-action="min"]').addEventListener("click", () => windowEl.classList.add("hidden"));
  windowEl.querySelector('[data-action="close"]').addEventListener("click", () => windowEl.remove());

  makeDraggable(windowEl, windowEl.querySelector(".window-header"));

  windowsRoot.append(windowEl);
  bringToFront(windowEl);
}

document.querySelectorAll(".desktop-icon").forEach((button) => {
  button.addEventListener("click", () => openApp(button.dataset.app));
});

document.getElementById("open-all").addEventListener("click", () => {
  Object.keys(apps).forEach((name) => openApp(name));
});

updateClock();
setInterval(updateClock, 1000);
openApp("dashboard");
