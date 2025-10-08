// ===============================
// MAIN.JS — Lógica principal
// ===============================

const logo = document.getElementById("logo");
const frame = document.getElementById("contenido-frame");
const menu = document.getElementById("menu-secciones");

// Cambiar logo dinámicamente
fetch("logo.json")
  .then(res => res.json())
  .then(data => { logo.textContent = data.texto || "LARRAZ"; })
  .catch(() => { logo.textContent = "LARRAZ"; });

// Cargar secciones del repositorio
async function cargarSecciones() {
  try {
    const response = await fetch("https://api.github.com/repos/larraz-art/larraz-art.github.io/contents/secciones");
    const files = await response.json();

    files.forEach(file => {
      if (file.name.endsWith(".md")) {
        const nombre = file.name.replace(".md", "").replace(/-/g, " ");
        const li = document.createElement("li");
        li.innerHTML = `<a href="${file.path}" data-path="${file.path}">${nombre}</a>`;
        menu.appendChild(li);
      }
    });

    activarNavegacion();
  } catch (error) {
    console.error("Error al cargar secciones:", error);
  }
}

// Mostrar archivo Markdown dentro del iframe
async function mostrarMarkdownEnIframe(ruta) {
  try {
    const res = await fetch(ruta);
    const md = await res.text();
    const html = marked.parse(md);
    const doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(`
      <link rel="stylesheet" href="style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css">
      <section class="contenido-seccion">${html}</section>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"><\/script>
    `);
    doc.close();
  } catch (e) {
    console.error("No se pudo cargar la sección:", e);
  }
}

// Navegación entre secciones
function activarNavegacion() {
  const links = document.querySelectorAll("#menu-secciones a");
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const ruta = link.getAttribute("href");
      if (ruta.endsWith(".md")) {
        mostrarMarkdownEnIframe(ruta);
        window.history.pushState({}, "", ruta);
      } else {
        frame.src = ruta;
        window.history.pushState({}, "", ruta);
      }
    });
  });
}

// Clic en el logo → volver al inicio
logo.addEventListener("click", () => {
  frame.src = "foto0.html";
  window.history.pushState({}, "", "foto0.html");
});

// Inicializar
cargarSecciones();
