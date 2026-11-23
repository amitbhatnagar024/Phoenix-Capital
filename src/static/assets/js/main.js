/* Phoenix Capital — site script. No dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, body = doc.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* Local preview: when opened from disk, point folder links at index.html */
  if (location.protocol === "file:") {
    $$("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      var parts = h.split("#");
      if (parts[0] === "" || /\/$/.test(parts[0]) || parts[0] === "." || parts[0] === "..") {
        parts[0] = (parts[0] === "" ? "" : parts[0].replace(/\/?$/, "/")) + (parts[0] === "" ? "" : "index.html");
        a.setAttribute("href", parts.join("#"));
      }
    });
  }

  /* Footer year */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Header: transparent → solid */
  var header = $(".site-header");
  var onScrollHeader = function () { if (header) header.classList.toggle("is-solid", window.scrollY > 40); };
  onScrollHeader();

  /* Parallax on hero media */
  var parallax = reduceMotion ? [] : $$("[data-parallax]");
  var ticking = false;
  var onScroll = function () {
    onScrollHeader();
    if (!parallax.length || ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      parallax.forEach(function (el) {
        if (y < window.innerHeight * 1.2) el.style.transform = "translate3d(0," + (y * parseFloat(el.dataset.parallax || 0.2)).toFixed(1) + "px,0)";
      });
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu with focus trap */
  var toggle = $(".menu-toggle"), menu = $("#mobile-menu");
  if (toggle && menu) {
    var lastFocus;
    var focusables = function () { return $$("a, button", menu).concat([toggle]); };
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      menu.inert = !open;
      body.classList.toggle("menu-open", open);
      if (open) { lastFocus = doc.activeElement; var f = $("a", menu); if (f) setTimeout(function () { f.focus(); }, 60); }
      else if (lastFocus) { lastFocus.focus(); }
    };
    menu.inert = true;
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    doc.addEventListener("keydown", function (e) {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab") {
        var f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1023 && menu.classList.contains("is-open")) setMenu(false); });
  }

  /* Embers */
  if (!reduceMotion) {
    $$(".embers").forEach(function (wrap) {
      var n = parseInt(wrap.dataset.embers || "14", 10);
      for (var i = 0; i < n; i++) {
        var e = doc.createElement("i");
        e.style.left = (45 + Math.random() * 55).toFixed(1) + "%";
        e.style.animationDuration = (9 + Math.random() * 10).toFixed(1) + "s";
        e.style.animationDelay = (-Math.random() * 18).toFixed(1) + "s";
        e.style.setProperty("--drift", (Math.random() * 80 - 40).toFixed(0) + "px");
        var s = (1 + Math.random() * 1.6).toFixed(1) + "px";
        e.style.width = s; e.style.height = s;
        wrap.appendChild(e);
      }
    });
  }

  /* Reveal on scroll + count-up */
  var countUp = function (el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var dec = (el.dataset.count.split(".")[1] || "").length;
    var pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    var t0 = null, dur = 1600;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * eased).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var revealEls = $$("[data-reveal], [data-count]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); if (el.hasAttribute("data-count")) countUp(el); });
  }

  /* Insights filters */
  var filterBar = $("[data-filters]");
  if (filterBar) {
    var cards = $$("[data-category]");
    var empty = $("[data-empty]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var f = btn.dataset.filter, shown = 0;
      $$("[data-filter]", filterBar).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      cards.forEach(function (c) { var on = f === "all" || c.dataset.category === f; c.hidden = !on; if (on) shown++; });
      if (empty) empty.hidden = shown > 0;
      var live = $("[data-filter-status]");
      if (live) live.textContent = shown + (shown === 1 ? " article" : " articles") + " shown";
    });
  }

  /* Forms ------------------------------------------------------------------ */
  var money = function (v) { var n = String(v).replace(/[^\d.]/g, ""); return n ? parseFloat(n) : NaN; };
  var fmt = function (n) { return isNaN(n) ? "" : Math.round(n).toLocaleString("en-GB"); };

  $$("form[data-validate]").forEach(function (form) {
    var errorBox = $(".form-errors", form);
    $$("[data-money]", form).forEach(function (inp) {
      inp.addEventListener("blur", function () { var n = money(inp.value); if (!isNaN(n)) inp.value = fmt(n); });
    });
    var loan = $("[name=loan_amount]", form), value = $("[name=property_value]", form), ltv = $("[data-ltv]", form);
    var updateLtv = function () {
      if (!ltv) return;
      var l = money(loan.value), v = money(value.value);
      ltv.textContent = (!isNaN(l) && !isNaN(v) && v > 0) ? (l / v * 100).toFixed(1) + "%" : "—";
    };
    if (loan && value) { loan.addEventListener("input", updateLtv); value.addEventListener("input", updateLtv); }

    var fieldOf = function (el) { return el.closest(".field"); };
    var messageFor = function (el) {
      if (el.validity.valueMissing) return el.dataset.required || "This field is required.";
      if (el.validity.typeMismatch && el.type === "email") return "Please enter a valid email address, for example name@company.co.uk.";
      if (el.validity.patternMismatch) return el.dataset.pattern || "Please check the format of this field.";
      return "";
    };
    var check = function (el) {
      var f = fieldOf(el); if (!f) return true;
      var group = el.type === "radio" ? $$("[name='" + el.name + "']", form) : [el];
      var valid = group.every(function (g) { return g.checkValidity(); });
      var err = $(".field__error", f);
      f.classList.toggle("is-invalid", !valid);
      group.forEach(function (g) { g.setAttribute("aria-invalid", String(!valid)); });
      if (err) err.textContent = valid ? "" : messageFor(group[0]);
      return valid;
    };
    $$("input, select, textarea", form).forEach(function (el) {
      el.addEventListener("blur", function () { if (fieldOf(el) && fieldOf(el).classList.contains("is-invalid")) check(el); });
      el.addEventListener("change", function () { if (fieldOf(el) && fieldOf(el).classList.contains("is-invalid")) check(el); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalid = [], seen = {};
      $$("input, select, textarea", form).forEach(function (el) {
        if (el.closest(".hp") || el.type === "hidden") return;
        if (el.type === "radio") { if (seen[el.name]) return; seen[el.name] = 1; }
        if (!check(el)) invalid.push(el);
      });
      if (invalid.length) {
        if (errorBox) {
          $("strong", errorBox).textContent = "Please check the following:";
          var list = $("ul", errorBox); list.innerHTML = "";
          invalid.forEach(function (el) {
            var f = fieldOf(el), lab = f && $("label, .label, legend", f);
            var li = doc.createElement("li"), a = doc.createElement("a");
            a.href = "#" + el.id; a.textContent = (lab ? lab.textContent.replace("*", "").trim() : el.name) + ": " + messageFor(el);
            a.addEventListener("click", function (ev) { ev.preventDefault(); el.focus(); });
            li.appendChild(a); list.appendChild(li);
          });
          errorBox.hidden = false; errorBox.focus();
        } else { invalid[0].focus(); }
        return;
      }
      if (errorBox) errorBox.hidden = true;
      if ($(".hp input", form) && $(".hp input", form).value) return; // spam trap
      if (root.dataset.preview === "1") { // preview copy: never submit
        if (errorBox) { $("strong", errorBox).textContent = "Preview only"; $("ul", errorBox).innerHTML = "<li>This is a preview of the website, so the form is switched off and nothing has been sent.</li>"; errorBox.hidden = false; errorBox.focus(); }
        return;
      }
      var btn = $("[type=submit]", form), label = btn.innerHTML;
      btn.disabled = true; btn.textContent = "Sending…";
      var done = function (ok) {
        if (ok) {
          var success = doc.getElementById(form.dataset.success);
          form.hidden = true;
          if (success) { success.hidden = false; success.setAttribute("tabindex", "-1"); success.focus(); }
        } else {
          btn.disabled = false; btn.innerHTML = label;
          if (errorBox) { $("ul", errorBox).innerHTML = "<li>We could not send your enquiry just now. Please try again, or email us directly.</li>"; errorBox.hidden = false; errorBox.focus(); }
        }
      };
      var endpoint = form.getAttribute("action");
      if (!endpoint || endpoint === "#") { setTimeout(function () { done(true); }, 700); return; } // demo mode until a form endpoint is configured
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { done(r.ok); }).catch(function () { done(false); });
    });
  });

  /* Cookie consent (UK GDPR / PECR) ----------------------------------------- */
  var KEY = "pc_consent", VERSION = 1, MAX_AGE = 60 * 60 * 24 * 180; // 6 months
  var readConsent = function () {
    var m = doc.cookie.match(new RegExp("(?:^|; )" + KEY + "=([^;]*)"));
    var raw = m ? decodeURIComponent(m[1]) : null;
    // Pages opened straight from disk (file://) can't keep cookies, so fall back to local storage there.
    if (!raw && location.protocol === "file:") { try { raw = localStorage.getItem(KEY); } catch (e) {} }
    if (!raw) return null;
    try { var c = JSON.parse(raw); return c.v === VERSION ? c : null; } catch (e) { return null; }
  };
  var listeners = [];
  var activate = function (c) {
    $$("script[type='text/plain'][data-consent]").forEach(function (s) {
      if (!c[s.dataset.consent] || s.dataset.done) return;
      var n = doc.createElement("script");
      Array.prototype.forEach.call(s.attributes, function (a) { if (a.name !== "type" && a.name !== "data-consent") n.setAttribute(a.name, a.value); });
      n.text = s.text; s.dataset.done = "1"; s.parentNode.insertBefore(n, s.nextSibling);
    });
    listeners.forEach(function (fn) { try { fn(c); } catch (e) {} });
  };
  var writeConsent = function (analytics, marketing) {
    var c = { v: VERSION, necessary: true, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() };
    var secure = location.protocol === "https:" ? "; Secure" : "";
    doc.cookie = KEY + "=" + encodeURIComponent(JSON.stringify(c)) + "; Max-Age=" + MAX_AGE + "; Path=/; SameSite=Lax" + secure;
    if (location.protocol === "file:") { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
    current = c; hideBanner(); closePrefs(); activate(c);
  };
  var current = readConsent();
  var banner = $("#cookie-banner"), prefs = $("#cookie-prefs");
  var showBanner = function () { if (banner) { banner.hidden = false; requestAnimationFrame(function () { banner.classList.add("is-visible"); }); } };
  var hideBanner = function () { if (banner) { banner.classList.remove("is-visible"); setTimeout(function () { banner.hidden = true; }, 600); } };
  var prefsReturn;
  var openPrefs = function () {
    if (!prefs) return;
    prefsReturn = doc.activeElement;
    $("#pref-analytics").checked = !!(current && current.analytics);
    $("#pref-marketing").checked = !!(current && current.marketing);
    prefs.hidden = false; prefs.inert = false;
    requestAnimationFrame(function () { prefs.classList.add("is-open"); });
    body.classList.add("modal-open");
    setTimeout(function () { $(".modal__panel", prefs).focus(); }, 50);
  };
  var closePrefs = function () {
    if (!prefs || prefs.hidden) return;
    prefs.classList.remove("is-open"); body.classList.remove("modal-open");
    setTimeout(function () { prefs.hidden = true; }, 400);
    if (prefsReturn && prefsReturn.focus) prefsReturn.focus();
  };
  doc.addEventListener("click", function (e) {
    var t = e.target.closest("[data-consent-action]");
    if (!t) return;
    var a = t.dataset.consentAction;
    if (a === "accept") writeConsent(true, true);
    else if (a === "reject") writeConsent(false, false);
    else if (a === "manage") openPrefs();
    else if (a === "save") writeConsent($("#pref-analytics").checked, $("#pref-marketing").checked);
    else if (a === "close") closePrefs();
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && prefs && !prefs.hidden) closePrefs();
    if (e.key === "Tab" && prefs && !prefs.hidden) {
      var f = $$("button, input, a", prefs).filter(function (x) { return !x.disabled; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  if (current) activate(current); else showBanner();

  /* Public API for any future analytics integration */
  window.phoenixConsent = {
    get: function () { return current; },
    open: openPrefs,
    onChange: function (fn) { listeners.push(fn); if (current) fn(current); }
  };

  /* Map: loads only on request (third-party content) */
  $$("[data-map-load]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".map-embed");
      var f = doc.createElement("iframe");
      f.src = wrap.dataset.src; f.title = wrap.dataset.title || "Map"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      wrap.innerHTML = ""; wrap.appendChild(f);
    });
  });
})();
