const state = {
  fm: "4-3-3",
  tab: "kom",
  A: 0,
  B: 10,
  nextA: false,
  lineup: [],
  pos: null
};
const Features = {}; 

function defaultSlots(fm = state.fm){
  const pattern = F[fm] || [4, 3, 3];
  const numLines = pattern.length;
  const ys = numLines === 4 ? [78, 62, 44, 26] : [76, 54, 30];
  const o = [{ x: 34, y: 95, l: 0 }]; 
  pattern.forEach((c, i) => {
    const lineL = i === 0 ? 1 : (i === pattern.length - 1 ? 3 : 2);
    for (let j = 0; j < c; j++) {
      o.push({
        x: Math.round(68 * (j + 1) / (c + 1) * 10) / 10,
        y: ys[i] || (80 - i * 22),
        l: lineL
      });
    }
  });
  return o;
}

function clampPos(x, y){
  return {
    x: Math.max(5, Math.min(63, Math.round(x * 10) / 10)),
    y: Math.max(8, Math.min(97, Math.round(y * 10) / 10))
  };
}

function slots(){
  if(!state.pos || state.pos.length !== 11){
    state.pos = defaultSlots(state.fm);
  }
  return state.pos;
}

function resetPos(fm = state.fm){
  state.fm = fm;
  state.pos = defaultSlots(fm);
}

function auto(){
  state.pos = defaultSlots(state.fm);
  const S = state.pos, used = new Set(), L = [], idx = R.map((r, i) => i);
  S.forEach((s, k) => {
    const c = idx.find(i => R[i].l === s.l && !used.has(i));
    if (c !== undefined) { used.add(c); L[k] = c; }
  });
  S.forEach((s, k) => {
    if (L[k] === undefined) {
      const c = idx.find(i => !used.has(i));
      used.add(c); L[k] = c;
    }
  });
  state.lineup = L;
  state.A = 0; state.B = L.length - 1; state.nextA = false;
}

function offCount(){
  return slots().filter((q, i) => R[state.lineup[i]].l !== q.l).length;
}

function hitungMetrikTaktik(){
  const p = slots();
  const bek = p.slice(1).filter((_, i) => R[state.lineup[i + 1]].l === 1 || p[i + 1].l === 1);
  const avgBekY = bek.length ? bek.reduce((acc, q) => acc + q.y, 0) / bek.length : 76;
  const kedalamanBek = Math.round((105 - avgBekY) * 10) / 10; // Jarak dari garis gawang sendiri (y = 105)

  const ysOutfield = p.slice(1).map(q => q.y);
  const minY = Math.min(...ysOutfield), maxY = Math.max(...ysOutfield);
  const panjangTim = Math.round((maxY - minY) * 10) / 10; // Kerapatan jarak bek terdalam ke penyerang terdepan

  const xsOutfield = p.slice(1).map(q => q.x);
  const minX = Math.min(...xsOutfield), maxX = Math.max(...xsOutfield);
  const lebarTim = Math.round((maxX - minX) * 10) / 10; // Jarak bentangan horizontal sayap kiri ke kanan

  let gayaBertahan = "Mid Block (Sedang)";
  if (kedalamanBek >= 35) gayaBertahan = "High Pressing (Garis Tinggi)";
  else if (kedalamanBek <= 23) gayaBertahan = "Low Block (Pertahanan Dalam)";

  return { kedalamanBek, panjangTim, lebarTim, gayaBertahan };
}

function deteksiPeranPemain(q, i){
  const r = R[state.lineup[i]];
  if (i === 0 || q.l === 0) {
    return q.y < 90 ? "Sweeper Keeper" : "Kiper Garis";
  }
  if (q.y >= 68) {
    if (q.x <= 16) return "Bek Sayap Kiri (LB/LWB)";
    if (q.x >= 52) return "Bek Sayap Kanan (RB/RWB)";
    return "Bek Tengah (CB)";
  }
  if (q.y >= 44) {
    if (q.x <= 16) return "Gelandang Sayap Kiri (LM)";
    if (q.x >= 52) return "Gelandang Sayap Kanan (RM)";
    if (q.y >= 58) return "Gelandang Bertahan (DM/Pivot)";
    return "Gelandang Tengah (CM)";
  }
  if (q.x <= 18) return "Penyerang Sayap Kiri (LW)";
  if (q.x >= 50) return "Penyerang Sayap Kanan (RW)";
  if (q.y >= 32) return "Gelandang Serang / False 9 (AM)";
  return "Penyerang Tengah (CF/ST)";
}
function addPlayer(n, no, l){
  n = n.trim().slice(0, 30);
  if (!n) return "Nama pemain wajib diisi.";
  if (!Number.isInteger(no) || no < 1 || no > 99) return "Nomor punggung harus bilangan bulat 1 sampai 99.";
  if (R.some(r => r.no === no)) return "Nomor " + no + " sudah dipakai pemain lain.";
  const w = n.split(/\s+/);
  R.push({ n, s: w.length > 1 ? w[0][0] + ". " + w[w.length - 1] : n, l, no });
  return null;
}
function removePlayer(i){
  if (R.length <= 11) return "Skuad minimal 11 pemain.";
  const was = state.lineup.indexOf(i);
  if (was >= 0) {
    const bench = R.map((r, k) => k).filter(k => k !== i && !state.lineup.includes(k));
    const same = bench.find(k => R[k].l === slots()[was].l);
    state.lineup[was] = same !== undefined ? same : bench[0];
  }
  R.splice(i, 1);
  state.lineup = state.lineup.map(k => k > i ? k - 1 : k);
  return null;
}
function skuadInfo(){
  const c = [0, 1, 2, 3].map(l => R.filter(x => x.l === l).length);
  return `<p class="mut">Skuad saat ini: <b>${R.length} pemain</b> (${c.map((n, i) => n + " " + LN[i].toLowerCase()).join(", ")}). <button id="goSkuad">Tambah atau hapus pemain</button></p>`;
}
