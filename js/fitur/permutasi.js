// Fitur 2: Permutasi, urutan dan penempatan posisi (urutan penting). Ikut berubah saat skuad diubah.
Features.per={
  label:"Permutasi",
  hint:"Seret pemain dari daftar ke lapangan, atau seret antarpemain untuk bertukar posisi. Garis putus-putus merah berarti pemain di luar posisi alaminya.",
  html(){return `<h2>Urutan dan posisi</h2><p class="mut">Di sini urutan penting: siapa di posisi mana, dan siapa menendang penalti pertama. Angka di bawah ikut berubah saat jumlah pemain di skuad berubah.</p>
    <div class="row"><button id="rnd">Acak susunan</button><button id="rst">Susun otomatis</button></div>
    <label>Jumlah penendang penalti: <b id="rv">5</b><input type="range" id="r" min="1" max="11" value="5"></label><div id="res"></div>
    <div class="row"><button id="sh">Acak urutan penendang</button></div><div id="shuf"></div>`},
  update(res){
    const L=F[state.fm],N=R.length,r=+$("#r").value;$("#rv").textContent=r;
    const cnt=[0,1,2,3].map(l=>R.filter(x=>x.l===l).length),need=[1,...L];
    const lini=need.map((k,i)=>PB(cnt[i],k)),prodLini=lini.reduce((a,b)=>a*b,1n);
    res.innerHTML=`${skuadInfo()}
    <div class="f">P(${N},11) = ${N}! / ${N-11}!</div><div class="big">${fmt(PB(N,11))}</div>
    <p class="mut">cara menempatkan 11 pemain dari ${N} pemain skuad ke 11 posisi yang berbeda, jika pemain boleh di posisi mana pun.</p>
    <div class="f">${need.map((k,i)=>`P(${cnt[i]},${k})`).join(" × ")}<br>= ${lini.map(fmt).join(" × ")}</div><div class="big">${fmt(prodLini)}</div>
    <p class="mut">cara menempatkan pemain pada posisi alaminya, dengan urutan kiri ke kanan dalam tiap lini diperhatikan. ${prodLini===0n?'<span class="warn">Ada lini yang kekurangan pemain.</span>':""}</p>
    <div class="f">P(11,${r}) = 11! / ${11-r}! = ${fmt(PB(11,r))}</div><p class="mut">urutan ${r} penendang penalti dari 11 starter. Jika seluruh ${N} pemain boleh menendang: P(${N},${r}) = ${fmt(PB(N,r))}.</p>
    <div class="f">11! = ${fmt(fact(11))}</div><p class="mut">cara menempatkan 11 starter yang sudah terpilih ke 11 posisi berbeda. Saat ini ${offCount()} pemain di luar posisi alaminya.</p>
    <div class="f">10! / (${L.map(x=>x+"!").join(" × ")}) = ${fmt(fact(10)/L.reduce((a,x)=>a*fact(x),1))}</div><p class="mut">cara membagi 10 pemain lapangan ke tiga lini ${state.fm} jika pemain dalam satu lini dianggap sama (permutasi dengan unsur sama).</p>`;
  },
  onClick(e){
    const id=e.target.id;
    if(id==="goSkuad"){state.tab="skuad";render()}
    else if(id==="sh"){
      const r=+$("#r").value,a=shuffle([...state.lineup]);
      $("#shuf").innerHTML=a.slice(0,r).map((n,i)=>`<span class="chip">${i+1}. ${esc(R[n].s)}</span>`).join("");
    }else if(id==="rnd"){shuffle(state.lineup);refresh()}
    else if(id==="rst"){auto();refresh()}
  }
};