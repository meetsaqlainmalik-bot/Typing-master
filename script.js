/* ============================================================
   Typing Master Pro - Main Application Logic
   TypingMaster style: box rows, space = next row, key highlight
   Error positions stay RED permanently to show mistakes
   ============================================================ */

(function () {
  "use strict";

  /* ============ DOM REFS ============ */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const screens = {
    home: $("#screen-home"),
    lesson: $("#screen-lesson"),
    results: $("#screen-results"),
    practice: $("#screen-practice"),
    keys: $("#screen-keys")
  };

  const topStats = $("#top-stats");
  const typer = $("#typer");
  const chunkDots = $("#chunk-dots");
  const lessonTitle = $("#lesson-title");
  const modeBadge = $("#mode-badge");
  const pauseOverlay = $("#pause-overlay");
  const toastEl = $("#toast");

  const rowEls = [$("#tm-row-0"), $("#tm-row-1"), $("#tm-row-2")];

  /* ============ STATE ============ */
  let state = {
    mode: "lesson",
    lessonId: 0,
    drillType: null,
    chunks: [],
    chunkIdx: 0,
    rows: [],
    currentRow: 0,
    pos: 0,
    startTime: null,
    timerId: null,
    elapsed: 0,
    totalTyped: 0,
    correctTyped: 0,
    errorKeys: {},
    paused: false,
    finished: false,
    practiceDuration: 0,
    practiceSource: "random",
    practiceDifficulty: "medium",
    customText: "",
    soundOn: true,
    boxesPerRow: 12,
    typedChars: {},
    errorPositions: new Set(),  // tracks "row:pos" where errors occurred
    lastError: null
  };

  /* ============ PERSISTENCE ============ */
  const STORE_KEY = "typingMasterPro_v1";

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { completed: {}, bestWpm: 0, totalPracticeSec: 0, lastLesson: 0 };
  }

  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  let progress = loadProgress();

  /* ============ SOUND ============ */
  let audioCtx = null;
  function beep(freq, dur, type, vol) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "square";
      o.frequency.value = freq;
      g.gain.value = vol || 0.03;
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (dur || 0.06));
      o.stop(audioCtx.currentTime + (dur || 0.06));
    } catch (e) {}
  }
  const sfx = {
    key: () => beep(880, 0.04, "square", 0.02),
    err: () => beep(220, 0.12, "sawtooth", 0.04),
    done: () => { beep(660, 0.1, "sine", 0.05); setTimeout(() => beep(880, 0.15, "sine", 0.05), 120); },
    row: () => beep(1200, 0.06, "sine", 0.03)
  };

  /* ============ NAVIGATION ============ */
  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
    topStats.classList.toggle("hidden", name !== "lesson");
    $("#btn-home").classList.toggle("hidden", name === "home");
    window.scrollTo({ top: 0 });
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.add("hidden"), 2200);
  }

  /* ============ HOME ============ */
  function renderHome() {
    renderLessonList();
    renderStats();
  }

  function renderLessonList() {
    const list = $("#lesson-list");
    list.innerHTML = "";
    const completed = progress.completed;
    LESSONS.forEach((les) => {
      const isDone = !!completed[les.id];
      const item = document.createElement("div");
      item.className = "lesson-item" + (isDone ? " done" : "");
      const score = completed[les.id];
      item.innerHTML = `
        <div class="l-num">${isDone ? "✓" : les.id}</div>
        <div class="l-body">
          <div class="l-title">${les.title}</div>
          <div class="l-keys">${les.keys}</div>
        </div>
        <div class="l-score">${score ? `<b>${score.wpm} WPM</b>${score.acc}% acc` : "Not started"}</div>
      `;
      item.addEventListener("click", () => startLesson(les.id));
      list.appendChild(item);
    });
  }

  function renderStats() {
    const done = progress.completed;
    const ids = Object.keys(done);
    const total = LESSONS.length;
    const pct = Math.round((ids.length / total) * 100);
    const ring = $("#ring-fg");
    const circ = 2 * Math.PI * 52;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ - (circ * pct / 100);
    $("#ring-pct").textContent = pct + "%";
    const wpms = ids.map(id => done[id].wpm);
    const best = Math.max(progress.bestWpm || 0, ...wpms, 0);
    const avg = wpms.length ? Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length) : 0;
    $("#s-best-wpm").textContent = best;
    $("#s-avg-wpm").textContent = avg;
    $("#s-lessons-done").textContent = ids.length + "/" + total;
    const min = Math.floor((progress.totalPracticeSec || 0) / 60);
    $("#s-total-time").textContent = min + "m";
  }

  /* ============ START ============ */
  function startLesson(id) {
    const les = LESSONS.find(l => l.id === id);
    if (!les) return;
    state.mode = "lesson";
    state.lessonId = id;
    state.drillType = null;
    state.chunks = les.chunks.slice();
    lessonTitle.textContent = `Lesson ${les.id}: ${les.title}`;
    modeBadge.textContent = "Lesson";
    beginSession();
  }

  function startDrill(type) {
    state.mode = "practice";
    state.drillType = type;
    state.lessonId = 0;
    let chunks = [];
    let title = "";
    const diff = state.practiceDifficulty;
    if (type === "keydrill") { chunks = generateKeyDrill(20); title = "Key Drill"; }
    else if (type === "common") { chunks = generateWordChunks(40, 6, diff); title = "Common Words"; }
    else if (type === "sentences") { chunks = generateSentenceChunks(12); title = "Sentences"; }
    else if (type === "punctuation") { chunks = pickRandom(PUNCTUATION_DRILL, 10); title = "Punctuation"; }
    else if (type === "numbers") { chunks = pickRandom(NUMBERS_DRILL, 10); title = "Numbers"; }
    else if (type === "quotes") { chunks = pickRandom(QUOTES, 8); title = "Famous Quotes"; }
    else if (type === "free") { chunks = buildFreePractice(); title = "Free Practice"; }
    state.chunks = chunks;
    lessonTitle.textContent = title;
    modeBadge.textContent = "Practice";
    beginSession();
  }

  function beginSession() {
    state.chunkIdx = 0;
    state.startTime = null;
    state.elapsed = 0;
    state.totalTyped = 0;
    state.correctTyped = 0;
    state.errorKeys = {};
    state.paused = false;
    state.finished = false;
    state.typedChars = {};
    state.errorPositions = new Set();
    state.lastError = null;
    stopTimer();
    renderDots();
    loadChunk(0);
    show("lesson");
    typer.value = "";
    typer.focus();
    startTimer();
  }

  function renderDots() {
    chunkDots.innerHTML = "";
    state.chunks.forEach(() => {
      const d = document.createElement("div");
      d.className = "cdot";
      chunkDots.appendChild(d);
    });
    updateDots();
  }

  function updateDots() {
    const dots = chunkDots.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active", "done");
      if (i < state.chunkIdx) dots[i].classList.add("done");
      if (i === state.chunkIdx) dots[i].classList.add("active");
    }
  }

  /* ============ ROW / BOX SYSTEM ============ */
  function computeRows(text, perRow) {
    const rows = [];
    let i = 0;
    while (i < text.length) {
      let end = Math.min(i + perRow, text.length);
      if (end < text.length) {
        let sp = text.lastIndexOf(" ", end);
        if (sp > i) end = sp;
      }
      rows.push(text.slice(i, end));
      i = end;
      if (i < text.length && text[i] === " ") i++;
    }
    return rows;
  }

  function loadChunk(idx) {
    if (idx >= state.chunks.length) { finishSession(); return; }
    state.chunkIdx = idx;
    state.rows = computeRows(state.chunks[idx], state.boxesPerRow);
    state.currentRow = 0;
    state.pos = 0;
    state.typedChars = {};
    state.errorPositions = new Set();
    state.lastError = null;
    updateDots();
    renderBoxes();
  }

  function isRowComplete() {
    return state.pos >= state.rows[state.currentRow].length;
  }

  function expectedChar() {
    if (isRowComplete()) return " ";
    return state.rows[state.currentRow][state.pos];
  }

  function renderBoxes() {
    const rows = state.rows;
    const cur = state.currentRow;
    const startRow = Math.max(0, cur - 1);
    const visible = [startRow, startRow + 1, startRow + 2];

    rowEls.forEach((el, i) => {
      el.innerHTML = "";
      const rowIdx = visible[i];
      if (rowIdx === undefined || rowIdx >= rows.length) {
        el.classList.add("hidden-row");
        return;
      }
      el.classList.remove("hidden-row");
      const rowText = rows[rowIdx];

      for (let c = 0; c < rowText.length; c++) {
        const box = document.createElement("div");
        box.className = "box";
        const ch = rowText[c];
        if (ch === " ") {
          box.classList.add("space");
        } else {
          box.textContent = ch;
        }

        // Check if this position had an error
        const posKey = rowIdx + ":" + c;
        const hadError = state.errorPositions.has(posKey);

        if (rowIdx < cur) {
          // Previous row - show error or done based on error history
          box.classList.add(hadError ? "error" : "done");
        } else if (rowIdx === cur) {
          if (c < state.pos) {
            // Already typed - red if error was made here, green if not
            box.classList.add(hadError ? "error" : "done");
          } else if (c === state.pos) {
            // Current position
            box.classList.add("current");
            if (hadError) box.classList.add("error");
          }
        }
        el.appendChild(box);
      }

      if (rowIdx === cur && isRowComplete()) {
        const hint = document.createElement("div");
        hint.className = "box space current";
        hint.style.borderColor = "var(--accent)";
        hint.style.color = "var(--accent)";
        hint.innerHTML = "<span style='font-size:14px'>SPACE</span>";
        el.appendChild(hint);
      }

      if (rowIdx < cur) el.classList.add("row-complete");
      else el.classList.remove("row-complete");
    });

    highlightExpectedKey();
  }

  function highlightExpectedKey() {
    $$("#keyboard .key").forEach(k => k.classList.remove("active"));
    const exp = expectedChar();
    let el;
    if (exp === " ") {
      el = $('#keyboard .key[data-k=" "]');
    } else {
      const k = exp.toLowerCase();
      el = $(`#keyboard .key[data-k="${cssEscape(k)}"]`);
    }
    if (el) el.classList.add("active");
  }

  function cssEscape(s) {
    return s.replace(/["\\]/g, "\\$&");
  }

  /* ============ TIMER ============ */
  function startTimer() {
    state.startTime = Date.now();
    stopTimer();
    state.timerId = setInterval(() => {
      if (state.paused || state.finished) return;
      state.elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      updateTopStats();
      if (state.practiceDuration > 0 && state.elapsed >= state.practiceDuration) finishSession();
    }, 250);
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  /* ============ STATS ============ */
  function calcWpm() {
    const mins = state.elapsed / 60;
    if (mins <= 0) return 0;
    return Math.round((state.correctTyped / 5) / mins);
  }

  function calcAccuracy() {
    if (state.totalTyped === 0) return 100;
    return Math.round((state.correctTyped / state.totalTyped) * 100);
  }

  function updateTopStats() {
    $("#t-wpm").textContent = calcWpm();
    $("#t-acc").textContent = calcAccuracy() + "%";
    $("#t-time").textContent = fmtTime(state.elapsed);
    const totalChars = state.rows.reduce((a, r) => a + r.length, 0);
    const doneChars = state.rows.slice(0, state.currentRow).reduce((a, r) => a + r.length, 0) + state.pos;
    const pct = totalChars ? Math.round((doneChars / totalChars) * 100) : 0;
    $("#t-prog").textContent = pct + "%";
  }

  /* ============ KEY HANDLING ============ */
  typer.addEventListener("keydown", (e) => {
    if (state.finished) return;
    if (e.key === "Escape") { e.preventDefault(); togglePause(); return; }
    if (state.paused) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePause(); }
      return;
    }
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) return;
    if (e.key === "Backspace") { e.preventDefault(); handleBackspace(); return; }
    if (e.key === "Enter") { e.preventDefault(); return; }
    if (e.key.length === 1) { e.preventDefault(); handleChar(e.key); }
  });

  typer.addEventListener("input", () => { typer.value = ""; });

  function handleChar(ch) {
    const exp = expectedChar();

    if (state.startTime === null) startTimer();

    state.totalTyped++;
    const key = state.currentRow + ":" + state.pos;
    state.typedChars[key] = ch;

    if (ch === exp) {
      state.correctTyped++;
      sfx.key();
      state.lastError = null;

      if (!isRowComplete()) {
        state.pos++;
      } else {
        state.currentRow++;
        state.pos = 0;
        if (state.currentRow >= state.rows.length) {
          sfx.row();
          setTimeout(() => {
            if (state.finished) return;
            if (state.chunkIdx + 1 >= state.chunks.length) finishSession();
            else loadChunk(state.chunkIdx + 1);
          }, 250);
        } else {
          sfx.row();
        }
      }
    } else {
      sfx.err();
      state.errorKeys[exp] = (state.errorKeys[exp] || 0) + 1;
      // Mark this position as having an error
      state.errorPositions.add(key);
      state.lastError = { row: state.currentRow, col: state.pos };
    }

    renderBoxes();
    updateTopStats();
  }

  function handleBackspace() {
    if (state.pos > 0) {
      state.pos--;
      delete state.typedChars[state.currentRow + ":" + state.pos];
    } else if (state.currentRow > 0) {
      state.currentRow--;
      state.pos = state.rows[state.currentRow].length;
    }
    state.lastError = null;
    renderBoxes();
    updateTopStats();
  }

  /* ============ PAUSE ============ */
  function togglePause() {
    state.paused = !state.paused;
    pauseOverlay.classList.toggle("hidden", !state.paused);
    if (!state.paused) typer.focus();
  }

  /* ============ FINISH ============ */
  function finishSession() {
    if (state.finished) return;
    state.finished = true;
    stopTimer();
    sfx.done();
    const wpm = calcWpm();
    const acc = calcAccuracy();
    const stars = calcStars(wpm, acc);

    if (state.mode === "lesson" && state.lessonId > 0) {
      const prev = progress.completed[state.lessonId];
      if (!prev || wpm > prev.wpm) {
        progress.completed[state.lessonId] = { wpm, acc, stars, date: Date.now() };
      }
      if (wpm > progress.bestWpm) progress.bestWpm = wpm;
      progress.lastLesson = state.lessonId;
    }
    progress.totalPracticeSec = (progress.totalPracticeSec || 0) + state.elapsed;
    saveProgress(progress);
    showResults(wpm, acc, stars);
  }

  function calcStars(wpm, acc) {
    if (wpm >= 40 && acc >= 95) return 3;
    if (wpm >= 25 && acc >= 90) return 2;
    return 1;
  }

  function showResults(wpm, acc, stars) {
    $("#res-wpm").textContent = wpm;
    $("#res-acc").textContent = acc + "%";
    $("#res-time").textContent = fmtTime(state.elapsed);

    let emoji = "🎉", title = "Lesson Complete!", sub = "Great job!";
    if (stars === 3) { emoji = "🏆"; title = "Excellent!"; sub = "Outstanding performance!"; }
    else if (stars === 2) { emoji = "👍"; title = "Good Job!"; sub = "Keep practicing to reach 3 stars"; }
    else { emoji = "💪"; title = "Keep Practicing!"; sub = "Try again to improve your score"; }
    $("#res-emoji").textContent = emoji;
    $("#res-title").textContent = title;
    $("#res-sub").textContent = sub;

    const totalChars = state.totalTyped;
    const errors = totalChars - state.correctTyped;
    $("#res-detail").innerHTML = `
      <span>Keystrokes: <b>${totalChars}</b></span>
      <span>Errors: <b>${errors}</b></span>
      <span>Mode: <b>${state.mode === "lesson" ? "Lesson " + state.lessonId : "Practice"}</b></span>
    `;

    const weak = Object.entries(state.errorKeys).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const wrap = $("#weak-keys-wrap");
    const wkEl = $("#weak-keys");
    if (weak.length > 0) {
      wrap.style.display = "";
      wkEl.innerHTML = weak.map(([k, n]) =>
        `<span class="wk">${k === " " ? "SPACE" : k} <small>×${n}</small></span>`
      ).join("");
    } else {
      wrap.style.display = "none";
    }

    $("#res-stars").textContent = "★ ".repeat(stars).trim() + (stars < 3 ? " ☆".repeat(3 - stars).trim() : "");

    const nextBtn = $("#btn-next");
    if (state.mode === "lesson" && state.lessonId < LESSONS.length) nextBtn.style.display = "";
    else nextBtn.style.display = "none";

    show("results");
  }

  /* ============ GENERATORS ============ */
  function pickRandom(arr, n) {
    const copy = arr.slice();
    const out = [];
    for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return out;
  }

  function generateKeyDrill(n) {
    const keys = "asdfjkl;gh";
    const chunks = [];
    for (let i = 0; i < n; i++) {
      let s = "";
      for (let j = 0; j < 30; j++) {
        s += keys[Math.floor(Math.random() * keys.length)];
        if (j % 5 === 4) s += " ";
      }
      chunks.push(s.trim());
    }
    return chunks;
  }

  function generateWordChunks(count, wordsPerChunk, difficulty) {
    const words = ALL_WORDS[difficulty] || ALL_WORDS.medium;
    const chunks = [];
    for (let i = 0; i < count; i++) {
      let parts = [];
      for (let j = 0; j < wordsPerChunk; j++) parts.push(words[Math.floor(Math.random() * words.length)]);
      chunks.push(parts.join(" "));
    }
    return chunks;
  }

  function generateSentenceChunks(count) {
    const chunks = [];
    for (let i = 0; i < count; i++) chunks.push(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
    return chunks;
  }

  function buildFreePractice() {
    const src = state.practiceSource;
    const diff = state.practiceDifficulty;
    let chunks = [];
    if (src === "custom" && state.customText.trim()) {
      const txt = state.customText.trim();
      chunks = txt.split(/\n+/).map(s => s.trim()).filter(Boolean);
      if (chunks.length === 1 && chunks[0].length > 60) {
        chunks = [];
        const words = txt.split(" ");
        let cur = "";
        words.forEach(w => {
          if ((cur + " " + w).length > 60) { chunks.push(cur.trim()); cur = ""; }
          cur += " " + w;
        });
        if (cur.trim()) chunks.push(cur.trim());
      }
    } else if (src === "sentences") {
      chunks = generateSentenceChunks(15);
    } else {
      chunks = generateWordChunks(30, 8, diff);
    }
    if (state.practiceDuration > 0) {
      while (chunks.length < 40) chunks = chunks.concat(chunks);
      chunks = chunks.slice(0, 60);
    }
    return chunks;
  }

  /* ============ PRACTICE SETUP ============ */
  function openPractice() { show("practice"); }

  $$(".src-btn").forEach(b => {
    b.addEventListener("click", () => {
      $$(".src-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      state.practiceSource = b.dataset.src;
      $("#opt-custom").style.display = state.practiceSource === "custom" ? "" : "none";
    });
  });

  $("#btn-pr-start").addEventListener("click", () => {
    state.practiceDuration = parseInt($("#pr-duration").value, 10) || 0;
    state.practiceDifficulty = $("#pr-difficulty").value;
    state.customText = $("#custom-text").value;
    startDrill("free");
  });

  $("#btn-pr-cancel").addEventListener("click", () => show("home"));

  /* ============ EVENT BINDINGS ============ */
  $("#btn-continue").addEventListener("click", () => {
    const last = progress.lastLesson || 0;
    const target = last + 1 <= LESSONS.length ? last + 1 : 1;
    startLesson(target);
  });

  $("#btn-free-practice").addEventListener("click", openPractice);

  $$(".drill").forEach(d => d.addEventListener("click", () => startDrill(d.dataset.drill)));

  $("#btn-exit").addEventListener("click", () => {
    state.finished = true;
    stopTimer();
    pauseOverlay.classList.add("hidden");
    show("home");
    renderHome();
  });

  $("#btn-home").addEventListener("click", () => {
    state.finished = true;
    stopTimer();
    pauseOverlay.classList.add("hidden");
    show("home");
    renderHome();
  });

  $("#btn-resume").addEventListener("click", togglePause);
  $("#btn-restart").addEventListener("click", () => { pauseOverlay.classList.add("hidden"); beginSession(); });
  $("#btn-quit").addEventListener("click", () => {
    state.finished = true;
    stopTimer();
    pauseOverlay.classList.add("hidden");
    show("home");
    renderHome();
  });

  $("#btn-retry").addEventListener("click", () => {
    if (state.mode === "lesson") startLesson(state.lessonId);
    else startDrill(state.drillType || "free");
  });

  $("#btn-next").addEventListener("click", () => {
    const next = state.lessonId + 1;
    if (next <= LESSONS.length) startLesson(next);
    else show("home");
  });

  $("#btn-back-home").addEventListener("click", () => { show("home"); renderHome(); });

  $("#btn-sound").addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    $("#btn-sound").textContent = state.soundOn ? "🔊" : "🔇";
    $("#btn-sound").classList.toggle("off", !state.soundOn);
    toast(state.soundOn ? "Sound ON" : "Sound OFF");
  });

  $("#btn-keys").addEventListener("click", () => show("keys"));
  $("#btn-keys-back").addEventListener("click", () => { show("home"); renderHome(); });

  // Theme toggle
  $("#btn-theme").addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("tmp_theme", isLight ? "light" : "dark");
    $("#btn-theme").textContent = isLight ? "☀️" : "🌙";
    toast(isLight ? "Light mode ON" : "Dark mode ON");
  });

  document.addEventListener("click", (e) => {
    if (screens.lesson.classList.contains("active") && !state.paused && !state.finished) {
      if (!e.target.closest("button")) typer.focus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (screens.lesson.classList.contains("active") && !state.paused && !state.finished) {
      if (document.activeElement !== typer && e.key.length === 1) typer.focus();
    }
  });

  /* ============ INIT ============ */
  try {
    if (localStorage.getItem("tmp_theme") === "light") {
      document.body.classList.add("light-mode");
      $("#btn-theme").textContent = "☀️";
    }
  } catch (e) {}
  renderHome();
  show("home");

})();
