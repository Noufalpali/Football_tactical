// Fitur 4: Papan Taktik Interaktif (Tactical Board Asli)
// Pemain dapat digeser bebas langsung di lapangan menggunakan mouse atau layar sentuh.
Features.formasi = {
  label: "Formasi",
  hint: "Geser pemain langsung di lapangan hijau untuk menyusun taktik, kedalaman garis, dan formasi bebas seperti papan taktik pelatih asli.",
  html(){
    return `<h2>Papan Taktik Formasi</h2>
    <p class="mut">Tarik dan geser lingkaran pemain di lapangan hijau ke posisi mana pun yang kamu inginkan. Kamu bisa membuat inverted fullback, sayap melebar, false nine, atau menaikkan garis pertahanan.</p>
    
    <div class="row">
      <span class="mut" style="font-weight:600">Pola Formasi:</span>
      ${Object.keys(F).map(k => `<button class="btn-fm" data-setfm="${k}">${k}</button>`).join(" ")}
    </div>

    <div class="row" style="margin:8px 0 14px">
      <button id="btn-reset">Atur Ulang Pola Baku</button>
      <button id="btn-ratakan">Ratakan Garis Lini</button>
      <button id="btn-maju">Garis Tinggi (+5m)</button>
      <button id="btn-mundur">Garis Rendah (-5m)</button>
    </div>

    <div id="res"></div>`;
  },
  update(res){
    const { kedalamanBek, panjangTim, lebarTim, gayaBertahan } = hitungMetrikTaktik();
    const p = slots();

    res.innerHTML = `
    <div class="tactic-grid">
      <div class="tactic-card">
        <span class="tc-label">Garis Pertahanan</span>
        <b class="tc-val">${kedalamanBek} m</b>
        <small class="tc-sub">${gayaBertahan}</small>
      </div>
      <div class="tactic-card">
        <span class="tc-label">Kerapatan Vertikal</span>
        <b class="tc-val">${panjangTim} m</b>
        <small class="tc-sub">Jarak Bek - Penyerang</small>
      </div>
      <div class="tactic-card">
        <span class="tc-label">Lebar Permainan</span>
        <b class="tc-val">${lebarTim} m</b>
        <small class="tc-sub">Bentangan Sayap Kiri-Kanan</small>
      </div>
    </div>

    <h3 style="margin:16px 0 6px;font-size:16px">Peran Taktis Pemain di Lapangan</h3>
    <table class="tactic-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Pemain</th>
          <th>Lini Alami</th>
          <th>Posisi / Peran di Papan</th>
        </tr>
      </thead>
      <tbody>
        ${p.map((q, i) => {
          const r = R[state.lineup[i]];
          const peran = deteksiPeranPemain(q, i);
          const off = r.l !== q.l;
          return `<tr>
            <td>#${r.no}</td>
            <td><b>${esc(r.n)}</b></td>
            <td><span class="chip-sm" style="background:${COL[r.l]}33;border:1px solid ${COL[r.l]}">${LN[r.l]}</span></td>
            <td>${peran} ${off ? '<span class="warn" title="Pemain di luar posisi alaminya">(posisi silang)</span>' : ''}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>`;
  },
  onClick(e){
    const target = e.target;
    // Pilihan formasi cepat
    if(target.dataset.setfm){
      state.fm = target.dataset.setfm;
      resetPos(state.fm);
      refresh();
      return;
    }

    // Reset posisi ke baku
    if(target.id === "btn-reset"){
      resetPos(state.fm);
      refresh();
      return;
    }

    // Ratakan garis lini (bek, gelandang, penyerang diratakan sumbu Y-nya)
    if(target.id === "btn-ratakan"){
      const p = slots();
      [1, 2, 3].forEach(l => {
        const liniSlots = p.slice(1).filter((_, i) => p[i + 1].l === l);
        if(liniSlots.length > 0){
          const avgY = liniSlots.reduce((acc, q) => acc + q.y, 0) / liniSlots.length;
          liniSlots.forEach(q => q.y = Math.round(avgY * 10) / 10);
        }
      });
      refresh();
      return;
    }

    // Dorong garis pertahanan maju (+5m ke arah gawang lawan, y berkurang)
    if(target.id === "btn-maju"){
      const p = slots();
      p.slice(1).forEach(q => {
        q.y = Math.max(12, Math.round((q.y - 5) * 10) / 10);
      });
      refresh();
      return;
    }

    // Tarik garis pertahanan mundur (-5m mendekat ke gawang sendiri, y bertambah)
    if(target.id === "btn-mundur"){
      const p = slots();
      p.slice(1).forEach(q => {
        q.y = Math.min(94, Math.round((q.y + 5) * 10) / 10);
      });
      refresh();
      return;
    }
  }
};
