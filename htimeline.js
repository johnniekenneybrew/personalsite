/* ============================================================
   Horizontal timeline — auto-scroll, seamless infinite loop.
   hover-pause · drag · keyboard
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const vp     = document.getElementById("htl-viewport");
  const track  = document.getElementById("htl-track");
  if (!vp || !track) return;
  const btnPlay = document.getElementById("htl-play");

  const SPEED = 1.15;            // px per frame forward
  let offset = 0, loopWidth = 0;
  let playing = !reduce;
  let hover = false, dragging = false;
  let dragX = 0, dragOffset = 0, moved = false;

  /* Duplicate the entry set so the track can scroll forever.
     The clone is visually identical, so wrapping offset by the
     width of one set is seamless — no jerk back to the start. */
  const originals = Array.prototype.slice.call(track.querySelectorAll(".hentry"));

  function makeLoopMark() {
    const d = document.createElement("div");
    d.className = "htl__loopmark";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = '<span class="htl__loopmark-cap htl__loopmark-cap--end">The end</span>' +
                  '<span class="htl__loopmark-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></span>' +
                  '<span class="htl__loopmark-cap htl__loopmark-cap--start">The beginning</span>';
    return d;
  }

  // divider at the very start, and an identical one at the seam,
  // so a separator is always visible at the loop point.
  track.insertBefore(makeLoopMark(), originals[0]);
  track.appendChild(makeLoopMark());
  originals.forEach(function (e) {
    const clone = e.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
  const entries = Array.prototype.slice.call(track.querySelectorAll(".hentry"));

  function wrap(v) {
    if (loopWidth <= 0) return 0;
    return ((v % loopWidth) + loopWidth) % loopWidth;
  }

  function measure() {
    // one set = half of the doubled track
    loopWidth = track.scrollWidth / 2;
    offset = wrap(offset);
    apply();
  }

  function apply() {
    track.style.transform = "translateX(" + (-offset) + "px)";
    const c = offset + vp.clientWidth / 2;
    let best = null, bd = Infinity;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const ec = e.offsetLeft + e.offsetWidth / 2;
      const d = Math.abs(ec - c);
      if (d < bd) { bd = d; best = e; }
    }
    for (let i = 0; i < entries.length; i++) {
      const on = entries[i] === best;
      entries[i].classList.toggle("focus", on);
      const node = entries[i].querySelector(".hentry__node");
      if (node) node.classList.toggle("lit", on);
    }
  }

  function setPlayUI() { if (btnPlay) btnPlay.classList.toggle("is-playing", playing); }
  function toggle() { playing = !playing; setPlayUI(); }

  function frame() {
    if (playing && !hover && !dragging) {
      offset = wrap(offset + SPEED);   // advance forward through the timeline (birth → present)
      apply();
    }
    requestAnimationFrame(frame);
  }

  if (btnPlay) btnPlay.addEventListener("click", toggle);

  vp.addEventListener("mouseenter", function () { hover = true; });
  vp.addEventListener("mouseleave", function () { hover = false; });

  /* drag */
  vp.addEventListener("pointerdown", function (e) {
    dragging = true; moved = false;
    dragX = e.clientX; dragOffset = offset;
    vp.classList.add("grabbing");
    vp.setPointerCapture(e.pointerId);
  });
  vp.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 3) moved = true;
    offset = wrap(dragOffset - dx);
    apply();
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    vp.classList.remove("grabbing");
    try { vp.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  vp.addEventListener("pointerup", endDrag);
  vp.addEventListener("pointercancel", endDrag);

  vp.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); offset = wrap(offset + 140); apply(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); offset = wrap(offset - 140); apply(); }
    else if (e.key === " ") { e.preventDefault(); toggle(); }
  });

  const htl = document.getElementById("htl");
  const io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) { if (en.isIntersecting) { htl.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  io.observe(htl);

  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  setPlayUI();
  measure();
  requestAnimationFrame(frame);
})();
