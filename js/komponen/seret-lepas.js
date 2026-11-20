// Seret-dan-lepas interaktif layaknya papan taktik (tactical board) asli
let drag = null;

// Tempatkan pemain di slot; jika sudah jadi starter, tukar dengan penghuni slot
function assign(pid, slot){
  const prev = state.lineup.indexOf(pid), occ = state.lineup[slot];
  state.lineup[slot] = pid;
  if(prev >= 0) state.lineup[prev] = occ;
  refresh();
}

document.addEventListener("pointerdown", e => {
  const el = e.target.closest("[data-pid],[data-slot]");
  if(!el) return;
  const from = el.dataset.slot !== undefined ? +el.dataset.slot : null;
  const pid = from !== null ? state.lineup[from] : +el.dataset.pid;

  drag = {
    pid,
    from,
    startX: e.clientX,
    startY: e.clientY,
    moved: false,
    g: null
  };

  if(from !== null){
    try { $("#pitch").setPointerCapture(e.pointerId); } catch (_) {}
  }
  e.preventDefault();
});

document.addEventListener("pointermove", e => {
  if(!drag) return;
  const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
  if(!drag.moved && dist > 4){
    drag.moved = true;
    // Jika menyeret pemain dari daftar skuad (bukan dari lapangan), buat elemen bayangan (ghost)
    if(drag.from === null){
      drag.g = document.createElement("div");
      drag.g.className = "ghost";
      drag.g.textContent = R[drag.pid].n;
      document.body.appendChild(drag.g);
    }
  }

  if(drag.moved){
    if(drag.from !== null){
      // Papan Taktik Asli: Geser posisi pemain di lapangan secara langsung!
      const s = $("#pitch");
      const pt = s.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const q = pt.matrixTransform(s.getScreenCTM().inverse());
      const cl = clampPos(q.x, q.y);
      const curSlots = slots();
      curSlots[drag.from].x = cl.x;
      curSlots[drag.from].y = cl.y;
      update();
    } else if(drag.g){
      drag.g.style.left = e.clientX + "px";
      drag.g.style.top = e.clientY + "px";
    }
  }
});

function endDrag(e, cancel){
  if(!drag) return;
  const d = drag;
  drag = null;
  if(d.g) d.g.remove();
  if(cancel) return;

  if(d.moved){
    const s = $("#pitch");
    const pt = s.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const q = pt.matrixTransform(s.getScreenCTM().inverse());

    if(d.from !== null){
      // Selesai menggeser pemain di lapangan:
      // Cek apakah dilepas tepat di atas pemain lain (jarak < 4.5m) untuk saling tukar posisi
      let targetSlot = -1, minD = 4.5;
      slots().forEach((pos, i) => {
        if(i !== d.from){
          const dd = Math.hypot(pos.x - q.x, pos.y - q.y);
          if(dd < minD){ minD = dd; targetSlot = i; }
        }
      });

      if(targetSlot >= 0){
        // Tukar pemain di kedua slot
        const tmp = state.lineup[d.from];
        state.lineup[d.from] = state.lineup[targetSlot];
        state.lineup[targetSlot] = tmp;
      }
      refresh();
    } else {
      // Pemain dari daftar skuad dijatuhkan ke slot lapangan terdekat
      let best = -1, bd = 9;
      slots().forEach((c, i) => {
        const dd = Math.hypot(c.x - q.x, c.y - q.y);
        if(dd < bd){ bd = dd; best = i; }
      });
      if(best >= 0) assign(d.pid, best);
    }
  } else if(d.from !== null && Features[state.tab] && Features[state.tab].onNodeClick){
    // Klik biasa tanpa geser (misal memilih rute umpan Dijkstra di tab Graf)
    Features[state.tab].onNodeClick(d.from);
  }
}

document.addEventListener("pointerup", e => endDrag(e, false));
document.addEventListener("pointercancel", e => endDrag(e, true));
