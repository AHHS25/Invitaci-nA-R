/* =============================================================
   NUESTRA BODA — CONFIGURACIÓN PRINCIPAL (V2)
   Cambia únicamente estos datos cuando tengas la información.
   ============================================================= */
const wedding = {
  nombre1: "Anaeli Millar",        // EDITABLE
  nombre2: "Ruben Carrizalez",     // EDITABLE
  // La fiesta comienza a las 18:00 del 29 de enero de 2027 (Ciudad de México).
  fecha: "2027-01-29T18:00:00-06:00",
  // El botón de calendario genera un recordatorio a las 14:00.
  recordatorio: "2027-01-29T14:00:00-06:00",
  recepcion: {
    nombre: "Lugar por confirmar",
    direccion: "",                 // Ej.: "Calle Ejemplo 123, CDMX, México"
    mapa: ""                       // Opcional: pega un enlace directo de Google Maps
  },
  mesasDeRegalos: {
    // Pega aquí los enlaces ESPECÍFICOS de los novios cuando los tengan.
    // Mientras tanto, se abren los portales generales de mesas de regalos.
    liverpool: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/60063941",
    amazon: "https://www.amazon.com.mx/wedding"
  },
  // Como todavía no se indicaron colores prohibidos, NO inventamos ninguno.
  // Ejemplo para más adelante: { nombre: "Blanco", color: "#FFFFFF" }
  coloresReservados: [
  { nombre: "Sage", color: "#B7BB88" },
  { nombre: "Olive Print", color: "#6E6B41" },
  { nombre: "Cocoa", color: "#3E2C22" },
  { nombre: "Wine", color: "#651F30" },
  { nombre: "Mustard", color: "#E6C25A" }
  ],
  // Pega aquí la URL de implementación de Google Apps Script terminada en /exec.
  // Ver INSTRUCCIONES.md y google-sheets/Code.gs.
  googleSheetsWebApp: "https://script.google.com/macros/s/AKfycbyObt9HCzq-mnFxhglfvOXHyZXPWZe9co02lFEjmp-mlc6hCg1bJIsAdc9rGscbX2QP/exec"
};

/* =============================================================
   IMÁGENES
   Coloca los archivos en la carpeta /images con estos nombres.
   Si faltan imágenes, verás espacios decorativos preparados.
   ============================================================= */
const photos = {
  portada: "images/portada.jpg",
  historia: "images/historia.jpg",
  "galeria-1": "images/galeria-1.jpg",
  "galeria-2": "images/galeria-2.jpg",
  "galeria-3": "images/galeria-3.jpg",
  "galeria-4": "images/galeria-4.jpg",
  "galeria-5": "images/galeria-5.jpg",
  "galeria-6": "images/galeria-6.jpg"
};

const carouselPhotos = {
  mujeres: Array.from({ length: 6 }, (_, index) => `images/vestimenta-mujer-${index + 1}.jpg`),
  hombres: Array.from({ length: 6 }, (_, index) => `images/vestimenta-hombre-${index + 1}.jpg`),
  lugar: Array.from({ length: 6 }, (_, index) => `images/lugar-${index + 1}.jpg`)
};

/* Nombres, fecha, monograma y título de la página. */
const signature = `${wedding.nombre1} & ${wedding.nombre2}`;
const initial = name => (name.trim().charAt(0) || "N").toUpperCase();
const initials = `${initial(wedding.nombre1)} & ${initial(wedding.nombre2)}`;
const eventDate = new Date(wedding.fecha);
const reminderDate = new Date(wedding.recordatorio);
const isValidDate = date => !Number.isNaN(date.getTime());
const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric", month: "long", year: "numeric", timeZone: "America/Mexico_City"
});
const prettyDate = isValidDate(eventDate) ? dateFormatter.format(eventDate) : "Fecha por confirmar";

document.querySelectorAll("[data-name-a]").forEach(el => { el.textContent = wedding.nombre1; });
document.querySelectorAll("[data-name-b]").forEach(el => { el.textContent = wedding.nombre2; });
document.querySelectorAll("[data-initials]").forEach(el => { el.textContent = initials; });
document.querySelectorAll("[data-couple-signature]").forEach(el => { el.textContent = signature; });
document.querySelectorAll("[data-wedding-date]").forEach(el => { el.textContent = prettyDate; });
document.getElementById("year").textContent = new Date().getFullYear();
document.title = `${signature} | Nuestra boda`;

/* Menú para celulares. */
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
function closeMenu() {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
}
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

/* Fotos individuales: sin iconos de archivo roto. */
const loadedPhotos = new Map();
document.querySelectorAll("[data-photo]").forEach(panel => {
  const key = panel.dataset.photo;
  const src = photos[key];
  if (!src) return;
  const image = new Image();
  image.onload = () => {
    panel.style.backgroundImage = `url("${src}")`;
    panel.classList.add("has-photo");
    loadedPhotos.set(key, src);
  };
  image.src = src;
});

/* Cuenta regresiva para el comienzo de la recepción a las 18:00. */
const counters = ["days", "hours", "minutes", "seconds"].map(id => document.getElementById(id));
const countdownMessage = document.getElementById("countdown-message");
function updateCountdown() {
  if (!isValidDate(eventDate)) {
    countdownMessage.textContent = "Pronto anunciaremos la fecha.";
    return;
  }
  const diff = eventDate.getTime() - Date.now();
  if (diff <= 0) {
    counters.forEach(el => { el.textContent = "00"; });
    countdownMessage.textContent = "¡Llegó nuestro gran día!";
    return;
  }
  const s = Math.floor(diff / 1000);
  const parts = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
  parts.forEach((value, i) => { counters[i].textContent = String(value).padStart(2, "0"); });
}
updateCountdown();
if (isValidDate(eventDate)) window.setInterval(updateCountdown, 1000);

/* Carrusel automático para mujeres, hombres y el lugar. */
function initCarousel(root, images, caption) {
  if (!root || !images || !images.length) return;
  const stage = root.querySelector("[data-carousel-stage]");
  const dots = document.querySelector(`[data-carousel-dots="${root.dataset.carousel}"]`);
  stage.replaceChildren();
  const slides = [];
  const buttons = [];
  let index = 0;
  let intervalId = null;
  let visible = true;
  let hovered = false;
  let focused = false;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-label", `Foto ${i + 1} de ${images.length}: ${caption}`);
    const placeholder = document.createElement("div");
    placeholder.className = "carousel-slide-label";
    const message = document.createElement("span");
    message.textContent = `Fotografía ${i + 1} de ${images.length}`;
    const path = document.createElement("small");
    path.textContent = src;
    placeholder.append(message, path);
    slide.append(placeholder);
    stage.append(slide);
    slides.push(slide);

    const photo = new Image();
    photo.alt = `${caption}, fotografía ${i + 1}`;
    photo.decoding = "async";
    photo.onload = () => { slide.replaceChildren(photo); };
    photo.onerror = () => { /* El espacio permanece con su nombre de archivo. */ };
    photo.src = src;

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `${caption}, mostrar foto ${i + 1}`);
    dot.addEventListener("click", () => changeTo(i, true));
    dots.append(dot);
    buttons.push(dot);
  });

  function changeTo(next, userInitiated = false) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      buttons[i].classList.toggle("is-active", active);
      buttons[i].setAttribute("aria-current", active ? "true" : "false");
    });
    if (userInitiated) restart();
  }
  function canAutoplay() {
    return !motionPreference.matches && !document.hidden && visible && !hovered && !focused && slides.length > 1;
  }
  function stop() {
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
  }
  function restart() {
    stop();
    if (canAutoplay()) intervalId = window.setInterval(() => changeTo(index + 1), 2000);
  }
  root.querySelector("[data-carousel-prev]").addEventListener("click", () => changeTo(index - 1, true));
  root.querySelector("[data-carousel-next]").addEventListener("click", () => changeTo(index + 1, true));
  root.addEventListener("mouseenter", () => { hovered = true; stop(); });
  root.addEventListener("mouseleave", () => { hovered = false; restart(); });
  root.addEventListener("focusin", () => { focused = true; stop(); });
  root.addEventListener("focusout", () => {
    window.setTimeout(() => { focused = root.contains(document.activeElement); restart(); }, 0);
  });
  root.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") { event.preventDefault(); changeTo(index + 1, true); }
    if (event.key === "ArrowLeft") { event.preventDefault(); changeTo(index - 1, true); }
  });
  document.addEventListener("visibilitychange", restart);
  motionPreference.addEventListener?.("change", restart);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      restart();
    }, { threshold: 0.1 });
    observer.observe(root);
  }
  changeTo(0);
  restart();
}

initCarousel(document.querySelector('[data-carousel="mujeres"]'), carouselPhotos.mujeres, "Vestimenta formal para mujeres");
initCarousel(document.querySelector('[data-carousel="hombres"]'), carouselPhotos.hombres, "Vestimenta formal para hombres");
initCarousel(document.querySelector('[data-carousel="lugar"]'), carouselPhotos.lugar, "Lugar de la recepción");

/* Colores reservados: solo se mostrarán cuando los novios los definan. */
const reservedColorsElement = document.getElementById("reserved-color-list");
if (!wedding.coloresReservados.length) {
  const text = document.createElement("span");
  text.className = "reserved-color-pending";
  text.textContent = "Colores por confirmar. Pronto compartiremos esta información.";
  reservedColorsElement.append(text);
} else {
  wedding.coloresReservados.forEach(item => {
    const chip = document.createElement("span");
    chip.className = "reserved-color-item";
    const dot = document.createElement("i");
    dot.setAttribute("aria-hidden", "true");
    dot.style.setProperty("--reserved-color", /^#[0-9a-fA-F]{6}$/.test(item.color) ? item.color : "#FFFFFF");
    const label = document.createElement("span");
    label.textContent = String(item.nombre || "Color reservado");
    chip.append(dot, label);
    reservedColorsElement.append(chip);
  });
}

/* Lugar de recepción y enlace válido a Google Maps. */
document.getElementById("reception-name").textContent = wedding.recepcion.nombre || "Lugar por confirmar";
document.getElementById("reception-address").textContent = wedding.recepcion.direccion || "Dirección por confirmar";
const receptionLink = document.getElementById("reception-map");
const mapUrl = wedding.recepcion.mapa || (wedding.recepcion.direccion
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.recepcion.direccion)}`
  : "");
if (isHttpsUrl(mapUrl)) { receptionLink.href = mapUrl; receptionLink.hidden = false; }

/* Regalos: enlaces de las listas reales configurables, de inicio portales oficiales. */
function isHttpsUrl(value) {
  try { return new URL(value).protocol === "https:"; }
  catch { return false; }
}
for (const store of ["liverpool", "amazon"]) {
  const link = document.getElementById(`gift-${store}`);
  const url = wedding.mesasDeRegalos[store];
  if (isHttpsUrl(url)) link.href = url;
  else { link.removeAttribute("href"); link.setAttribute("aria-disabled", "true"); }
}

/* Calendario: recordatorio 29/01/2027 a las 14:00, hora de Ciudad de México. */
const calendarLabel = document.getElementById("calendar-date-label");
if (isValidDate(reminderDate)) {
  const day = dateFormatter.format(reminderDate);
  const hour = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Mexico_City"
  }).format(reminderDate);
  calendarLabel.textContent = `${day} · ${hour}`;
}
function icsEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function toIcsUtc(date) { return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
document.getElementById("calendar-btn").addEventListener("click", () => {
  if (!isValidDate(reminderDate)) { alert("Configura la fecha del recordatorio en script.js."); return; }
  const reminderEnd = new Date(reminderDate.getTime() + 60 * 60 * 1000);
  const message = `Recordatorio de la boda de ${signature}. La recepción inicia a las 18:00 (hora CDMX).`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nuestra Boda//Invitacion//ES", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:recordatorio-boda-${reminderDate.getTime()}@nuestra-boda`,
    `DTSTAMP:${toIcsUtc(new Date())}`, `DTSTART:${toIcsUtc(reminderDate)}`,
    `DTEND:${toIcsUtc(reminderEnd)}`, `SUMMARY:${icsEscape(`Recordatorio · Boda de ${signature}`)}`,
    `DESCRIPTION:${icsEscape(message)}`,
    `LOCATION:${icsEscape(wedding.recepcion.direccion || "Lugar por confirmar")}`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = "recordatorio-boda-29-enero-2027.ics";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
});

/* Galería ampliada: 6 espacios. */
const dialog = document.getElementById("photo-dialog");
const dialogImage = document.getElementById("dialog-image");
document.querySelectorAll(".gallery-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const src = loadedPhotos.get(tile.dataset.photo);
    if (!src) return;
    dialogImage.src = src;
    dialogImage.alt = tile.getAttribute("aria-label") || "Fotografía";
    dialog.showModal();
  });
});
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

/* =============================================================
   RSVP -> GOOGLE SHEETS (a través de Google Apps Script)
   1. POST no-cors: Google puede recibirlo desde un sitio estático.
   2. GET JSONP de solo lectura: verifica por ID si está en la hoja.
   La verificación solo publica "encontrado" y nunca datos personales.
   ============================================================= */
const rsvpForm = document.getElementById("rsvp-form");
const rsvpStatus = document.getElementById("rsvp-status");
const rsvpButton = document.getElementById("rsvp-submit");
const rsvpRequestId = document.getElementById("rsvp-request-id");
let sending = false;
function showRsvpStatus(message, kind = "info") {
  rsvpStatus.textContent = message;
  rsvpStatus.className = `form-status is-${kind}`;
}
function newRequestId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `rsvp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function checkInSheet(url, requestId) {
  return new Promise(resolve => {
    const callback = `bodaStatus_${requestId.replace(/[^a-zA-Z0-9]/g, "")}`;
    const script = document.createElement("script");
    let resolved = false;
    const timeout = window.setTimeout(() => finish(false), 7000);
    function finish(found) {
      if (resolved) return;
      resolved = true;
      window.clearTimeout(timeout);
      script.remove();
      delete window[callback];
      resolve(Boolean(found));
    }
    window[callback] = response => finish(response?.ok === true && response?.found === true);
    script.onerror = () => finish(false);
    script.src = `${url}${url.includes("?") ? "&" : "?"}action=status` +
      `&requestId=${encodeURIComponent(requestId)}&callback=${callback}&_=${Date.now()}`;
    document.head.append(script);
  });
}
function delay(ms) { return new Promise(resolve => window.setTimeout(resolve, ms)); }
async function verifySaved(url, requestId) {
  // Se reintenta la consulta porque Apps Script puede tardar en terminar el POST.
  for (let attempt = 0; attempt < 3; attempt++) {
    await delay(attempt === 0 ? 1000 : 1500);
    if (await checkInSheet(url, requestId)) return true;
  }
  return false;
}
rsvpForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (sending || !rsvpForm.reportValidity()) return;
  const endpoint = String(wedding.googleSheetsWebApp || "").trim();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?.*)?$/.test(endpoint)) {
    showRsvpStatus("Los novios están terminando de habilitar las confirmaciones. Intenta más tarde.", "error");
    return;
  }
  if (rsvpForm.elements.website.value) return; // Antispam.
  // Reusar ID en un reintento: evita duplicar filas.
  rsvpRequestId.value ||= newRequestId();
  const requestId = rsvpRequestId.value;
  sending = true;
  rsvpButton.disabled = true;
  showRsvpStatus("Enviando y verificando tu confirmación...", "info");
  try {
    // Apps Script recibe los campos, aunque la respuesta de POST es opaca.
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(new FormData(rsvpForm)),
      redirect: "follow"
    });
    const saved = await verifySaved(endpoint, requestId);
    if (saved) {
      showRsvpStatus("¡Gracias! Tu confirmación se guardó correctamente.", "success");
      rsvpForm.reset();
      rsvpRequestId.value = "";
    } else {
      showRsvpStatus("La solicitud fue enviada, pero no pudimos verificar su registro. Consulta con los novios antes de volver a enviarla.", "error");
    }
  } catch (error) {
    showRsvpStatus("No fue posible conectar con el registro. Revisa tu conexión e inténtalo nuevamente.", "error");
  } finally {
    sending = false;
    rsvpButton.disabled = false;
  }
});
