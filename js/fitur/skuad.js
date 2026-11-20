Features.skuad={
  label:"Skuad",
  hint:"Tambah pemain baru atau hapus pemain. Jumlah kombinasi di tab Kombinasi ikut berubah.",
  html(){return `<h2>Kelola skuad</h2><p class="mut">Tambah pemain baru atau hapus pemain dari skuad. Skuad minimal 11 pemain. Jika starter dihapus, ia digantikan pemain cadangan.</p>
    <div class="row">
      <label>Nama<input type="text" id="pn" maxlength="30"></label>
      <label>No.<input type="number" id="pk" min="1" max="99"></label>
      <label>Posisi<select id="pl">${LN.map((n,i)=>`<option value="${i}">${n}</option>`).join("")}</select></label>
      <button id="add">Tambah pemain</button>
    </div>
    <p class="warn" id="msg"></p><div id="res"></div>`},
  update(res){
    res.innerHTML=`<p class="st">Total ${R.length} pemain. Starter ditandai.</p>`+LN.map((n,l)=>{
      const rows=R.map((r,i)=>r.l===l?`<div class="pl"><span>#${r.no} ${esc(r.n)} ${state.lineup.includes(i)?'<span class="st">(starter)</span>':""}</span><button data-del="${i}">Hapus</button></div>`:"").join("");
      return `<div class="rl"><b>${n} (${R.filter(r=>r.l===l).length})</b>${rows}</div>`}).join("");
  },
  onClick(e){
    const msg=$("#msg");
    if(e.target.id==="add"){
      const err=addPlayer($("#pn").value,parseInt($("#pk").value,10),+$("#pl").value);
      msg.textContent=err||"";
      if(!err){$("#pn").value="";$("#pk").value="";refresh()}
    }else if(e.target.dataset.del!==undefined){
      const err=removePlayer(+e.target.dataset.del);
      msg.textContent=err||"";
      if(!err)refresh();
    }
  }
};