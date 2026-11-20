// Fitur 4: Geser formasi (garis naik/turun, kiri/kanan, lebar). Perubahan memengaruhi jarak di tab Graf.
const SLIDER=[
  ["sy0","Garis bek",-14,14,1,"mundur","maju"],
  ["sy1","Garis gelandang",-14,14,1,"mundur","maju"],
  ["sy2","Garis penyerang",-14,14,1,"mundur","maju"],
  ["sx","Geser seluruh formasi",-14,14,1,"kiri","kanan"],
  ["sw","Lebar formasi",0.6,1.2,0.05,"sempit","lebar"]
];
function nilaiSlider(id){
  const s=state.shift;
  return id==="sx"?s.dx:id==="sw"?s.w:s.dy[+id[2]];
}
Features.formasi={
  label:"Formasi",
  hint:"Geser garis dan lebar formasi dengan slider. Susunan pemain tetap, hanya posisi slot yang berubah.",
  html(){return `<h2>Geser formasi</h2><p class="mut">Majukan atau mundurkan tiap garis, geser seluruh formasi ke kiri atau kanan, dan atur lebarnya. Jarak antarpemain berubah, sehingga graf umpan di tab Graf ikut berubah.</p>`+
    SLIDER.map(([id,t,a,b,st,l,r])=>`<div class="sl"><label>${t}: <b id="v_${id}"></b><input type="range" id="${id}" min="${a}" max="${b}" step="${st}" value="${nilaiSlider(id)}"></label><small>← ${l} · ${r} →</small></div>`).join("")+
    `<div class="row"><button id="rs">Kembalikan formasi</button></div><div id="res"></div>`},
  update(res){
    const g=id=>+$("#"+id).value;
    state.shift={dy:[g("sy0"),g("sy1"),g("sy2")],dx:g("sx"),w:g("sw")};
    SLIDER.forEach(([id])=>{const v=g(id);$("#v_"+id).textContent=id==="sw"?"×"+v.toFixed(2):(v>0?"+":"")+v+" m"});
    const{E}=buildGraph(),V=slots().length;
    res.innerHTML=`<div class="f">|E| = ${E.length}, kepadatan graf = ${(2*E.length/(V*(V-1))).toFixed(2)}</div><p class="mut">Setelah digeser, graf umpan memiliki ${E.length} sisi. Buka tab Graf untuk melihat jalur umpan terpendek yang baru.</p>`;
  },
  onClick(e){
    if(e.target.id==="rs"){state.shift={dy:[0,0,0],dx:0,w:1};render()}
  }
};