const STARTUP_PASSWORD = "waben2026";
const STARTUP_SESSION_KEY = "wabenpresse-founder-auth";

const offers = [
  {
    id: "orchard-launch",
    title: "Orchard Launch",
    description:
      "Standortanalyse, zwei Bienenboxen, Sicherheitscheck und ein erster Press-Tag zur Markenbildung.",
    price: 1490,
    tag: "B2B Pilot",
    outcome: "In 14 Tagen einsatzbereit",
  },
  {
    id: "press-day",
    title: "Community Press Day",
    description:
      "Mobile Saftpresse, Abfuellung, Helferbriefing und Live-Verkauf fuer Gemeinden, Schulen oder Firmenhoefe.",
    price: 890,
    tag: "Event Umsatz",
    outcome: "Bis zu 600 Liter pro Tag",
  },
  {
    id: "nectar-subscription",
    title: "Nectar Subscription",
    description:
      "Monatliche Box mit Saft, Honig und Standortstory fuer Teams, Kunden oder Anwohner.",
    price: 39,
    tag: "Recurring Revenue",
    outcome: "Preis pro Box",
  },
];

const phases = [
  {
    phase: "Phase 01",
    title: "Problem / ICP",
    metric: "10 Tiefeninterviews, 3 bezahlte Piloten",
    details:
      "Fokus auf Gemeinden mit Streuobst, Biohoefe mit Tourismusbezug und Firmenstandorte mit ESG-Budget.",
  },
  {
    phase: "Phase 02",
    title: "Pilot Ops",
    metric: "90% puenktliche Press-Tage",
    details:
      "Standardisierte Sicherheitsablaeufe, Presslogistik, Bee-Care Checklists und ein fester Wochenrhythmus.",
  },
  {
    phase: "Phase 03",
    title: "Repeatability",
    metric: "3 Wiederholungsbuchungen pro Standorttyp",
    details:
      "Nur Angebote skalieren, die ohne Founder-Sonderlocken replizierbar und deckungsbeitragspositiv sind.",
  },
  {
    phase: "Phase 04",
    title: "Cluster Expansion",
    metric: "Eine Stadt, ein Vertriebsskript, positive Unit Economics",
    details:
      "Erst lokal dominieren, dann benachbarte Landkreise mit denselben Maschinen, Wegen und Narrativen erschliessen.",
  },
];

const defaultState = {
  cart: [],
  orders: [],
  routes: [
    { id: crypto.randomUUID(), site: "Biohof Morgenrot", date: "2026-04-08", volume: 450 },
    { id: crypto.randomUUID(), site: "Stadtpark Nord", date: "2026-04-11", volume: 300 },
  ],
  tasks: [
    {
      id: crypto.randomUUID(),
      title: "Pilotvertrag fuer ersten Gemeindestandort abschliessen",
      owner: "Christoph",
      priority: "High",
      status: "discover",
    },
    {
      id: crypto.randomUUID(),
      title: "Mobile Press-Checkliste in 12 Schritten standardisieren",
      owner: "Ops",
      priority: "Medium",
      status: "build",
    },
    {
      id: crypto.randomUUID(),
      title: "Employer-Branding-Angebot fuer Offices testen",
      owner: "Sales",
      priority: "Low",
      status: "pilot",
    },
  ],
  okrs: [
    { id: crypto.randomUUID(), text: "3 zahlende Pilotkunden bis Ende Q2", done: true },
    { id: crypto.randomUUID(), text: "Deckungsbeitrag pro Press-Tag positiv halten", done: false },
    { id: crypto.randomUUID(), text: "Mindestens 2 wiederkehrende Abo-Kunden gewinnen", done: false },
    { id: crypto.randomUUID(), text: "Sicherheits- und Bee-Care SOP dokumentieren", done: true },
  ],
  finance: {
    burnRate: 8500,
    averageOrder: 1180,
    cashBalance: 54000,
  },
  notes:
    "Wichtigste Annahme: Gemeinden kaufen nicht nur Nachhaltigkeit, sondern sichtbare Buergerbeteiligung. Jeder Pilot muss ein verwertbares Story-Asset erzeugen.",
};

const state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  initSharedMetrics();
  initCustomerPage();
  initStartupPage();
});

function initSharedMetrics() {
  const northStarMetric = document.querySelector("#north-star-metric");
  if (!northStarMetric) {
    return;
  }

  const liters = state.routes.reduce((sum, route) => sum + Number(route.volume || 0), 0);
  northStarMetric.textContent = `${liters} Liter`;
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
      id: crypto.randomUUID(),
      title: `Custom Press Day · ${litersInput.value}L / ${jarsInput.value} Glaeser`,
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
    paymentFeedback.textContent = "";

    if (!state.cart.length) {
      paymentFeedback.textContent = "Der Warenkorb ist leer.";
      return;
    }

    const company = document.querySelector("#customer-company").value.trim();
    const name = document.querySelector("#customer-name").value.trim();
    const email = document.querySelector("#customer-email").value.trim();
    const cardNumber = document.querySelector("#card-number").value.replace(/\s+/g, "");
    const cardExpiry = document.querySelector("#card-expiry").value.trim();
    const cardCvc = document.querySelector("#card-cvc").value.trim();

    if (!company || !name || !email) {
      paymentFeedback.textContent = "Bitte Kundendaten vollstaendig ausfuellen.";
      return;
    }

    if (!/^\d{16}$/.test(cardNumber) || !/^\d{2}\/\d{2}$/.test(cardExpiry) || !/^\d{3,4}$/.test(cardCvc)) {
      paymentFeedback.textContent = "Kartendaten sind formal ungueltig.";
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
    paymentForm.reset();
    paymentFeedback.textContent = `Zahlung erfolgreich autorisiert. Bestellnummer ${order.id}.`;
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
    feedback.textContent = "";

    const password = passwordInput.value.trim();
    if (!password) {
      feedback.textContent = "Bitte ein Passwort eingeben.";
      return;
    }

    if (password !== STARTUP_PASSWORD) {
      feedback.textContent = "Passwort falsch.";
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
    feedback.textContent = "";
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

function renderStartupData() {
  renderOkrs(document.querySelector("#okr-list"), document.querySelector("#okr-progress"));
  renderRoutes(document.querySelector("#route-list"), document.querySelector("#route-count"));
  renderTasks(document.querySelector("#kanban"));
  renderFinance(document.querySelector("#finance-metrics"));
  renderOrders(document.querySelector("#order-list"));
  document.querySelector("#founder-notes").value = state.notes;
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
  const raw = window.localStorage.getItem("wabenpresse-state");
  if (!raw) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      finance: { ...defaultState.finance, ...(parsed.finance || {}) },
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function persistState() {
  window.localStorage.setItem("wabenpresse-state", JSON.stringify(state));
}

function euro(amount) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
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
}

function renderCart(cartList, cartTotalLabel) {
  cartList.innerHTML = "";

  if (!state.cart.length) {
    cartList.innerHTML =
      '<div class="empty-state">Noch kein Angebot im Warenkorb. Buche einen Piloten oder baue einen Custom Press Day.</div>';
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
}

function renderOkrs(okrList, okrProgress) {
  okrList.innerHTML = "";
  const done = state.okrs.filter((item) => item.done).length;
  const progress = Math.round((done / state.okrs.length) * 100);
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

  state.routes.unshift({
    id: crypto.randomUUID(),
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
          <button type="button">Loeschen</button>
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

  state.tasks.unshift({
    id: crypto.randomUUID(),
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
  const columns = [
    { id: "discover", label: "Discover" },
    { id: "build", label: "Build" },
    { id: "pilot", label: "Pilot" },
  ];

  kanban.innerHTML = "";

  columns.forEach((column) => {
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

      columns
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
  const burnRateInput = document.querySelector("#burn-rate");
  const averageOrderInput = document.querySelector("#average-order");
  const cashBalanceInput = document.querySelector("#cash-balance");

  if (burnRateInput && averageOrderInput && cashBalanceInput) {
    burnRateInput.value = state.finance.burnRate;
    averageOrderInput.value = state.finance.averageOrder;
    cashBalanceInput.value = state.finance.cashBalance;
  }

  const ordersNeeded = Math.ceil(state.finance.burnRate / state.finance.averageOrder);
  const runwayMonths = (state.finance.cashBalance / state.finance.burnRate).toFixed(1);
  const bookedRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);

  financeMetrics.innerHTML = `
    <div class="finance-stat">
      <span>Orders pro Monat</span>
      <strong>${ordersNeeded}</strong>
      <p>So viele durchschnittliche Auftraege brauchst du, um den aktuellen Burn zu decken.</p>
    </div>
    <div class="finance-stat">
      <span>Runway</span>
      <strong>${runwayMonths} Monate</strong>
      <p>Auf Basis von Cash im Konto und dem eingetragenen monatlichen Burn.</p>
    </div>
    <div class="finance-stat">
      <span>Bereits verkauft</span>
      <strong>${euro(bookedRevenue)}</strong>
      <p>Alle Demo-Orders der Kundenseite laufen hier zusammen.</p>
    </div>
  `;
}

function handleFinanceSubmit(event) {
  event.preventDefault();
  state.finance = {
    burnRate: Number(document.querySelector("#burn-rate").value),
    averageOrder: Number(document.querySelector("#average-order").value),
    cashBalance: Number(document.querySelector("#cash-balance").value),
  };
  persistState();
  renderFinance(document.querySelector("#finance-metrics"));
}

function renderTimeline(timeline) {
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
