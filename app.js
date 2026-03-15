const STARTUP_PASSWORD = "waben2026";
const STARTUP_SESSION_KEY = "wabenpresse-founder-auth";
const STORAGE_KEY = "wabenpresse-state";
const TASK_COLUMNS = [
  { id: "discover", label: "Klärung" },
  { id: "build", label: "Vorbereitung" },
  { id: "pilot", label: "Pilot" },
];

const offers = [
  {
    id: "orchard-launch",
    title: "Standortstart",
    description:
      "Standortanalyse, zwei Bienenboxen, Sicherheitscheck und ein erster Press-Tag für ein sichtbares Auftaktformat.",
    price: 1490,
    tag: "Pilotpaket",
    outcome: "In 14 Tagen einsatzbereit",
  },
  {
    id: "press-day",
    title: "Gemeinsamer Press-Tag",
    description:
      "Mobile Saftpresse, Abfüllung, Helferbriefing und Vor-Ort-Verkauf für Gemeinden, Schulen oder Firmenhöfe.",
    price: 890,
    tag: "Eventformat",
    outcome: "Bis zu 600 Liter pro Tag",
  },
  {
    id: "nectar-subscription",
    title: "Honig- & Saft-Abo",
    description:
      "Monatliche Box mit Saft, Honig und Standortgeschichte für Teams, Kundschaft oder Anwohner.",
    price: 39,
    tag: "Wiederkehrend",
    outcome: "Preis pro Box",
  },
];

const phases = [
  {
    phase: "Baustein 01",
    title: "Standortaufnahme",
    metric: "Vor-Ort-Check, Sicherheitsrahmen und Mengenbild",
    details:
      "Wir klären Obstmenge, Zugänge, Flächen, Wasser, Strom und das passende Format für euren Standort.",
  },
  {
    phase: "Baustein 02",
    title: "Press-Tag",
    metric: "Aufbau, Pressung, Abfüllung und Ablaufsteuerung",
    details:
      "Das Team bringt Material, führt den Einsatz durch und hält den Tag für Gäste, Mitarbeitende oder Bürger sauber strukturiert.",
  },
  {
    phase: "Baustein 03",
    title: "Produktpaket",
    metric: "Saft, Honig und sichtbares Ergebnis",
    details:
      "Am Ende stehen abgefüllte Produkte und ein Format, das intern oder extern direkt weiterverwendet werden kann.",
  },
  {
    phase: "Baustein 04",
    title: "Kommunikationspaket",
    metric: "Optional mit Story, Fotomoment und Aktivierung",
    details:
      "Wer möchte, ergänzt das Format um ein kleines Inhaltspaket für Teamkommunikation, Bürgeransprache oder Markenarbeit.",
  },
];

const defaultState = {
  cart: [],
  orders: [],
  routes: [
    { id: createId(), site: "Biohof Morgenrot", date: "2026-04-08", volume: 450 },
    { id: createId(), site: "Stadtpark Nord", date: "2026-04-11", volume: 300 },
  ],
  tasks: [
    {
      id: createId(),
      title: "Pilotvertrag für den ersten Gemeindestandort abschließen",
      owner: "Christoph",
      priority: "Hoch",
      status: "discover",
    },
    {
      id: createId(),
      title: "Mobile Press-Checkliste in 12 Schritten standardisieren",
      owner: "Betrieb",
      priority: "Mittel",
      status: "build",
    },
    {
      id: createId(),
      title: "Angebot für Teamtage an Bürostandorten testen",
      owner: "Vertrieb",
      priority: "Niedrig",
      status: "pilot",
    },
  ],
  okrs: [
    { id: createId(), text: "3 zahlende Pilotkunden bis Ende Q2", done: true },
    { id: createId(), text: "Deckungsbeitrag pro Press-Tag positiv halten", done: false },
    { id: createId(), text: "Mindestens 2 wiederkehrende Abo-Kunden gewinnen", done: false },
    { id: createId(), text: "Sicherheits- und Bienenpflege-Standard dokumentieren", done: true },
  ],
  finance: {
    burnRate: 8500,
    averageOrder: 1180,
    cashBalance: 54000,
  },
  notes:
    "Wichtigste Annahme: Gemeinden kaufen nicht nur Nachhaltigkeit, sondern sichtbare Bürgerbeteiligung. Jeder Pilot muss ein nutzbares Kommunikationsstück erzeugen.",
};

let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSharedMetrics();
  initCustomerPage();
  initStartupPage();
  initStorageSync();
});

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `wp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneDefaultState() {
  if (typeof structuredClone === "function") {
    return structuredClone(defaultState);
  }

  return JSON.parse(JSON.stringify(defaultState));
}

function initNavigation() {
  const nav = document.querySelector(".topnav");
  const toggle = document.querySelector(".nav-toggle");

  if (!nav || !toggle) {
    return;
  }

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen && window.innerWidth <= 720);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
}

function initStorageSync() {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    state = loadState();
    refreshVisibleState();
  });
}

function initSharedMetrics() {
  const startupOrdersMetric = document.querySelector("#startup-orders-metric");
  const startupRevenueMetric = document.querySelector("#startup-revenue-metric");
  const bookedRevenue = state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  if (startupOrdersMetric) {
    startupOrdersMetric.textContent = `${state.orders.length} Aufträge`;
  }

  if (startupRevenueMetric) {
    startupRevenueMetric.textContent = `${euro(bookedRevenue)} lokal erfasst`;
  }

  updateMobileDock();
}

function initCustomerPage() {
  const productGrid = document.querySelector("#product-grid");
  if (!productGrid) {
    return;
  }

  const configForm = document.querySelector("#config-form");
  const litersInput = document.querySelector("#liters");
  const jarsInput = document.querySelector("#jars");
  const storyPackageInput = document.querySelector("#story-package");
  const configPrice = document.querySelector("#config-price");
  const cartList = document.querySelector("#cart-list");
  const cartTotalLabel = document.querySelector("#cart-total-label");
  const paymentForm = document.querySelector("#payment-form");
  const paymentFeedback = document.querySelector("#payment-feedback");
  const timeline = document.querySelector("#timeline");

  renderProducts(productGrid);
  renderTimeline(timeline);
  renderCart(cartList, cartTotalLabel);
  updateConfiguratorPrice(litersInput, jarsInput, storyPackageInput, configPrice);

  configForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addCartItem({
      id: createId(),
      title: `Individueller Press-Tag · ${litersInput.value}L / ${jarsInput.value} Gläser`,
      price: calculateConfigPrice(litersInput, jarsInput, storyPackageInput),
      type: "custom",
    });
    renderCart(cartList, cartTotalLabel);
  });

  [litersInput, jarsInput, storyPackageInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateConfiguratorPrice(litersInput, jarsInput, storyPackageInput, configPrice);
    });
  });

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setFeedback(paymentFeedback, "");

    if (!state.cart.length) {
      setFeedback(paymentFeedback, "Der Warenkorb ist leer.", "error");
      return;
    }

    const company = document.querySelector("#customer-company").value.trim();
    const name = document.querySelector("#customer-name").value.trim();
    const email = document.querySelector("#customer-email").value.trim();
    const cardNumber = document.querySelector("#card-number").value.replace(/\s+/g, "");
    const cardExpiry = document.querySelector("#card-expiry").value.trim();
    const cardCvc = document.querySelector("#card-cvc").value.trim();

    if (!company || !name || !email) {
      setFeedback(paymentFeedback, "Bitte Kundendaten vollständig ausfüllen.", "error");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFeedback(paymentFeedback, "Bitte eine gültige E-Mail-Adresse eingeben.", "error");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber) || !/^\d{2}\/\d{2}$/.test(cardExpiry) || !/^\d{3,4}$/.test(cardCvc)) {
      setFeedback(paymentFeedback, "Kartendaten sind formal ungültig.", "error");
      return;
    }

    const order = {
      id: `WP-${Math.floor(Math.random() * 900000 + 100000)}`,
      company,
      name,
      email,
      total: cartTotal(),
      items: state.cart.map((item) => ({ ...item })),
      createdAt: new Date().toISOString(),
    };

    state.orders.unshift(order);
    state.cart = [];
    persistState();
    renderCart(cartList, cartTotalLabel);
    initSharedMetrics();
    paymentForm.reset();
    setFeedback(paymentFeedback, `Zahlung erfolgreich autorisiert. Bestellnummer ${order.id}.`, "success");
  });
}

function initStartupPage() {
  const startupRoot = document.querySelector("#startup-root");
  if (!startupRoot) {
    return;
  }

  const gate = document.querySelector("#startup-gate");
  const content = document.querySelector("#startup-content");
  const form = document.querySelector("#startup-password-form");
  const feedback = document.querySelector("#startup-feedback");
  const passwordInput = document.querySelector("#startup-password");
  const logoutButton = document.querySelector("#logout-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setFeedback(feedback, "");

    const password = passwordInput.value.trim();
    if (!password) {
      setFeedback(feedback, "Bitte ein Passwort eingeben.", "error");
      return;
    }

    if (password !== STARTUP_PASSWORD) {
      setFeedback(feedback, "Passwort falsch.", "error");
      return;
    }

    window.sessionStorage.setItem(STARTUP_SESSION_KEY, "true");
    passwordInput.value = "";
    unlockStartupArea(gate, content);
    initStartupDashboard();
  });

  logoutButton.addEventListener("click", () => {
    window.sessionStorage.removeItem(STARTUP_SESSION_KEY);
    lockStartupArea(gate, content);
    setFeedback(feedback, "");
  });

  if (window.sessionStorage.getItem(STARTUP_SESSION_KEY) === "true") {
    unlockStartupArea(gate, content);
    initStartupDashboard();
  } else {
    lockStartupArea(gate, content);
  }
}

let startupDashboardInitialized = false;

function initStartupDashboard() {
  if (startupDashboardInitialized) {
    renderStartupData();
    return;
  }

  startupDashboardInitialized = true;

  document.querySelector("#route-form").addEventListener("submit", handleRouteSubmit);
  document.querySelector("#task-form").addEventListener("submit", handleTaskSubmit);
  document.querySelector("#finance-form").addEventListener("submit", handleFinanceSubmit);
  document.querySelector("#clear-orders").addEventListener("click", clearOrders);
  document.querySelector("#founder-notes").addEventListener("input", (event) => {
    state.notes = event.target.value;
    persistState();
  });

  renderStartupData();
}

function refreshVisibleState() {
  initSharedMetrics();

  const cartList = document.querySelector("#cart-list");
  const cartTotalLabel = document.querySelector("#cart-total-label");
  if (cartList && cartTotalLabel) {
    renderCart(cartList, cartTotalLabel);
  }

  const configPrice = document.querySelector("#config-price");
  if (configPrice) {
    updateConfiguratorPrice(
      document.querySelector("#liters"),
      document.querySelector("#jars"),
      document.querySelector("#story-package"),
      configPrice,
    );
  }

  if (document.querySelector("#startup-root")) {
    renderStartupData();
  }
}

function updateMobileDock() {
  const totalLabel = document.querySelector("#mobile-dock-total");
  const countLabel = document.querySelector("#mobile-dock-count");
  const dock = document.querySelector(".mobile-dock");

  if (!totalLabel || !countLabel || !dock) {
    return;
  }

  const quantity = state.cart.reduce((sum, item) => sum + safeNumber(item.quantity, 0), 0);
  totalLabel.textContent = euro(cartTotal());
  countLabel.textContent = `${quantity} ${quantity === 1 ? "Position" : "Positionen"} im Warenkorb`;
  dock.classList.toggle("is-active", quantity > 0);
}

function renderStartupData() {
  renderOkrs(document.querySelector("#okr-list"), document.querySelector("#okr-progress"));
  renderRoutes(document.querySelector("#route-list"), document.querySelector("#route-count"));
  renderTasks(document.querySelector("#kanban"));
  renderFinance(document.querySelector("#finance-metrics"));
  renderOrders(document.querySelector("#order-list"));
  const notesField = document.querySelector("#founder-notes");
  if (notesField) {
    notesField.value = state.notes;
  }
}

function unlockStartupArea(gate, content) {
  gate.classList.add("is-hidden");
  content.classList.remove("is-locked");
}

function lockStartupArea(gate, content) {
  gate.classList.remove("is-hidden");
  content.classList.add("is-locked");
}

function loadState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return cloneDefaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (error) {
    return cloneDefaultState();
  }
}

function persistState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function euro(amount) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function normalizeState(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return cloneDefaultState();
  }

  const base = cloneDefaultState();
  const next = {
    ...base,
    ...parsed,
    cart: normalizeCart(parsed.cart),
    orders: normalizeOrders(parsed.orders),
    routes: normalizeRoutes(parsed.routes, base.routes),
    tasks: normalizeTasks(parsed.tasks, base.tasks),
    okrs: normalizeOkrs(parsed.okrs, base.okrs),
    finance: normalizeFinance(parsed.finance, base.finance),
    notes: typeof parsed.notes === "string" ? parsed.notes : base.notes,
  };

  return next;
}

function normalizeCart(cart) {
  if (!Array.isArray(cart)) {
    return [];
  }

  return cart
    .filter((item) => item && typeof item.title === "string")
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      title: item.title,
      price: safeNumber(item.price),
      quantity: Math.max(1, Math.round(safeNumber(item.quantity, 1))),
      type: typeof item.type === "string" ? item.type : "offer",
    }));
}

function normalizeOrders(orders) {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders
    .filter((order) => order && typeof order.company === "string")
    .map((order) => ({
      id: typeof order.id === "string" ? order.id : `WP-${Math.floor(Math.random() * 900000 + 100000)}`,
      company: order.company,
      name: typeof order.name === "string" ? order.name : "",
      email: typeof order.email === "string" ? order.email : "",
      total: safeNumber(order.total),
      items: normalizeCart(order.items),
      createdAt: typeof order.createdAt === "string" ? order.createdAt : new Date().toISOString(),
    }));
}

function normalizeRoutes(routes, fallback) {
  if (!Array.isArray(routes) || !routes.length) {
    return fallback;
  }

  return routes
    .filter((route) => route && typeof route.site === "string")
    .map((route) => ({
      id: typeof route.id === "string" ? route.id : createId(),
      site: route.site,
      date: typeof route.date === "string" ? route.date : "",
      volume: Math.max(0, safeNumber(route.volume)),
    }));
}

function normalizeTasks(tasks, fallback) {
  if (!Array.isArray(tasks) || !tasks.length) {
    return fallback;
  }

  return tasks
    .filter((task) => task && typeof task.title === "string")
    .map((task) => ({
      id: typeof task.id === "string" ? task.id : createId(),
      title: task.title,
      owner: typeof task.owner === "string" ? task.owner : "Team",
      priority: normalizePriority(task.priority),
      status: TASK_COLUMNS.some((column) => column.id === task.status) ? task.status : "discover",
    }));
}

function normalizeOkrs(okrs, fallback) {
  if (!Array.isArray(okrs) || !okrs.length) {
    return fallback;
  }

  return okrs
    .filter((item) => item && typeof item.text === "string")
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      text: item.text,
      done: Boolean(item.done),
    }));
}

function normalizeFinance(finance, fallback) {
  if (!finance || typeof finance !== "object") {
    return { ...fallback };
  }

  return {
    burnRate: safeNumber(finance.burnRate, fallback.burnRate),
    averageOrder: safeNumber(finance.averageOrder, fallback.averageOrder),
    cashBalance: safeNumber(finance.cashBalance, fallback.cashBalance),
  };
}

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizePriority(priority) {
  const mapping = {
    High: "Hoch",
    Medium: "Mittel",
    Low: "Niedrig",
    Hoch: "Hoch",
    Mittel: "Mittel",
    Niedrig: "Niedrig",
  };

  return mapping[priority] || "Mittel";
}

function setFeedback(element, message, tone) {
  if (!element) {
    return;
  }

  element.classList.remove("is-success", "is-error");
  if (tone === "success") {
    element.classList.add("is-success");
  }
  if (tone === "error") {
    element.classList.add("is-error");
  }

  element.textContent = message;
}

function renderProducts(productGrid) {
  productGrid.innerHTML = "";

  offers.forEach((offer) => {
    const card = document.createElement("article");
    card.className = "product-card stagger";
    card.innerHTML = `
      <div>
        <p class="kicker">${offer.tag}</p>
        <h3>${offer.title}</h3>
        <p>${offer.description}</p>
      </div>
      <div>
        <div class="product-meta">
          <span>${offer.outcome}</span>
          <strong class="product-price">${euro(offer.price)}</strong>
        </div>
        <button class="button button-primary" type="button">In den Warenkorb</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      addCartItem({
        id: offer.id,
        title: offer.title,
        price: offer.price,
        type: "offer",
      });

      const cartList = document.querySelector("#cart-list");
      const cartTotalLabel = document.querySelector("#cart-total-label");
      if (cartList && cartTotalLabel) {
        renderCart(cartList, cartTotalLabel);
      }
    });

    productGrid.append(card);
  });
}

function calculateConfigPrice(litersInput, jarsInput, storyPackageInput) {
  const liters = Number(litersInput.value || 0);
  const jars = Number(jarsInput.value || 0);
  const storytelling = Number(storyPackageInput.value || 0);
  const base = 340;
  const volumePrice = liters * 1.65;
  const honeyPrice = jars * 4.5;
  return Math.round(base + volumePrice + honeyPrice + storytelling);
}

function updateConfiguratorPrice(litersInput, jarsInput, storyPackageInput, configPrice) {
  configPrice.textContent = `Aktueller Pilotpreis: ${euro(
    calculateConfigPrice(litersInput, jarsInput, storyPackageInput),
  )}`;
}

function addCartItem(item) {
  const existing = state.cart.find((entry) => entry.title === item.title && entry.price === item.price);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...item, quantity: 1 });
  }

  persistState();
  initSharedMetrics();
}

function renderCart(cartList, cartTotalLabel) {
  if (!cartList || !cartTotalLabel) {
    return;
  }

  cartList.innerHTML = "";

  if (!state.cart.length) {
    cartList.innerHTML =
      '<div class="empty-state">Noch kein Angebot im Warenkorb. Buche einen Piloten oder stelle einen individuellen Press-Tag zusammen.</div>';
    cartTotalLabel.textContent = euro(0);
    return;
  }

  state.cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <p><strong>${item.title}</strong></p>
        <small>${item.quantity} x ${euro(item.price)}</small>
      </div>
      <div class="cart-actions">
        <button type="button" data-action="decrease">-1</button>
        <button type="button" data-action="increase">+1</button>
        <button type="button" data-action="remove">Entfernen</button>
      </div>
    `;

    row.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "increase") {
          item.quantity += 1;
        }
        if (action === "decrease") {
          item.quantity -= 1;
        }
        if (action === "remove" || item.quantity <= 0) {
          state.cart = state.cart.filter((entry) => entry !== item);
        }
        persistState();
        renderCart(cartList, cartTotalLabel);
      });
    });

    cartList.append(row);
  });

  cartTotalLabel.textContent = euro(cartTotal());
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderOrders(orderList) {
  if (!orderList) {
    return;
  }

  orderList.innerHTML = "";

  if (!state.orders.length) {
    orderList.innerHTML = '<div class="empty-state">Noch keine Bestellungen gespeichert.</div>';
    return;
  }

  state.orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "order-card";
    const date = new Date(order.createdAt).toLocaleString("de-DE");
    card.innerHTML = `
      <div>
        <p><strong>${order.company}</strong> · ${euro(order.total)}</p>
        <small>${order.id} · ${date}</small>
      </div>
      <p>${order.items.map((item) => `${item.quantity}x ${item.title}`).join(" / ")}</p>
    `;
    orderList.append(card);
  });
}

function clearOrders() {
  state.orders = [];
  persistState();
  renderOrders(document.querySelector("#order-list"));
  renderFinance(document.querySelector("#finance-metrics"));
  initSharedMetrics();
}

function renderOkrs(okrList, okrProgress) {
  if (!okrList || !okrProgress) {
    return;
  }

  okrList.innerHTML = "";
  const done = state.okrs.filter((item) => item.done).length;
  const progress = state.okrs.length ? Math.round((done / state.okrs.length) * 100) : 0;
  okrProgress.textContent = `${progress}% erledigt`;

  state.okrs.forEach((item) => {
    const row = document.createElement("label");
    row.className = "check-item";
    row.innerHTML = `
      <input type="checkbox" ${item.done ? "checked" : ""} />
      <span>${item.text}</span>
    `;
    row.querySelector("input").addEventListener("change", (event) => {
      item.done = event.target.checked;
      persistState();
      renderOkrs(okrList, okrProgress);
    });
    okrList.append(row);
  });
}

function handleRouteSubmit(event) {
  event.preventDefault();
  const site = document.querySelector("#route-site").value.trim();
  const date = document.querySelector("#route-date").value;
  const volume = Number(document.querySelector("#route-volume").value);

  if (!site || !date || volume <= 0) {
    return;
  }

  state.routes.unshift({
    id: createId(),
    site,
    date,
    volume,
  });

  persistState();
  renderRoutes(document.querySelector("#route-list"), document.querySelector("#route-count"));
  initSharedMetrics();
  event.target.reset();
}

function renderRoutes(routeList, routeCount) {
  if (!routeList || !routeCount) {
    return;
  }

  routeList.innerHTML = "";
  routeCount.textContent = `${state.routes.length} Routen`;

  if (!state.routes.length) {
    routeList.innerHTML = '<div class="empty-state">Keine Pilot-Route geplant.</div>';
    return;
  }

  state.routes
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((route) => {
      const card = document.createElement("article");
      card.className = "route-item";
      card.innerHTML = `
        <div>
          <p><strong>${route.site}</strong></p>
          <p>${route.volume} Liter eingeplant</p>
        </div>
        <div class="cart-actions">
          <time datetime="${route.date}">${new Date(route.date).toLocaleDateString("de-DE")}</time>
          <button type="button">Löschen</button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => {
        state.routes = state.routes.filter((entry) => entry.id !== route.id);
        persistState();
        renderRoutes(routeList, routeCount);
        initSharedMetrics();
      });
      routeList.append(card);
    });
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const title = document.querySelector("#task-title").value.trim();
  const owner = document.querySelector("#task-owner").value.trim();
  const priority = document.querySelector("#task-priority").value;

  if (!title || !owner) {
    return;
  }

  state.tasks.unshift({
    id: createId(),
    title,
    owner,
    priority,
    status: "discover",
  });

  persistState();
  renderTasks(document.querySelector("#kanban"));
  event.target.reset();
}

function renderTasks(kanban) {
  if (!kanban) {
    return;
  }

  kanban.innerHTML = "";

  TASK_COLUMNS.forEach((column) => {
    const wrapper = document.createElement("section");
    wrapper.className = "kanban-column";
    wrapper.innerHTML = `
      <h4>${column.label}</h4>
      <div class="task-stack"></div>
    `;

    const stack = wrapper.querySelector(".task-stack");
    const tasks = state.tasks.filter((task) => task.status === column.id);

    if (!tasks.length) {
      stack.innerHTML = `<div class="empty-state">Keine Aufgaben in ${column.label}.</div>`;
    }

    tasks.forEach((task) => {
      const card = document.createElement("article");
      card.className = "task-card";
      card.innerHTML = `
        <div>
          <p><strong>${task.title}</strong></p>
          <small>${task.owner} · ${task.priority}</small>
        </div>
        <div class="task-actions"></div>
      `;
      const actions = card.querySelector(".task-actions");

      TASK_COLUMNS
        .filter((entry) => entry.id !== task.status)
        .forEach((target) => {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = `→ ${target.label}`;
          button.addEventListener("click", () => {
            task.status = target.id;
            persistState();
            renderTasks(kanban);
          });
          actions.append(button);
        });

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Entfernen";
      removeButton.addEventListener("click", () => {
        state.tasks = state.tasks.filter((entry) => entry.id !== task.id);
        persistState();
        renderTasks(kanban);
      });
      actions.append(removeButton);
      stack.append(card);
    });

    kanban.append(wrapper);
  });
}

function renderFinance(financeMetrics) {
  if (!financeMetrics) {
    return;
  }

  const burnRateInput = document.querySelector("#burn-rate");
  const averageOrderInput = document.querySelector("#average-order");
  const cashBalanceInput = document.querySelector("#cash-balance");

  if (burnRateInput && averageOrderInput && cashBalanceInput) {
    burnRateInput.value = state.finance.burnRate;
    averageOrderInput.value = state.finance.averageOrder;
    cashBalanceInput.value = state.finance.cashBalance;
  }

  const averageOrder = safeNumber(state.finance.averageOrder);
  const burnRate = safeNumber(state.finance.burnRate);
  const cashBalance = safeNumber(state.finance.cashBalance);
  const ordersNeeded = averageOrder > 0 ? Math.ceil(burnRate / averageOrder) : "k. A.";
  const runwayMonths = burnRate > 0 ? `${(cashBalance / burnRate).toFixed(1)} Monate` : "Unbegrenzt";
  const bookedRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);

  financeMetrics.innerHTML = `
    <div class="finance-stat">
      <span>Aufträge pro Monat</span>
      <strong>${ordersNeeded}</strong>
      <p>So viele durchschnittliche Aufträge brauchst du, um den aktuellen monatlichen Aufwand zu decken.</p>
    </div>
    <div class="finance-stat">
      <span>Reichweite</span>
      <strong>${runwayMonths}</strong>
      <p>Auf Basis von Kontostand und eingetragenem monatlichen Aufwand.</p>
    </div>
    <div class="finance-stat">
      <span>Bereits verkauft</span>
      <strong>${euro(bookedRevenue)}</strong>
      <p>Alle Demo-Aufträge der Kundenseite laufen hier zusammen.</p>
    </div>
  `;
}

function handleFinanceSubmit(event) {
  event.preventDefault();
  state.finance = {
    burnRate: Math.max(0, safeNumber(document.querySelector("#burn-rate").value, state.finance.burnRate)),
    averageOrder: Math.max(0, safeNumber(document.querySelector("#average-order").value, state.finance.averageOrder)),
    cashBalance: Math.max(0, safeNumber(document.querySelector("#cash-balance").value, state.finance.cashBalance)),
  };
  persistState();
  renderFinance(document.querySelector("#finance-metrics"));
}

function renderTimeline(timeline) {
  if (!timeline) {
    return;
  }

  timeline.innerHTML = "";
  phases.forEach((phase) => {
    const card = document.createElement("article");
    card.className = "timeline-card stagger";
    card.innerHTML = `
      <p class="phase">${phase.phase}</p>
      <h3>${phase.title}</h3>
      <p><strong>${phase.metric}</strong></p>
      <p>${phase.details}</p>
    `;
    timeline.append(card);
  });
}
