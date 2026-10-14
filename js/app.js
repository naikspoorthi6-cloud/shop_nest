/* ==========================================================
   ShopNest - main script
   Handles: shared header/footer, cart (localStorage), and
   the logic for every page (selected via <body data-page="">).
   Requires data.js to be loaded first.
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Settings & helpers ---------- */
  const CART_KEY = "shopnest_cart";
  const MAX_QTY = 10;
  const FREE_SHIPPING_MIN = 1500;
  const SHIPPING_FEE = 79;

  const page = document.body.dataset.page;
  const $ = (selector, root = document) => root.querySelector(selector);

  const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const findProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
  const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
  const discount = (p) => Math.round((1 - p.price / p.oldPrice) * 100);
  const esc = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Cart (saved in localStorage) ---------- */
  const Cart = {
    read() {
      try {
        const data = JSON.parse(localStorage.getItem(CART_KEY));
        if (!Array.isArray(data)) return [];
        return data.filter((i) => findProduct(i.id) && i.qty > 0);
      } catch (err) {
        return [];
      }
    },
    write(items) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch (err) {
        /* storage unavailable - cart simply will not persist */
      }
      updateBadge();
    },
    add(id, qty = 1) {
      const items = this.read();
      const existing = items.find((i) => i.id === Number(id));
      if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
      else items.push({ id: Number(id), qty: Math.min(MAX_QTY, qty) });
      this.write(items);
    },
    setQty(id, qty) {
      const items = this.read();
      const item = items.find((i) => i.id === Number(id));
      if (!item) return;
      item.qty = Math.max(1, Math.min(MAX_QTY, qty));
      this.write(items);
    },
    remove(id) {
      this.write(this.read().filter((i) => i.id !== Number(id)));
    },
    clear() {
      this.write([]);
    },
    count() {
      return this.read().reduce((sum, i) => sum + i.qty, 0);
    },
    lines() {
      return this.read().map((i) => {
        const product = findProduct(i.id);
        return { product, qty: i.qty, lineTotal: product.price * i.qty };
      });
    },
    totals() {
      const lines = this.lines();
      const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
      const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
      return { subtotal, shipping, total: subtotal + shipping, items: this.count() };
    }
  };

  function updateBadge() {
    const count = Cart.count();
    document.querySelectorAll(".cart-badge").forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
    });
  }

  /* ---------- Toast message ---------- */
  let toastTimer;
  function toast(message) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------- Shared header & footer ---------- */
  function renderLayout() {
    const activeMap = { home: "home", products: "products", details: "products", cart: "cart", checkout: "cart", contact: "contact" };
    const active = activeMap[page];
    const link = (key, href, label) =>
      `<a href="${href}" ${active === key ? 'class="active" aria-current="page"' : ""}>${label}</a>`;
    const query = new URLSearchParams(location.search).get("search") || "";

    const header = $("#site-header");
    if (header) {
      header.outerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="logo" href="index.html" aria-label="ShopNest home">
            <span class="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
            </span>
            <span class="logo-text">Shop<b>Nest</b></span>
          </a>

          <form class="search" action="products.html" method="get" role="search">
            <input type="search" name="search" placeholder="Search for headphones, shoes, lamps..." value="${esc(query)}" aria-label="Search products" />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            </button>
          </form>

          <nav class="nav" id="main-nav" aria-label="Main navigation">
            ${link("home", "index.html", "Home")}
            ${link("products", "products.html", "Products")}
            <a href="index.html#categories">Categories</a>
            <a href="cart.html" class="nav-cart ${active === "cart" ? "active" : ""}" ${active === "cart" ? 'aria-current="page"' : ""}>
              Cart <span class="cart-badge" hidden>0</span>
            </a>
            ${link("contact", "contact.html", "Contact")}
          </nav>

          <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>`;
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.outerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <a class="logo logo-light" href="index.html"><span class="logo-text">Shop<b>Nest</b></span></a>
            <p>Everyday essentials, delivered across India. A sample store built for a college web-development project.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><a href="products.html">All products</a></li>
              <li><a href="index.html#categories">Categories</a></li>
              <li><a href="cart.html">Your cart</a></li>
              <li><a href="checkout.html">Checkout</a></li>
            </ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>
              ${CATEGORIES.map((c) => `<li><a href="products.html?category=${encodeURIComponent(c.name)}">${c.name}</a></li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li>support@shopnest.example</li>
              <li>+91 98765 43210</li>
              <li><a href="contact.html">Contact us</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer-bottom">&copy; ${new Date().getFullYear()} ShopNest. Demo project - no real orders are placed.</div>
      </footer>`;
    }

    // Mobile menu
    const toggle = $("#menu-toggle");
    const nav = $("#main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open);
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          nav.classList.remove("open");
          toggle.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
    updateBadge();
  }

  /* ---------- Image fallback: if a photo fails to load, try its backup URL ---------- */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.fallback && !img.dataset.failed) {
      img.dataset.failed = "1";
      img.src = img.dataset.fallback;
    }
  }, true);

  /* ---------- Product card (used on several pages) ---------- */
  function ratingHTML(p) {
    return `<div class="rating" aria-label="Rated ${p.rating} out of 5 from ${p.reviews} reviews">
      <span class="stars" aria-hidden="true">${stars(p.rating)}</span>
      <span class="rating-num">${p.rating.toFixed(1)}</span>
      <span class="rating-count">(${p.reviews})</span>
    </div>`;
  }

  function priceHTML(p) {
    return `<div class="price"><span class="price-now">${money(p.price)}</span>
      <del>${money(p.oldPrice)}</del><span class="price-off">${discount(p)}% off</span></div>`;
  }

  function productCard(p) {
    return `
    <article class="card">
      <a class="card-img" href="product-details.html?id=${p.id}" aria-label="View ${esc(p.name)}">
        <img src="${p.image}" data-fallback="${p.imageBackup}" alt="${esc(p.name)}" loading="lazy" />
        <span class="card-tag">${discount(p)}% off</span>
      </a>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <h3 class="card-title"><a href="product-details.html?id=${p.id}">${esc(p.name)}</a></h3>
        ${ratingHTML(p)}
        ${priceHTML(p)}
        <div class="card-actions">
          <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
          <a class="btn btn-outline" href="product-details.html?id=${p.id}">View Details</a>
        </div>
      </div>
    </article>`;
  }

  // Any "Add to Cart" button with data-add works on every page
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const product = findProduct(btn.dataset.add);
    Cart.add(product.id, 1);
    toast(`${product.name} added to cart`);
    const badge = $(".cart-badge");
    if (badge) {
      badge.classList.remove("pop");
      void badge.offsetWidth; // restart animation
      badge.classList.add("pop");
    }
  });

  /* ---------- Home page ---------- */
  function initHome() {
    const cats = $("#category-grid");
    if (cats) {
      cats.innerHTML = CATEGORIES.map((c) => {
        const count = PRODUCTS.filter((p) => p.category === c.name).length;
        return `<a class="category-card" href="products.html?category=${encodeURIComponent(c.name)}">
          <img class="category-thumb" src="${c.image}" alt="" loading="lazy" />
          <strong>${c.name}</strong>
          <span>${c.tagline}</span>
          <small>${count} products</small>
        </a>`;
      }).join("");
    }
    const featured = $("#featured-grid");
    if (featured) featured.innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 8).map(productCard).join("");
  }

  /* ---------- Products page ---------- */
  function initProducts() {
    const params = new URLSearchParams(location.search);
    const state = {
      category: CATEGORIES.some((c) => c.name === params.get("category")) ? params.get("category") : "All",
      search: (params.get("search") || "").trim(),
      sort: "featured"
    };

    const chips = $("#category-chips");
    const grid = $("#product-grid");
    const count = $("#result-count");
    const sort = $("#sort-select");
    const empty = $("#no-results");

    function drawChips() {
      const names = ["All", ...CATEGORIES.map((c) => c.name)];
      chips.innerHTML = names
        .map((n) => `<button class="chip ${n === state.category ? "active" : ""}" data-cat="${n}" aria-pressed="${n === state.category}">${n}</button>`)
        .join("");
    }

    function draw() {
      let list = PRODUCTS.filter((p) => {
        const inCat = state.category === "All" || p.category === state.category;
        const q = state.search.toLowerCase();
        const inSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return inCat && inSearch;
      });

      if (state.sort === "price-low") list.sort((a, b) => a.price - b.price);
      else if (state.sort === "price-high") list.sort((a, b) => b.price - a.price);
      else if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
      else list.sort((a, b) => a.id - b.id);

      grid.innerHTML = list.map(productCard).join("");
      empty.hidden = list.length > 0;
      let text = `Showing ${list.length} of ${PRODUCTS.length} products`;
      if (state.search) text += ` for "${state.search}"`;
      count.textContent = text;
    }

    chips.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-cat]");
      if (!chip) return;
      state.category = chip.dataset.cat;
      drawChips();
      draw();
    });
    sort.addEventListener("change", () => {
      state.sort = sort.value;
      draw();
    });
    $("#reset-filters").addEventListener("click", () => {
      state.category = "All";
      state.search = "";
      const box = $(".search input");
      if (box) box.value = "";
      drawChips();
      draw();
    });

    drawChips();
    draw();
  }

  /* ---------- Product details page ---------- */
  function initDetails() {
    const root = $("#details-root");
    const product = findProduct(new URLSearchParams(location.search).get("id"));

    if (!product) {
      root.innerHTML = `<div class="empty-state">
        <div class="empty-icon" aria-hidden="true">🔍</div>
        <h2>We couldn't find that product</h2>
        <p>The link may be old or the product may have been removed.</p>
        <a class="btn btn-primary" href="products.html">Browse all products</a></div>`;
      return;
    }

    document.title = `${product.name} | ShopNest`;
    let qty = 1;

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> / <a href="products.html">Products</a> /
        <a href="products.html?category=${encodeURIComponent(product.category)}">${product.category}</a> / <span>${esc(product.name)}</span>
      </nav>
      <div class="details">
        <div class="details-img"><img src="${product.image}" data-fallback="${product.imageBackup}" alt="${esc(product.name)}" /></div>
        <div class="details-info">
          <span class="card-cat">${product.category}</span>
          <h1>${esc(product.name)}</h1>
          ${ratingHTML(product)}
          ${priceHTML(product)}
          <p class="details-desc">${esc(product.description)}</p>
          <ul class="feature-list">${product.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>

          <div class="qty-row">
            <span class="label">Quantity</span>
            <div class="stepper">
              <button id="qty-dec" aria-label="Decrease quantity">&minus;</button>
              <output id="qty-val" aria-live="polite">1</output>
              <button id="qty-inc" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div class="details-actions">
            <button class="btn btn-primary btn-lg" id="detail-add">Add to Cart</button>
            <button class="btn btn-accent btn-lg" id="detail-buy">Buy Now</button>
          </div>
          <p class="note">${product.price >= FREE_SHIPPING_MIN ? "Free delivery on this item." : `Free delivery on orders above ${money(FREE_SHIPPING_MIN)}.`} Easy 7-day returns.</p>
        </div>
      </div>`;

    const val = $("#qty-val");
    $("#qty-dec").addEventListener("click", () => { qty = Math.max(1, qty - 1); val.textContent = qty; });
    $("#qty-inc").addEventListener("click", () => { qty = Math.min(MAX_QTY, qty + 1); val.textContent = qty; });
    $("#detail-add").addEventListener("click", () => {
      Cart.add(product.id, qty);
      toast(`${qty} × ${product.name} added to cart`);
    });
    $("#detail-buy").addEventListener("click", () => {
      Cart.add(product.id, qty);
      location.href = "checkout.html";
    });

    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
    const more = related.concat(PRODUCTS.filter((p) => p.category !== product.category && p.id !== product.id)).slice(0, 4);
    $("#related-grid").innerHTML = more.map(productCard).join("");
  }

  /* ---------- Cart page ---------- */
  function initCart() {
    const root = $("#cart-root");

    function draw() {
      const lines = Cart.lines();
      if (!lines.length) {
        root.innerHTML = `<div class="empty-state">
          <div class="empty-icon" aria-hidden="true">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add a few products and they will show up here.</p>
          <a class="btn btn-primary" href="products.html">Start shopping</a></div>`;
        return;
      }
      const t = Cart.totals();
      const toFree = FREE_SHIPPING_MIN - t.subtotal;
      root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-list">
          ${lines.map((l) => `
          <div class="cart-item">
            <a href="product-details.html?id=${l.product.id}" class="cart-thumb"><img src="${l.product.image}" data-fallback="${l.product.imageBackup}" alt="${esc(l.product.name)}" /></a>
            <div class="cart-info">
              <a class="cart-name" href="product-details.html?id=${l.product.id}">${esc(l.product.name)}</a>
              <span class="cart-unit">${money(l.product.price)} each</span>
              <button class="link-danger" data-remove="${l.product.id}">Remove</button>
            </div>
            <div class="stepper" role="group" aria-label="Quantity for ${esc(l.product.name)}">
              <button data-dec="${l.product.id}" aria-label="Decrease quantity" ${l.qty <= 1 ? "disabled" : ""}>&minus;</button>
              <output>${l.qty}</output>
              <button data-inc="${l.product.id}" aria-label="Increase quantity" ${l.qty >= MAX_QTY ? "disabled" : ""}>+</button>
            </div>
            <div class="cart-line-total">${money(l.lineTotal)}</div>
          </div>`).join("")}
          <div class="cart-footer-actions">
            <a class="btn btn-outline" href="products.html">Continue shopping</a>
            <button class="btn btn-ghost" id="clear-cart">Clear cart</button>
          </div>
        </div>

        <aside class="summary">
          <h2>Order summary</h2>
          <dl>
            <div><dt>Subtotal (${t.items} ${t.items === 1 ? "item" : "items"})</dt><dd>${money(t.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>${t.shipping === 0 ? "Free" : money(t.shipping)}</dd></div>
            <div class="total"><dt>Total</dt><dd>${money(t.total)}</dd></div>
          </dl>
          ${toFree > 0 ? `<p class="ship-note">Add ${money(toFree)} more to get free shipping.</p>` : `<p class="ship-note ok">You've got free shipping.</p>`}
          <a class="btn btn-primary btn-block btn-lg" href="checkout.html">Proceed to Checkout</a>
        </aside>
      </div>`;
    }

    root.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const rem = e.target.closest("[data-remove]");
      const clr = e.target.closest("#clear-cart");
      const current = (id) => Cart.read().find((i) => i.id === Number(id));

      if (inc) Cart.setQty(inc.dataset.inc, current(inc.dataset.inc).qty + 1);
      else if (dec) Cart.setQty(dec.dataset.dec, current(dec.dataset.dec).qty - 1);
      else if (rem) {
        const p = findProduct(rem.dataset.remove);
        Cart.remove(rem.dataset.remove);
        toast(`${p.name} removed from cart`);
      } else if (clr) Cart.clear();
      else return;
      draw();
    });

    draw();
  }

  /* ---------- Checkout page ---------- */
  const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  function initCheckout() {
    const root = $("#checkout-root");
    const lines = Cart.lines();

    if (!lines.length) {
      root.innerHTML = `<div class="empty-state">
        <div class="empty-icon" aria-hidden="true">🛒</div>
        <h2>Nothing to check out yet</h2>
        <p>Your cart is empty. Add something you like first.</p>
        <a class="btn btn-primary" href="products.html">Browse products</a></div>`;
      return;
    }

    const t = Cart.totals();
    root.innerHTML = `
    <div class="checkout-layout">
      <form id="checkout-form" class="form-card" novalidate>
        <h2>Delivery details</h2>
        <div class="form-grid">
          <div class="field full"><label for="name">Full name</label><input id="name" name="name" type="text" autocomplete="name" required /><span class="error"></span></div>
          <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required /><span class="error"></span></div>
          <div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit mobile number" required /><span class="error"></span></div>
          <div class="field full"><label for="address">Address</label><textarea id="address" name="address" rows="3" autocomplete="street-address" placeholder="House no., street, area" required></textarea><span class="error"></span></div>
          <div class="field"><label for="city">City</label><input id="city" name="city" type="text" autocomplete="address-level2" required /><span class="error"></span></div>
          <div class="field"><label for="state">State</label>
            <select id="state" name="state" required autocomplete="address-level1"><option value="">Select state</option>${STATES.map((s) => `<option>${s}</option>`).join("")}</select><span class="error"></span></div>
          <div class="field"><label for="pincode">Pincode</label><input id="pincode" name="pincode" type="text" inputmode="numeric" maxlength="6" autocomplete="postal-code" placeholder="6-digit pincode" required /><span class="error"></span></div>
        </div>
        <p class="note">Payment is on delivery (cash or UPI). No card details are collected on this demo site.</p>
        <button type="submit" class="btn btn-primary btn-lg btn-block">Place Order</button>
      </form>

      <aside class="summary">
        <h2>Order summary</h2>
        <ul class="mini-list">
          ${lines.map((l) => `<li>
            <img src="${l.product.image}" data-fallback="${l.product.imageBackup}" alt="" />
            <div><strong>${esc(l.product.name)}</strong><span>Qty ${l.qty} × ${money(l.product.price)}</span></div>
            <b>${money(l.lineTotal)}</b></li>`).join("")}
        </ul>
        <dl>
          <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>${t.shipping === 0 ? "Free" : money(t.shipping)}</dd></div>
          <div class="total"><dt>Total amount</dt><dd>${money(t.total)}</dd></div>
        </dl>
        <a class="back-link" href="cart.html">Edit cart</a>
      </aside>
    </div>`;

    const form = $("#checkout-form");

    const rules = {
      name: (v) => (v.length < 3 ? "Enter your full name (at least 3 characters)." : ""),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email, like name@example.com."),
      phone: (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a 10-digit mobile number starting with 6, 7, 8 or 9."),
      address: (v) => (v.length < 8 ? "Enter your full address (at least 8 characters)." : ""),
      city: (v) => (v.length < 2 ? "Enter your city." : ""),
      state: (v) => (v ? "" : "Select your state."),
      pincode: (v) => (/^[1-9]\d{5}$/.test(v) ? "" : "Enter a valid 6-digit pincode.")
    };

    function check(field) {
      const input = form.elements[field];
      const message = rules[field](input.value.trim());
      input.closest(".field").classList.toggle("invalid", Boolean(message));
      input.closest(".field").querySelector(".error").textContent = message;
      return !message;
    }

    // Only digits for phone and pincode
    ["phone", "pincode"].forEach((f) =>
      form.elements[f].addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")))
    );
    Object.keys(rules).forEach((f) => form.elements[f].addEventListener("blur", () => check(f)));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) {
        const firstBad = form.querySelector(".invalid input, .invalid textarea, .invalid select");
        if (firstBad) firstBad.focus();
        return;
      }

      const orderId = "SN" + Date.now().toString().slice(-8);
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const city = form.elements.city.value.trim();

      Cart.clear();
      root.innerHTML = `
      <div class="success-card" role="status">
        <div class="success-icon" aria-hidden="true">
          <svg viewBox="0 0 52 52" width="64" height="64"><circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="3"/><path d="M15 27l8 8 14-16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2>Order placed successfully</h2>
        <p>Thank you, <strong>${esc(name)}</strong>. We've sent a confirmation to <strong>${esc(email)}</strong>.</p>
        <dl class="success-meta">
          <div><dt>Order ID</dt><dd>${orderId}</dd></div>
          <div><dt>Total paid on delivery</dt><dd>${money(t.total)}</dd></div>
          <div><dt>Delivering to</dt><dd>${esc(city)}</dd></div>
        </dl>
        <a class="btn btn-primary btn-lg" href="products.html">Continue shopping</a>
        <a class="btn btn-outline btn-lg" href="index.html">Back to home</a>
      </div>`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Contact page ---------- */
  function initContact() {
    const form = $("#contact-form");
    const success = $("#contact-success");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll(".field").forEach((field) => {
        const input = field.querySelector("input, textarea");
        let message = "";
        const v = input.value.trim();
        if (!v) message = "This field is required.";
        else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) message = "Enter a valid email, like name@example.com.";
        else if (input.name === "message" && v.length < 10) message = "Write at least 10 characters so we can help.";
        field.classList.toggle("invalid", Boolean(message));
        field.querySelector(".error").textContent = message;
        if (message) ok = false;
      });
      if (!ok) return;

      $("#contact-name").textContent = form.elements.name.value.trim();
      form.reset();
      form.hidden = true;
      success.hidden = false;
    });

    $("#send-another").addEventListener("click", () => {
      success.hidden = true;
      form.hidden = false;
    });
  }

  /* ---------- Start ---------- */
  renderLayout();
  const inits = { home: initHome, products: initProducts, details: initDetails, cart: initCart, checkout: initCheckout, contact: initContact };
  if (inits[page]) inits[page]();

  // Keep the cart badge in sync if another tab changes the cart
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) updateBadge();
  });
})();
