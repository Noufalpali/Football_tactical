function renderRoster(){
  $("#roster").innerHTML=`<b>Skuad (${R.length} pemain)</b> <span class="mut">biru = starter</span>`+
    LN.map((n,l)=>`<div class="rl"><span class="mut">${n}</span><br>${R.map((r,i)=>r.l===l?`<span class="pc${state.lineup.includes(i)?" on":""}" data-pid="${i}">${r.n}</span>`:"").join("")}</div>`).join("");
}
