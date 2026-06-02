/* ============================================================
   Johnnie Kenneybrew — site behavior · v2
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ICON = {
    imgs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M21 7v12a2 2 0 0 1-2 2H7"/></svg>'
  };

  /* ============================================================
     HERO — cursor light + aurora parallax
     ============================================================ */
  const hero = document.querySelector(".hero");
  const aurora = document.querySelector(".aurora");
  if (hero && !reduce) {
    let raf = null, tx = 50, ty = 40;
    hero.addEventListener("pointermove", function (e) {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        hero.style.setProperty("--mx", tx + "%");
        hero.style.setProperty("--my", ty + "%");
        if (aurora) {
          const dx = (tx - 50) / 50, dy = (ty - 50) / 50;
          aurora.style.transform = "translate(" + (dx * 18) + "px," + (dy * 18) + "px)";
        }
        raf = null;
      });
    });
  }

  /* ============================================================
     HERO ART — cursor light over the desk image
     ============================================================ */
  const deck = document.getElementById("hero-deck");
  if (deck) {
    deck.addEventListener("pointermove", function (e) {
      const r = deck.getBoundingClientRect();
      deck.style.setProperty("--dx", ((e.clientX - r.left) / r.width * 100) + "%");
      deck.style.setProperty("--dy", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  }

  /* pin the desk + scroll prompt until the story section scrolls up to meet them */
  const pin = document.getElementById("hero-pin");
  const deskPill = document.getElementById("desk-pill");
  const pinRelease = document.querySelector(".timeline-section");
  if (pin && pinRelease) {
    const updatePin = function () {
      const t = pinRelease.getBoundingClientRect().top;
      const vh = window.innerHeight;
      let p = t / (vh * 0.55);
      p = Math.max(0, Math.min(1, p));
      const vis = p <= 0.02 ? "hidden" : "visible";
      pin.style.opacity = p;
      pin.style.transform = "translateY(" + ((1 - p) * -30) + "px)";
      pin.style.visibility = vis;
      if (deskPill) {
        deskPill.style.opacity = p;
        deskPill.style.visibility = vis;
      }
    };
    window.addEventListener("scroll", updatePin, { passive: true });
    window.addEventListener("resize", updatePin);
    updatePin();
  }

  /* ============================================================
     LIVE ZARAGOZA CLOCK
     ============================================================ */
  const clockEl = document.getElementById("clock-time");
  if (clockEl) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Madrid", hour: "numeric", minute: "2-digit", hour12: true
    });
    const tick = function () { clockEl.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  /* ============================================================
     CARD DATA
     ============================================================ */
  const CARDS = [
    {
      cat: "work", emoji: "⚡", feature: true,
      title: "Post-Sales Sidebar Extension",
      desc: "A Chrome extension that operates in your browser sidebar and Gmail inbox to instantly surface account insights, user impersonation health scores, and more. This tool was built to empower our implementation support and growth teams to access customer data seamlessly without the need for engineering intervention.",
      metrics: ["Chrome Extension"],
      images: [
        { src: "assets/findem-extension.gif",                  cap: "The sidebar in action — browsing recently signed customers." },
        { src: "screenshots/findem-sidebar/overview.png",       cap: "Account overview at a glance." },
        { src: "screenshots/findem-sidebar/cover.png",          cap: "The sidebar, docked in-app." },
        { src: "screenshots/findem-sidebar/implementation.png", cap: "Under the hood — implementation." }
      ]
    },
    {
      cat: "work", emoji: "🧠",
      title: "Customer Insights MCP",
      desc: "Pulls every customer touchpoint — Shopify, product reviews, warehouse data, in-app behavior — into a single queryable “second brain.” Natural-language queries for the whole team.",
      metrics: ["Custom MCP Build"],
      images: []
    },
    {
      cat: "work", emoji: "📊",
      title: "Subscriber Reviews Dashboard",
      desc: "Syncs review and ticketing data to surface trends at scale, flagging at-risk customers before a poor experience goes unaddressed.",
      metrics: [],
      images: [
        { src: "screenshots/reviews-dashboard/jones-reviews.png", cap: "Jones Reviews — review intelligence: tags, sentiment, and customers that need attention." }
      ]
    },
    {
      cat: "work", emoji: "🤖",
      title: "Favorite Agents",
      sections: [
        {
          emoji: "☀️",
          title: "Briefing Agent",
          desc: "Scans my calendar each morning, pulls recaps of past calls and emails, then drafts agendas so I show up to every meeting fully prepared.",
          metrics: ["Daily", "Calendar + Email", "Agentic"]
        },
        {
          emoji: "🎯",
          title: "Coaching Agent",
          desc: "Reviews my customer calls weekly, scores me against my focus areas, and flags specific moments to level up — a performance coach built into my workflow.",
          metrics: ["Weekly reviews", "Agentic"]
        }
      ],
      desc: "",
      metrics: [],
      images: []
    },
    {
      cat: "work", emoji: "📬",
      title: "Inbox Organizer Extension",
      desc: "I hit the end of a paid trial and realized I could build the functionality I want (and more) at a fraction of the cost, in less than an hour.",
      metrics: ["<1 hr to build", "Team cost savings", "Chrome Extension"],
      images: [
        { src: "assets/inbox-organizer.gif", cap: "Custom Gmail tabs — Inbox, Follow Up, To Do, To Watch." }
      ]
    },
    {
      cat: "play", emoji: "🪢",
      title: "Tether",
      desc: "My personal productivity app. I use this app for daily check-ins and tracking habits, routines, and goals using the 12-week year framework. I built my dream to-do list and task/idea organization system all in one platform. I also built a Tether to-do list extension that syncs across all my browsers and devices.",
      metrics: ["Personal", "In progress", "Optimized for mobile"],
      images: [
        { src: "assets/tether.gif", cap: "Tether — a two-minute morning Daily Check-In ritual." }
      ]
    },
    {
      cat: "play", emoji: "🦃",
      title: "Thanksgiving Social Bingo",
      desc: "An interactive icebreaker game of photo bingo where the slots are different descriptions of guests at the party. Get bingo/fill your card to win prizes and (more importantly) connect with cool people.",
      metrics: ["Personal", "Multiplayer", "Holiday", "Optimized for mobile"],
      images: [
        { src: "assets/thanksgiving-bingo.png", cap: "Johnnie&rsquo;s Thanksgiving 2025 Bingo — snap a photo with whoever fills each square." }
      ]
    }
  ];

  const grid = document.getElementById("grid");

  // Sort order: GIF cards first, then image cards, then text-only (stable within each tier).
  function rank(c) {
    if (!c.images.length) return 0;
    return /\.gif(\?|$)/i.test(c.images[0].src) ? 2 : 1;
  }
  CARDS.sort(function (a, b) { return rank(b) - rank(a); });

  function pills(arr) { return arr.map(function (m) { return '<span class="metric">' + m + "</span>"; }).join(""); }

  function cover(c) {
    if (!c.images.length) return "";
    const count = c.images.length > 1 ? '<span class="card__count">' + ICON.imgs + c.images.length + "</span>" : "";
    return '<div class="card__cover"><img src="' + c.images[0].src + '" alt="' + c.title + '" loading="lazy">' + count + "</div>";
  }

  function render() {
    grid.innerHTML = CARDS.map(function (c, i) {
      const hasImg = c.images.length > 0;
      var inner;
      if (c.sections) {
        inner =
          '<div class="card__emoji">' + c.emoji + "</div>" +
          '<h3 class="card__title">' + c.title + "</h3>" +
          '<div class="card__sections">' +
            c.sections.map(function (s) {
              return (
                '<div class="card__section">' +
                  '<h4 class="card__subtitle">' + s.emoji + " " + s.title + "</h4>" +
                  '<p class="card__desc">' + s.desc + "</p>" +
                  '<div class="card__metrics">' + pills(s.metrics) + "</div>" +
                "</div>"
              );
            }).join("") +
          "</div>";
      } else {
        inner =
          '<div class="card__emoji">' + c.emoji + "</div>" +
          '<h3 class="card__title">' + c.title + "</h3>" +
          '<p class="card__desc">' + c.desc + "</p>" +
          '<div class="card__metrics">' + pills(c.metrics) + "</div>";
      }
      return (
        '<article class="card ' + (hasImg ? "has-img " : "") + (c.feature ? "card--feature" : "") +
          '" data-cat="' + c.cat + '" data-i="' + i + '">' +
          cover(c) +
          '<div class="card__body">' +
            inner +
          "</div>" +
        "</article>"
      );
    }).join("");
  }
  render();

  /* ---------- filters ---------- */
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      const f = chip.dataset.filter;
      grid.querySelectorAll(".card").forEach(function (card) {
        card.style.display = (f === "all" || card.dataset.cat === f) ? "" : "none";
      });
    });
  });

  /* ---------- pointer tilt + glow ---------- */
  grid.addEventListener("pointermove", function (e) {
    const card = e.target.closest(".card.has-img");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty("--cx", (px * 100) + "%");
    card.style.setProperty("--cy", (py * 100) + "%");
    if (!reduce && !card.classList.contains("card--feature")) {
      const rx = (0.5 - py) * 8, ry = (px - 0.5) * 8;
      card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
    }
  });
  grid.addEventListener("pointerleave", function (e) {
    const card = e.target.closest && e.target.closest(".card");
    if (card) card.style.transform = "";
  }, true);
  grid.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("pointerleave", function () { c.style.transform = ""; });
  });

  /* ---------- card click -> lightbox ---------- */
  grid.addEventListener("click", function (e) {
    const card = e.target.closest(".card.has-img");
    if (!card) return;
    openLightbox(CARDS[+card.dataset.i]);
  });

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lb = document.getElementById("lb");
  const lbImgs = document.getElementById("lb-imgs");
  const lbDots = document.getElementById("lb-dots");
  const lbTitle = document.getElementById("lb-title");
  const lbCap = document.getElementById("lb-cap");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  const lbClose = document.getElementById("lb-close");
  const lbArrows = document.getElementById("lb-arrows");
  const lbDotsWrap = document.getElementById("lb-dotswrap");

  let cur = null, idx = 0, timer = null, manual = false;

  function build(card) {
    lbImgs.innerHTML = card.images.map(function (im) { return '<img class="lb__img" src="' + im.src + '" alt="">'; }).join("");
    lbDots.innerHTML = card.images.map(function (_, i) { return '<button class="lb__dot" data-i="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>'; }).join("");
    const multi = card.images.length > 1;
    lbArrows.style.display = multi ? "" : "none";
    lbDotsWrap.style.display = multi ? "" : "none";
  }
  function show(i, dir) {
    const imgs = lbImgs.querySelectorAll(".lb__img");
    if (!imgs.length) return;
    idx = (i + imgs.length) % imgs.length;
    imgs.forEach(function (img, k) {
      img.classList.remove("show");
      if (k === idx) {
        img.style.setProperty("--from", dir === undefined ? "0px" : (dir > 0 ? "40px" : "-40px"));
        void img.offsetWidth;
        img.classList.add("show");
      }
    });
    lbDots.querySelectorAll(".lb__dot").forEach(function (d, k) { d.classList.toggle("active", k === idx); });
    lbCap.textContent = cur.images[idx].cap || "";
  }
  function go(dir) { show(idx + dir, dir); }
  function startAuto() { stopAuto(); if (!cur || cur.images.length < 2 || manual) return; timer = setInterval(function () { show(idx + 1, 1); }, 10000); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  function openLightbox(card) {
    cur = card; idx = 0; manual = false;
    build(card);
    lbTitle.innerHTML = '<span>' + card.emoji + "</span>" + card.title;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { show(0); startAuto(); });
  }
  function closeLightbox() { lb.classList.remove("open"); document.body.style.overflow = ""; stopAuto(); cur = null; }

  lbPrev.addEventListener("click", function () { manual = true; stopAuto(); go(-1); });
  lbNext.addEventListener("click", function () { manual = true; stopAuto(); go(1); });
  lbClose.addEventListener("click", closeLightbox);
  lbDots.addEventListener("click", function (e) {
    const d = e.target.closest(".lb__dot");
    if (!d) return;
    manual = true; stopAuto();
    show(+d.dataset.i, +d.dataset.i > idx ? 1 : -1);
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  const panel = lb.querySelector(".lb__panel");
  panel.addEventListener("mouseenter", stopAuto);
  panel.addEventListener("mouseleave", startAuto);
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") { manual = true; stopAuto(); go(1); }
    else if (e.key === "ArrowLeft") { manual = true; stopAuto(); go(-1); }
  });

  /* ============================================================
     TIMELINE — progress, lit nodes, focus, chapter pill
     ============================================================ */
  const timeline = document.getElementById("timeline");
  const fill = document.getElementById("track-fill");
  const chapter = document.getElementById("chapter");
  const chEmoji = document.getElementById("chapter-emoji");
  const chDate = document.getElementById("chapter-date");
  const entryEls = Array.prototype.slice.call(document.querySelectorAll(".entry"));

  function updateProgress() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    let pct = (mid - rect.top) / rect.height;
    pct = Math.max(0, Math.min(1, pct));
    fill.style.height = (pct * 100) + "%";

    let focusEl = null;
    entryEls.forEach(function (el) {
      const node = el.querySelector(".node");
      const r = node.getBoundingClientRect();
      const nodeMid = r.top + r.height / 2;
      const lit = nodeMid <= mid;
      node.classList.toggle("lit", lit);
      el.classList.remove("focus");
      if (lit) focusEl = el; // last lit = current chapter
    });

    const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
    if (focusEl && inView) {
      focusEl.classList.add("focus");
      chEmoji.textContent = focusEl.querySelector(".node").textContent;
      chDate.textContent = focusEl.querySelector(".entry__date").textContent;
      chapter.classList.add("show");
    } else {
      chapter.classList.remove("show");
    }
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  entryEls.forEach(function (el) { io.observe(el); });
})();
