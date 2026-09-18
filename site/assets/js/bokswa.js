/* ==========================================================================
   BOKSWA INVESTMENTS (U) LIMITED — behaviour layer
   --------------------------------------------------------------------------
   ARCHITECTURE RULE (carried into the Elementor build):
   This file contains NO CONTENT. Not one headline, label, caption, spec value
   or product name lives here. Every module finds its elements by semantic
   class or data-attribute and animates whatever the markup happens to hold.
   Adding a seventh product, a new film chapter or a new gallery category is
   a markup change only — nothing here needs editing.

   In Elementor each showpiece becomes a hidden HTML widget holding only this
   script's markup hooks; the visible text stays in native widgets on top.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     CONTACT CONFIG — the only place these values are stored in JS.
     Links in the HTML carry real hrefs too, so the site works without JS.
     Used here purely to compose the quote message.
     --------------------------------------------------------------------- */
  var BOKSWA = window.BOKSWA = {
    whatsapp: "256758381708",
    tel: "+256758381708",
    tel2: "+256393002926",
    email: "info@bokswa.co.ug"
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* Lightweight mode: reduced-motion, small screens, or low core count.
     Film section degrades to a plain stacked sequence via html.bk-lite. */
  var lite = reduced || window.innerWidth < 861 ||
             (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  if (lite) document.documentElement.classList.add("bk-lite");
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* =====================================================================
     1. PRELOADER  [showpiece]
     Plays the logo-reveal video from markup once per browser session, then
     lifts at data-exit-at seconds. Falls back to building the logo's brick
     grid if the video is missing, blocked or stalls. Visitors who have
     already seen it this session skip straight to the page. Skippable by
     the button or a click anywhere on the intro.
     ===================================================================== */
  function preloader() {
    var el = $(".bk-preload");
    if (!el) return Promise.resolve();
    var tiles = $$("i", el);
    var bar = $(".bk-preload__bar b", el);
    var pct = $("[data-preload-pct]", el);
    var vid = $(".bk-preload__video", el);
    var skip = $(".bk-preload__skip", el);
    var KEY = "bk-intro-seen";
    var seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* storage blocked */ }

    return new Promise(function (resolve) {
      var finished = false, started = false;
      var finish = function () {
        if (finished) return;
        finished = true;
        if (el.parentNode) el.remove();
        resolve();
      };
      var done = function () {
        if (started) return;
        started = true;
        el.classList.add("is-done");
        if (hasGSAP && !reduced) {
          gsap.to(el, { yPercent: -100, duration: .9, ease: "power4.inOut", onComplete: finish });
          /* The exit animation needs animation frames, which browsers pause in
             background tabs. This timer does not, so the loader can never
             trap the page behind it. */
          setTimeout(finish, 1400);
        } else { finish(); }
      };
      /* Returning visitors and reduced-motion users go straight to the page. */
      if (reduced || seen) { finish(); return; }

      var setProgress = function (f) {
        var p = Math.max(0, Math.min(100, Math.round(f * 100)));
        if (bar) bar.style.width = p + "%";
        if (pct) pct.textContent = String(p).padStart(3, "0");
      };

      var gridStarted = false;
      var buildGrid = function () {
        if (gridStarted || started) return;
        gridStarted = true;
        el.classList.remove("is-video");
        if (vid) { try { vid.pause(); } catch (e) {} }
        var n = 0, total = tiles.length;
        if (!total) { done(); return; }
        tiles.forEach(function (t, i) {
          setTimeout(function () {
            t.style.transition = "opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1)";
            t.style.opacity = 1; t.style.transform = "scale(1)";
            n++;
            setProgress(n / total);
            if (n === total) setTimeout(done, 340);
          }, 90 + i * 85);
        });
      };

      if (skip) skip.addEventListener("click", function (e) { e.stopPropagation(); done(); });
      el.addEventListener("click", function () { if (el.classList.contains("is-video")) done(); });

      if (vid && vid.getAttribute("src")) {
        el.classList.add("is-video");
        var exitAt = parseFloat(el.getAttribute("data-exit-at")) || 0;
        vid.preload = "auto";
        vid.addEventListener("playing", function () {
          try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        });
        vid.addEventListener("timeupdate", function () {
          var end = exitAt || vid.duration || 4;
          setProgress(vid.currentTime / end);
          if (exitAt && vid.currentTime >= exitAt) done();
        });
        vid.addEventListener("ended", done);
        vid.addEventListener("error", buildGrid);
        var attempt = vid.play();
        if (attempt && attempt.catch) attempt.catch(buildGrid);   // autoplay blocked
        /* Nothing moving after 2s (slow network, low-power mode): fall back. */
        setTimeout(function () { if (!started && vid.currentTime < 0.05) buildGrid(); }, 2000);
      } else {
        buildGrid();
      }

      setTimeout(done, 7000); // hard cap — the loader can never outstay this
    });
  }

  /* =====================================================================
     2. HEADER — scroll state, mobile menu
     ===================================================================== */
  function header() {
    var hd = $(".bk-header");
    var burger = $(".bk-burger");
    var mob = $(".bk-mobnav");
    if (hd) {
      var onScroll = function () { hd.classList.toggle("is-stuck", window.scrollY > 40); };
      onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    }
    if (burger && mob) {
      var toggle = function (open) {
        burger.classList.toggle("is-open", open);
        mob.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.documentElement.classList.toggle("bk-lock", open);
        if (lenis) { if (open) lenis.stop(); else lenis.start(); }
      };
      burger.addEventListener("click", function () { toggle(!mob.classList.contains("is-open")); });
      $$("a", mob).forEach(function (a) { a.addEventListener("click", function () { toggle(false); }); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mob.classList.contains("is-open")) toggle(false);
      });
    }
  }

  /* =====================================================================
     3. SCROLL REVEALS — adds .is-in, CSS does the rest
     ===================================================================== */
  function reveals() {
    /* gallery tiles stagger across each row of three */
    $$(".bk-gal").forEach(function (g) {
      $$(".bk-gal__item", g).forEach(function (it, i) { it.style.setProperty("--bk-d", ((i % 3) * 0.09).toFixed(2) + "s"); });
    });
    var items = $$(".bk-reveal, .bk-mask, .bk-gal__item");
    if (!("IntersectionObserver" in window) || reduced) {
      items.forEach(function (i) { i.classList.add("is-in"); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }

  /* =====================================================================
     4. HERO  [SHOWPIECE 1]
     Animates whatever lines exist inside .bk-hero__headline.
     ===================================================================== */
  function hero() {
    var h = $(".bk-hero");
    if (!h) return;
    var lines = $$(".bk-hero__headline .bk-line > span", h);
    var rest = $$("[data-hero-in]", h);
    var media = $(".bk-hero__media video, .bk-hero__media img", h);

    /* The hero video carries no autoplay/preload in the markup, so phones and
       reduced-motion visitors download the poster only (~120KB instead of 4.5MB).
       Capable devices opt in here. */
    var vid = $("video[data-hero-video]", h);
    if (vid && !lite) {
      vid.preload = "auto";
      vid.setAttribute("autoplay", "");
      var playing = vid.play();
      if (playing && playing.catch) playing.catch(function () { /* poster stays */ });
    }

    if (!hasGSAP || reduced) {
      lines.forEach(function (l) { l.style.transform = "none"; l.style.opacity = 1; });
      rest.forEach(function (r) { r.style.opacity = 1; r.style.transform = "none"; });
      return;
    }
    gsap.set(lines, { yPercent: 118 });
    gsap.set(rest, { y: 24, opacity: 0 });

    var tl = gsap.timeline({ delay: .12 });
    tl.to(lines, { yPercent: 0, duration: 1.15, ease: "power4.out", stagger: .085 })
      .to(rest, { y: 0, opacity: 1, duration: .8, ease: "power3.out", stagger: .07 }, "-=0.62");
    if (media) tl.fromTo(media, { scale: 1.16 }, { scale: 1, duration: 2.1, ease: "power2.out" }, 0);

    /* scroll: camera pushes in, content drifts up */
    if (!lite && window.ScrollTrigger) {
      gsap.to(media, {
        scale: 1.14, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true }
      });
      gsap.to($(".bk-hero__in", h), {
        yPercent: -14, opacity: .25, ease: "none",
        scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true }
      });
    }
  }

  /* =====================================================================
     5. THE FILM  [SHOWPIECE 2] — PRODUCT → APPLICATION → RESULT
     Reads every .film-frame in DOM order and turns the section into a
     scroll-driven camera. Chapters/frames/captions all come from markup.
     ===================================================================== */
  function film() {
    var sec = $(".bk-film");
    if (!sec) return;
    var stage = $(".bk-film__stage", sec);
    var frames = $$(".film-frame", sec);
    var hudSteps = $$(".bk-film__step", sec);
    var bar = $(".bk-film__bar b", sec);
    if (!frames.length) return;

    $$(".film-chapter", sec).forEach(function (c) { c.classList.add("is-live"); });

    if (lite || !hasGSAP || !window.ScrollTrigger) {
      frames.forEach(function (f) { f.style.opacity = 1; });
      return;
    }

    var FADE = .72; // point within a frame where the next begins to rise

    var apply = function (progress) {
      var p = progress * (frames.length - 0.0001);
      var i = Math.floor(p);
      var f = p - i;

      frames.forEach(function (fr, k) {
        var o = 0;
        if (k < i) o = 0;
        else if (k === i) o = 1;
        else if (k === i + 1) o = f > FADE ? (f - FADE) / (1 - FADE) : 0;
        fr.style.opacity = o;
        fr.style.visibility = o > 0 ? "visible" : "hidden";

        var img = fr.querySelector(".film-frame__img");
        var cap = fr.querySelector(".film-caption");
        if (k === i && img) img.style.transform = "scale(" + (1.14 - .14 * f).toFixed(4) + ")";
        if (k === i + 1 && img) img.style.transform = "scale(1.14)";
        if (k === i && cap) {
          var ease = Math.min(1, f / .18);
          var out = f > .86 ? (f - .86) / .14 : 0;
          cap.style.opacity = (ease * (1 - out)).toFixed(3);
          cap.style.transform = "translateY(" + ((1 - ease) * 26 - out * 22).toFixed(2) + "px)";
        }
      });

      var stageName = frames[i] ? frames[i].getAttribute("data-stage") : null;
      hudSteps.forEach(function (s) {
        s.classList.toggle("is-on", s.getAttribute("data-stage") === stageName);
      });
      if (bar) bar.style.width = (progress * 100).toFixed(2) + "%";
    };

    ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "+=" + (frames.length * 88) + "%",
      pin: stage,
      pinSpacing: true,
      scrub: .65,
      onUpdate: function (self) { apply(self.progress); },
      onRefresh: function (self) { apply(self.progress); }
    });
    apply(0);
  }

  /* =====================================================================
     6. PRODUCT EXPLORER  [SHOWPIECE 3]
     Pairs every .explorer-item with the .explorer-panel whose id matches
     its data-target. Add a new pair in markup and it just works.
     ===================================================================== */
  function explorer() {
    $$(".bk-explorer").forEach(function (root) {
      var items = $$(".explorer-item", root);
      var panels = $$(".explorer-panel", root);
      if (!items.length || !panels.length) return;

      var show = function (id, focus) {
        items.forEach(function (it) {
          var on = it.getAttribute("data-target") === id;
          it.classList.toggle("is-active", on);
          it.setAttribute("aria-selected", on ? "true" : "false");
          it.setAttribute("tabindex", on ? "0" : "-1");
          if (on && focus) it.focus();
        });
        panels.forEach(function (p) {
          var on = p.id === id;
          p.classList.toggle("is-active", on);
          p.hidden = !on;
          if (on && hasGSAP && !reduced) {
            gsap.fromTo(p.querySelectorAll("[data-panel-in]"),
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: .55, ease: "power3.out", stagger: .05 });
            var im = p.querySelector(".explorer-panel__media img");
            if (im) gsap.fromTo(im, { scale: 1.1 }, { scale: 1, duration: 1.1, ease: "power3.out" });
          }
        });
      };

      items.forEach(function (it, idx) {
        it.addEventListener("click", function () { show(it.getAttribute("data-target")); });
        it.addEventListener("keydown", function (e) {
          var n = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") n = items[(idx + 1) % items.length];
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = items[(idx - 1 + items.length) % items.length];
          if (n) { e.preventDefault(); show(n.getAttribute("data-target"), true); }
        });
      });

      var start = root.getAttribute("data-start") || items[0].getAttribute("data-target");
      show(start);
    });
  }

  /* =====================================================================
     7. ACCORDION  →  mirrors the Elementor Accordion widget
     ===================================================================== */
  function accordions() {
    $$(".bk-acc").forEach(function (acc) {
      var items = $$(".bk-acc__item", acc);
      items.forEach(function (item) {
        var head = $(".bk-acc__head", item);
        var panel = $(".bk-acc__panel", item);
        if (!head || !panel) return;
        head.addEventListener("click", function () {
          var open = item.classList.contains("is-open");
          if (!acc.hasAttribute("data-multi")) {
            items.forEach(function (o) {
              o.classList.remove("is-open");
              var p = $(".bk-acc__panel", o); if (p) p.style.height = "0px";
              var h = $(".bk-acc__head", o); if (h) h.setAttribute("aria-expanded", "false");
            });
          }
          if (!open) {
            item.classList.add("is-open");
            panel.style.height = panel.firstElementChild.offsetHeight + "px";
            head.setAttribute("aria-expanded", "true");
          } else {
            item.classList.remove("is-open");
            panel.style.height = "0px";
            head.setAttribute("aria-expanded", "false");
          }
        });
      });
      window.addEventListener("resize", function () {
        $$(".bk-acc__item.is-open", acc).forEach(function (o) {
          var p = $(".bk-acc__panel", o);
          if (p) p.style.height = p.firstElementChild.offsetHeight + "px";
        });
      });
    });
  }

  /* =====================================================================
     8. GALLERY FILTER — categories come from data-cat in the markup
     ===================================================================== */
  function gallery() {
    $$("[data-gallery]").forEach(function (root) {
      var btns = $$(".bk-filter button", root);
      var items = $$(".bk-gal__item", root);
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          var f = b.getAttribute("data-filter");
          btns.forEach(function (x) { x.classList.toggle("is-active", x === b); });
          items.forEach(function (it) {
            var show = f === "all" || (it.getAttribute("data-cat") || "").split(" ").indexOf(f) > -1;
            it.classList.toggle("is-hidden", !show);
          });
          if (window.ScrollTrigger) ScrollTrigger.refresh();
        });
      });
    });
  }

  /* =====================================================================
     9. QUOTE FLOW — composes a WhatsApp message and a mailto fallback
     from whatever fields exist in the form. Static-site safe.
     ===================================================================== */
  function quote() {
    var form = $("[data-quote-form]");
    if (!form) return;

    /* pre-select the product when arriving from a product page */
    var param = new URLSearchParams(location.search).get("product");
    var sel = form.querySelector('[name="product"]');
    if (param && sel) {
      Array.prototype.forEach.call(sel.options, function (o) {
        if (o.value.toLowerCase() === param.toLowerCase()) sel.value = o.value;
      });
    }

    var compose = function () {
      var lines = ["*BOKSWA — QUOTE REQUEST*", ""];
      $$("[name]", form).forEach(function (f) {
        if (!f.value || !f.value.trim()) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        lines.push((lab ? lab.textContent.trim() : f.name) + ": " + f.value.trim());
      });
      return lines.join("\n");
    };

    var validate = function () {
      var ok = true;
      $$("[required]", form).forEach(function (f) {
        var wrap = f.closest(".bk-field");
        var bad = !f.value.trim();
        if (wrap) wrap.classList.toggle("has-err", bad);
        if (bad && ok) { f.focus(); ok = false; }
      });
      return ok;
    };

    $$("[required]", form).forEach(function (f) {
      f.addEventListener("input", function () {
        var w = f.closest(".bk-field");
        if (w && f.value.trim()) w.classList.remove("has-err");
      });
    });

    var wa = form.querySelector("[data-quote-wa]");
    var em = form.querySelector("[data-quote-email]");
    if (wa) wa.addEventListener("click", function (e) {
      e.preventDefault();
      if (!validate()) return;
      window.open("https://wa.me/" + BOKSWA.whatsapp + "?text=" + encodeURIComponent(compose()), "_blank", "noopener");
    });
    if (em) em.addEventListener("click", function (e) {
      e.preventDefault();
      if (!validate()) return;
      location.href = "mailto:" + BOKSWA.email +
        "?subject=" + encodeURIComponent("Quote request — BOKSWA") +
        "&body=" + encodeURIComponent(compose().replace(/\*/g, ""));
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); if (wa) wa.click(); });
  }

  /* =====================================================================
     10. MARQUEE — duplicates its own track so the loop is seamless
     ===================================================================== */
  function marquee() {
    $$(".bk-marq__track").forEach(function (t) {
      if (reduced) { t.style.animation = "none"; return; }
      t.innerHTML = t.innerHTML + t.innerHTML;
    });
  }

  /* =====================================================================
     11. ANCHOR SCROLLING — offsets for the fixed header
     ===================================================================== */
  function anchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a) return;
      var href = a.getAttribute("href");
      var hash = href.indexOf("#") === 0 ? href : (href.split("#")[1] ? "#" + href.split("#")[1] : null);
      if (!hash || hash === "#") return;
      var samePage = href.indexOf("#") === 0 ||
        href.split("#")[0] === "" ||
        href.split("#")[0] === location.pathname.split("/").pop();
      if (!samePage) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--bk-nav-h")) || 78;
      if (lenis) { lenis.scrollTo(target, { offset: -navH }); }
      else {
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
      }
      history.replaceState(null, "", hash);
    });
  }

  /* =====================================================================
     12. YEAR STAMP
     ===================================================================== */
  function year() {
    $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
  }

  /* =====================================================================
     13. SMOOTH SCROLL — Lenis, desktop only, driven by GSAP's ticker so the
     pinned film and every ScrollTrigger stay in exact sync with it.
     ===================================================================== */
  var lenis = null;
  function smooth() {
    if (lite || !window.Lenis) return;
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    window.BOKSWA.lenis = lenis;
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* =====================================================================
     14. HERO ROTATING WORD — cycles every .bk-rotator__word in markup,
     rolling letters out and in. Add or remove a word in the HTML and the
     cycle follows. Pauses whenever the hero is off screen.
     ===================================================================== */
  function rotator() {
    $$("[data-rotator]").forEach(function (r) {
      var words = $$(".bk-rotator__word", r);
      if (words.length < 2 || reduced || !hasGSAP) return;

      words.forEach(function (w) {
        var txt = w.textContent;
        w.textContent = "";
        txt.split("").forEach(function (c) {
          var s = document.createElement("span");
          s.className = "ch";
          s.textContent = c === " " ? " " : c;
          w.appendChild(s);
        });
      });

      var i = Math.max(0, words.findIndex(function (w) { return w.classList.contains("is-active"); }));
      var visible = true, busy = false;
      var interval = parseInt(r.getAttribute("data-interval"), 10) || 2600;

      var step = function () {
        if (!visible || busy) return;
        busy = true;
        var out = words[i];
        i = (i + 1) % words.length;
        var inc = words[i];
        out.classList.add("is-leaving");
        out.classList.remove("is-active");
        inc.classList.add("is-active");
        /* the rotating line's first letter just changed — re-align it */
        var line = r.closest(".bk-line > span");
        if (line) opticalAlign(line);
        gsap.to(out.querySelectorAll(".ch"), {
          yPercent: -110, duration: .5, ease: "power3.in", stagger: .025,
          onComplete: function () { out.classList.remove("is-leaving"); gsap.set(out.querySelectorAll(".ch"), { yPercent: 0 }); }
        });
        gsap.fromTo(inc.querySelectorAll(".ch"), { yPercent: 110 },
          { yPercent: 0, duration: .62, ease: "power3.out", stagger: .03, delay: .22,
            onComplete: function () { busy = false; } });
      };

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(r);
      }
      setTimeout(function () { setInterval(step, interval); }, 1800);
    });
  }

  /* =====================================================================
     15. MANIFESTO — wraps each word of [data-reveal-words] in a span by
     walking its text nodes (so any inline highlight markup survives) and
     brightens the words as the paragraph scrolls through the viewport.
     ===================================================================== */
  function manifesto() {
    $$("[data-reveal-words]").forEach(function (el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        if (!n.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        n.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      });
      var ws = $$(".w", el);
      if (reduced || !hasGSAP || !window.ScrollTrigger) { ws.forEach(function (w) { w.style.opacity = 1; }); return; }
      gsap.to(ws, {
        opacity: 1, ease: "none", stagger: .12,
        scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 42%", scrub: .6 }
      });
    });
  }

  /* =====================================================================
     16. HOVER INDEX — pairs .bk-index__item[data-target] with
     .bk-index__img[data-for]. Hover or keyboard focus swaps the preview.
     ===================================================================== */
  function hoverIndex() {
    $$("[data-index]").forEach(function (root) {
      var items = $$(".bk-index__item", root);
      var imgs = $$(".bk-index__img", root);
      var cap = $(".bk-index__cap", root);
      if (!items.length) return;
      var show = function (id) {
        items.forEach(function (it) { it.classList.toggle("is-active", it.getAttribute("data-target") === id); });
        imgs.forEach(function (im) { im.classList.toggle("is-active", im.getAttribute("data-for") === id); });
        var active = items.filter(function (it) { return it.getAttribute("data-target") === id; })[0];
        if (cap && active) cap.textContent = active.getAttribute("data-caption") || "";
      };
      items.forEach(function (it) {
        var id = it.getAttribute("data-target");
        it.addEventListener("mouseenter", function () { show(id); });
        it.addEventListener("focus", function () { show(id); });
      });
      show(items[0].getAttribute("data-target"));
    });
  }

  /* =====================================================================
     17. SCATTER — each .bk-scatter__img drifts at its own data-depth and
     turns slightly as the section passes. Base rotation comes from --r.
     ===================================================================== */
  function scatter() {
    $$(".bk-scatter").forEach(function (sec) {
      if (lite || reduced || !hasGSAP || !window.ScrollTrigger) return;
      $$(".bk-scatter__img", sec).forEach(function (im) {
        var d = parseFloat(im.getAttribute("data-depth")) || .3;
        var r = parseFloat(getComputedStyle(im).getPropertyValue("--r")) || 0;
        gsap.fromTo(im,
          { y: 170 * d, rotation: r - 6 * d },
          { y: -170 * d, rotation: r + 6 * d, ease: "none",
            scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
  }

  /* =====================================================================
     18. FOOTER WORDMARK — sizes whatever text sits in .bk-footer__mark to
     exactly fill its container, then rises in letter by letter.
     ===================================================================== */
  function footerMark() {
    $$(".bk-footer__mark").forEach(function (m) {
      var inner = m.querySelector("span") || m;
      var fit = function () {
        m.style.fontSize = "100px";
        var w = inner.getBoundingClientRect().width;
        if (w) m.style.fontSize = (100 * m.clientWidth / w * 0.995) + "px";
      };
      fit();
      window.addEventListener("resize", fit);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
      if (reduced || !hasGSAP || !window.ScrollTrigger) return;
      gsap.from(m, {
        yPercent: 40, opacity: 0, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: m, start: "top 95%" }
      });
    });
  }

  /* =====================================================================
     19. IMAGE PARALLAX — large masked photographs drift a few pixels
     against the scroll. Uses the CSS `translate` property so it never
     fights the `scale` settle transition in the stylesheet. Desktop only.
     ===================================================================== */
  function imageParallax() {
    if (lite || reduced || !hasGSAP || !window.ScrollTrigger) return;
    $$(".bk-figure.bk-mask > img, .bk-leader__portrait > img").forEach(function (img) {
      var fig = img.parentElement;
      ScrollTrigger.create({
        trigger: fig, start: "top bottom", end: "bottom top",
        onUpdate: function (self) {
          var shift = fig.offsetHeight * 0.028;
          img.style.translate = "0 " + ((0.5 - self.progress) * 2 * shift).toFixed(1) + "px";
        }
      });
    });
  }

  /* =====================================================================
     20. OPTICAL ALIGNMENT — large capitals carry built-in left space (about
     5.5% of the font size in Archivo, 0% on "W", up to 7% on others), so a
     64–176px headline visibly sits right of the text below it. This measures
     each headline's actual first letter and offsets it by exactly that much.
     Reads whatever text is in the markup; re-runs on resize and font load.
     ===================================================================== */
  var opticalAlign = function () {};
  function setupOpticalAlign() {
    var SEL = ".bk-h1, .bk-h2, .bk-hero__headline .bk-line > span, .film-title, .bk-manifesto__text, .bk-leader__principle p";
    var ctx = document.createElement("canvas").getContext("2d");
    if (!ctx || !("actualBoundingBoxLeft" in ctx.measureText("A"))) return;
    opticalAlign = function (only) {
      (only ? [only] : $$(SEL)).forEach(function (el) {
        var cs = getComputedStyle(el);
        if (cs.textAlign === "center" || el.closest(".bk-center, .bk-scatter__copy")) { el.style.marginLeft = ""; return; }
        var src = el.querySelector(".bk-rotator__word.is-active") || el;   // only the visible word counts
        var ch = (src.textContent || "").replace(/^[\s ]+/, "").charAt(0);
        if (!ch) return;
        if (cs.textTransform === "uppercase") ch = ch.toUpperCase();
        ctx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
        var lsb = -ctx.measureText(ch).actualBoundingBoxLeft;
        el.style.marginLeft = lsb > 0.5 ? (-lsb).toFixed(2) + "px" : "";
      });
    };
    window.BOKSWA.opticalAlign = opticalAlign;
    opticalAlign();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { opticalAlign(); });
    var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(opticalAlign, 150); });
  }

  /* =====================================================================
     BOOT
     ===================================================================== */
  function boot() {
    smooth();
    header(); reveals(); explorer(); accordions(); gallery();
    quote(); marquee(); anchors(); year();
    hoverIndex(); setupOpticalAlign();
    preloader().then(function () {
      /* Scroll effects are created in page order, AFTER the film's pin
         exists: a pin inserts ~10,000px of scroll space, and any trigger
         measured before it would sit at a stale position. */
      hero(); manifesto(); film(); rotator();
      scatter(); footerMark(); imageParallax();
      var remeasure = function () {
        if (lenis) lenis.resize();          // Lenis caches the page height too
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      };
      remeasure();
      setTimeout(remeasure, 240);
      window.addEventListener("load", remeasure);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
