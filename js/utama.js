// Penghubung: render tab, pilih formasi, dan sinkronkan lapangan, daftar, dan panel
function render(){
  $("#forms").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===state.fm));
  $("#tabs").innerHTML=Object.entries(Features).map(([k,f])=>`<button role="tab" data-t="${k}" aria-selected="${k===state.tab}">${f.label}</button>`).join("");
  const f=Features[state.tab];
  $("#body").innerHTML=f.html();
  $("#hint").textContent=f.hint;
  renderRoster();update();
}
// Hitung ulang panel aktif; fitur tanpa gambar sendiri memakai lapangan polos
function update(){
  const f=Features[state.tab];
  f.update($("#res"));
  if(!f.drawsPitch)draw(slots(),[],[]);
}
// Dipanggil setelah lineup berubah
function refresh(){renderRoster();update()}

Object.keys(F).forEach(k=>{const b=document.createElement("button");b.textContent=k;b.dataset.f=k;$("#forms").appendChild(b)});
$("#forms").addEventListener("click",e=>{const k=e.target.dataset.f;if(k){state.fm=k;auto();render()}});
$("#tabs").addEventListener("click",e=>{const t=e.target.dataset.t;if(t){state.tab=t;render()}});
$("#body").addEventListener("input",update);
$("#body").addEventListener("click",e=>{try{const f=Features[state.tab];if(f.onClick)f.onClick(e)}catch(err){tampilkanGalat(err.message)}});
auto();render();