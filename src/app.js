(() => {
  // Copy email
  const toast = document.getElementById("toast");
  const say = (t) => { toast.textContent = t; clearTimeout(say._t); say._t = setTimeout(() => (toast.textContent = ""), 2400); };
  const copyBtn = document.getElementById("copy-email");
  copyBtn?.addEventListener("click", async () => {
    const email = copyBtn.dataset.email;
    try { await navigator.clipboard.writeText(email); say("Email copied"); }
    catch { say("Select the address to copy it"); }
  });

  // Evidence filter
  const keys = [...document.querySelectorAll(".key")];
  const builds = [...document.querySelectorAll(".build")];
  const caps = [...document.querySelectorAll(".cap")];
  const note = document.getElementById("filter-note");
  let active = null;
  function apply() {
    keys.forEach((k) => k.setAttribute("aria-pressed", String(k.dataset.level === active)));
    builds.forEach((b) => b.classList.toggle("dim", !!active && b.dataset.level !== active));
    caps.forEach((c) => {
      const any = !active || c.querySelector(`.build[data-level="${active}"]`);
      c.classList.toggle("empty-filter", !any);
    });
    if (active) {
      const label = keys.find((k) => k.dataset.level === active)?.querySelector("b")?.textContent || active;
      const n = builds.filter((b) => b.dataset.level === active).length;
      note.innerHTML = "";
      note.append(`Showing ${n} ${n === 1 ? "build" : "builds"} at "${label}". `);
      if (active === "paid") {
        const a = document.createElement("a");
        a.href = "#before"; a.textContent = "Paid work so far is under Before AI.";
        note.append(a, " ");
      }
      const clear = document.createElement("button");
      clear.type = "button"; clear.textContent = "Show all";
      clear.addEventListener("click", () => { active = null; apply(); });
      note.append(clear);
      note.hidden = false;
    } else { note.hidden = true; }
  }
  keys.forEach((k) => k.addEventListener("click", () => {
    active = active === k.dataset.level ? null : k.dataset.level;
    apply();
  }));

  // Skill viewer
  const dlg = document.getElementById("skill-dialog");
  const body = document.getElementById("sd-body");
  const titleEl = document.getElementById("sd-title");
  const dl = document.getElementById("sd-dl");
  const names = window.__SKILLS__ || {};
  async function openSkill(slug) {
    titleEl.textContent = names[slug] || slug;
    dl.href = `/skills/${slug}.md`;
    body.textContent = "Loading…";
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    try {
      const r = await fetch(`/skills/${slug}.md`);
      if (!r.ok) throw new Error(r.status);
      body.textContent = await r.text();
    } catch { body.textContent = "Couldn't load this skill. Use Download instead."; }
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".tag-open");
    if (t) openSkill(t.dataset.skill);
  });
  document.getElementById("sd-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  document.getElementById("sd-copy").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(body.textContent); e.target.textContent = "Copied"; }
    catch { e.target.textContent = "Select and copy"; }
    setTimeout(() => (e.target.textContent = "Copy"), 2000);
  });
})();
