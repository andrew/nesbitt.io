fetch("cwe_data.json").then(r => r.json()).then(data => {
  const fmt = d3.format(",");
  document.getElementById("meta").textContent =
    `CWE ${data.cwe_version} · ${fmt(data.cve_files)} CVEs · ${fmt(data.total_refs)} CWE refs`;
  const updated = document.getElementById("updated");
  updated.dateTime = data.generated.slice(0, 10);
  updated.textContent = `Updated ${updated.dateTime}`;

  const topHtml = data.top.slice(0, 10).map(t =>
    `<div data-id="${t.id}">${t.id} · ${fmt(t.count)} · ${t.name}</div>`).join("");
  document.getElementById("top").innerHTML = `<strong>Most referenced</strong>${topHtml}`;

  const size = 1000;
  const svg = d3.select("#chart")
    .attr("viewBox", `${-size/2} ${-size/2} ${size} ${size}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const root = d3.hierarchy(data.tree)
    .sum(d => d.value || 0)
    .sort((a, b) => b.value - a.value);

  d3.pack().size([size - 4, size - 4]).padding(3)(root);
  const allCounts = new Map(root.leaves().map(d => [d.data.id, d.data.count]));
  const allRadii = new Map(root.leaves().map(d => [d.data.id, d.r]));
  let infoNode = null;

  root.children.forEach((cat, ci) => {
    cat.dewey = String(ci + 1);
    cat.children.forEach((leaf, li) => leaf.dewey = `${ci + 1}.${li + 1}`);
  });

  let labelMode = "cwe";
  const absOrder = ["Pillar", "Class", "Base", "Variant", "Compound"];
  const absColor = d3.scaleOrdinal()
    .domain(absOrder)
    .range(["#d73027", "#fc8d59", "#91cf60", "#1a9850", "#4575b4"]);

  document.getElementById("legend").innerHTML = absOrder
    .map(a => `<div data-abs="${a}"><i style="background:${absColor(a)}"></i>${a}</div>`).join("");

  let absFilter = null;
  let focus = root;
  let view;

  const defs = svg.append("defs");
  const arcPath = defs.selectAll("path")
    .data(root.children)
    .join("path")
      .attr("id", (d, i) => `arc-${i}`);

  const g = svg.append("g");

  function leafFill(d) {
    if (absFilter && d.data.abstraction !== absFilter) return "#2a2f36";
    return absColor(d.data.abstraction) || "#666";
  }

  const node = g.selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.depth === 1 ? "rgba(100,100,100,0.15)" : leafFill(d))
      .attr("stroke", d => d.depth === 1 ? "#555" : "none")
      .on("mouseover", (e, d) => showInfo(d))
      .on("click", (e, d) => {
        e.stopPropagation();
        const target = d.children ? d : d.parent;
        if (focus !== target) zoom(e, target);
      });

  const catText = d => labelMode === "dewey" ? `${d.dewey} · ${d.data.name}` : d.data.name;
  const leafText = d => labelMode === "dewey" ? d.dewey : d.data.id;

  const catLabel = g.selectAll("text.cat")
    .data(root.children)
    .join("text")
      .attr("class", "cat")
    .append("textPath")
      .attr("href", (d, i) => `#arc-${i}`)
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .text(catText);

  const leafLabel = g.selectAll("text.leaf")
    .data(root.leaves())
    .join("text")
      .attr("class", "leaf")
      .attr("dy", "0.35em")
      .text(leafText);

  document.querySelectorAll("#labelmode a").forEach(a => {
    a.addEventListener("click", e => {
      labelMode = a.dataset.mode;
      document.querySelectorAll("#labelmode a").forEach(x =>
        x.classList.toggle("on", x === a));
      catLabel.text(catText);
      leafLabel.text(leafText);
      zoomTo(view);
      e.preventDefault();
    });
  });

  svg.on("click", e => zoom(e, root));

  function setFilter(abs) {
    absFilter = abs;
    node.filter(d => d.depth > 1).attr("fill", leafFill);
    leafLabel.style("visibility", d =>
      absFilter && d.data.abstraction !== absFilter ? "hidden" : null);
    document.querySelectorAll("#legend div[data-abs]").forEach(el =>
      el.classList.toggle("dim", absFilter && el.dataset.abs !== absFilter));
  }

  document.querySelectorAll("#legend div[data-abs]").forEach(el => {
    el.addEventListener("click", e => {
      setFilter(absFilter === el.dataset.abs ? null : el.dataset.abs);
      e.stopPropagation();
    });
  });

  const byId = new Map(root.descendants().map(d => [d.data.id, d]));

  function focusOn(id) {
    const d = byId.get(id);
    if (!d) return;
    node.classed("hl", n => n === d);
    showInfo(d);
    zoom(null, d.children ? d : d.parent);
  }

  document.getElementById("top").addEventListener("click", e => {
    const el = e.target.closest("[data-id]");
    if (el) focusOn(el.dataset.id);
  });

  const yearSelect = document.getElementById("year");
  const years = Object.keys(data.years).filter(year => year >= "2020").sort();
  const playButton = document.getElementById("play");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playback = null;
  years.slice().reverse().forEach(year => {
    yearSelect.add(new Option(year, year));
  });
  yearSelect.addEventListener("change", () => {
    stopPlayback();
    updateYear();
  });
  playButton.disabled = years.length < 2;
  playButton.addEventListener("click", () => {
    if (playback !== null) { stopPlayback(); return; }
    if (!yearSelect.value || yearSelect.value === years[years.length - 1]) {
      yearSelect.value = years[0];
      updateYear();
    }
    playButton.textContent = "Pause";
    playback = window.setInterval(() => {
      const next = years.indexOf(yearSelect.value) + 1;
      yearSelect.value = years[next];
      updateYear(true);
      if (next === years.length - 1) stopPlayback();
    }, 1500);
  });

  function stopPlayback() {
    window.clearInterval(playback);
    playback = null;
    playButton.textContent = "Play";
  }

  function updateYear(animate = false) {
    const year = yearSelect.value;
    const counts = {};
    let cves = 0;
    Object.entries(data.years).forEach(([published, bucket]) => {
      if (published > year) return;
      cves += bucket.cve_files;
      Object.entries(bucket.counts).forEach(([id, count]) => {
        counts[id] = (counts[id] || 0) + count;
      });
    });
    root.leaves().forEach(d => {
      d.data.count = year ? (counts[d.data.id.slice(4)] || 0) : allCounts.get(d.data.id);
      d.data.value = Math.max(d.data.count, 1);
      d.r = allRadii.get(d.data.id) * Math.sqrt(d.data.value / Math.max(allCounts.get(d.data.id), 1));
    });
    svg.interrupt();
    zoomTo([focus.x, focus.y, focus.r * 2 + 10], animate && !reducedMotion.matches);
    const refs = year ? d3.sum(Object.values(counts)) : data.total_refs;
    document.getElementById("meta").textContent =
      `CWE ${data.cwe_version} · ${fmt(year ? cves : data.cve_files)} CVEs · ${fmt(refs)} CWE refs`;
    const top = root.leaves().filter(d => d.data.count > 0)
      .sort((a, b) => b.data.count - a.data.count).slice(0, 10);
    document.getElementById("top").innerHTML = `<strong>Most referenced</strong>` + top.map(d =>
      `<div data-id="${d.data.id}">${d.data.id} · ${fmt(d.data.count)} · ${escapeHtml(d.data.name)}</div>`).join("");
    if (infoNode) showInfo(infoNode);
  }

  zoomTo([root.x, root.y, root.r * 2 + 10]);

  function zoomTo(v, animate = false) {
    view = v;
    const k = size / v[2];
    const tx = d => (d.x - v[0]) * k;
    const ty = d => (d.y - v[1]) * k;
    const move = selection => animate ? selection.transition().duration(800) : selection.interrupt();

    node.attr("transform", d => `translate(${tx(d)},${ty(d)})`);
    move(node).attr("r", d => d.r * k);

    arcPath.attr("d", d => {
      const r = d.r * k - 6;
      const cx = tx(d), cy = ty(d);
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`;
    });
    catLabel.each(function(d) {
      const r = d.r * k;
      const parent = this.parentNode;
      const arcLen = Math.PI * (r - 6);
      const fs = arcLen / (catText(d).length * 0.6);
      if (r < 25 || fs < 10) { parent.style.display = "none"; return; }
      parent.style.display = null;
      parent.style.fontSize = Math.min(16, fs) + "px";
    });

    leafLabel
      .attr("transform", d => `translate(${tx(d)},${ty(d)})`)
      .style("display", d => d.r * k > 22 ? null : "none");
  }

  function zoom(event, d) {
    focus = d;
    updateCrumbs();
    svg.transition().duration(600).tween("zoom", () => {
      const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + 10]);
      return t => zoomTo(i(t));
    });
  }

  function showInfo(d) {
    infoNode = d;
    const info = document.getElementById("info");
    const id = d.data.id;
    const num = id.replace("CWE-", "");
    const link = `https://cwe.mitre.org/data/definitions/${num}.html`;
    const dew = d.dewey ? ` · <span title="synthetic Dewey-style code">${d.dewey}</span>` : "";
    let html = `<div class="id"><a href="${link}" target="_blank">${id}</a>${dew}</div>`;
    html += `<h2>${d.data.name}</h2>`;
    if (d.children) {
      const total = d3.sum(d.leaves(), l => l.data.count);
      html += `<div class="count">${d.children.length} weaknesses · ${fmt(total)} CVE refs</div>`;
      if (d.data.summary) html += `<div class="desc">${escapeHtml(d.data.summary)}</div>`;
    } else {
      html += `<div class="count">${fmt(d.data.count)} CVE refs · ${d.data.abstraction || ""}</div>`;
      if (d.data.description) html += `<div class="desc">${escapeHtml(d.data.description)}</div>`;
    }
    info.innerHTML = html;
  }

  function updateCrumbs() {
    const el = document.getElementById("crumbs");
    const chain = focus.ancestors().reverse();
    el.innerHTML = chain.map((d, i) =>
      i === chain.length - 1 ? d.data.name : `<span data-i="${i}">${d.data.name}</span>`
    ).join(" / ");
    el.querySelectorAll("span").forEach(s =>
      s.onclick = e => { zoom(e, chain[+s.dataset.i]); e.stopPropagation(); });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  }

  updateCrumbs();
});
