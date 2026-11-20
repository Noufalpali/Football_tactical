function dijkstra(p,E,s){
  const m=p.length,dist=Array(m).fill(Infinity),prev=Array(m).fill(-1),done=Array(m).fill(false);
  dist[s]=0;
  for(let k=0;k<m;k++){
    let u=-1;for(let i=0;i<m;i++)if(!done[i]&&(u<0||dist[i]<dist[u]))u=i;
    if(dist[u]===Infinity)break;done[u]=true;
    E.forEach(([a,b,d])=>{const v=a===u?b:b===u?a:-1;if(v>=0&&dist[u]+d<dist[v]){dist[v]=dist[u]+d;prev[v]=u}});
  }
  return{dist,prev};
}
// Sisi: pasangan pemain dengan jarak <= ambang; ambang dinaikkan sampai graf terhubung
function buildGraph(){
  const p=slots(),m=p.length;let E;
  for(let t=26;t<=200;t+=2){
    E=[];
    for(let i=0;i<m;i++)for(let j=i+1;j<m;j++){const d=Math.hypot(p[i].x-p[j].x,p[i].y-p[j].y);if(d<=t)E.push([i,j,d])}
    if(dijkstra(p,E,0).dist.every(isFinite))break;
  }
  return{p,E};
}
Features.graf={
  label:"Graf",
  drawsPitch:true,
  hint:"Klik pemain untuk memilih asal dan tujuan umpan. Pemain juga bisa diseret untuk bertukar posisi.",
  html(){return `<h2>Jaringan umpan sebagai graf</h2><p class="mut">Setiap pemain adalah simpul, dan dua pemain yang berdekatan dihubungkan sisi berbobot (jarak dalam meter). Klik dua pemain di lapangan untuk mencari jalur umpan terpendek dengan algoritma Dijkstra.</p><div id="res"></div>`},
  update(res){
    const{p,E}=buildGraph(),{A,B}=state,r=dijkstra(p,E,A);let path=[];
    if(B!=null)for(let v=B;v>=0;v=r.prev[v])path.unshift(v);
    draw(p,E,path);
    const nm=i=>esc(R[state.lineup[i]].s);
    const deg=p.map((_,i)=>E.filter(e=>e[0]===i||e[1]===i).length);
    const top=deg.map((d,i)=>[d,i]).sort((a,b)=>b[0]-a[0]).slice(0,3),V=p.length;
    res.innerHTML=`<div class="f">|V| = ${V}, |E| = ${E.length}, kepadatan = ${(2*E.length/(V*(V-1))).toFixed(2)}</div>
    <p><b>Jalur umpan:</b> ${nm(A)} ke ${B==null?"…":nm(B)}</p>
    ${B==null?`<p class="mut">Pilih pemain tujuan di lapangan.</p>`:`<div class="big">${r.dist[B].toFixed(1)} m</div><p>${path.map(nm).join(" → ")} (${path.length-1} umpan)</p>`}
    <p style="margin-top:14px"><b>Pemain paling sentral (derajat tertinggi)</b></p>
    <table>${top.map(([d,i])=>`<tr><td>${nm(i)}</td><td>${LN[p[i].l]}</td><td>${d} koneksi</td></tr>`).join("")}</table>`;
  },
  // Klik simpul: bergantian memilih tujuan lalu asal
  onNodeClick(i){
    if(state.nextA){state.A=i;state.B=null}else{state.B=i}
    state.nextA=!state.nextA;refresh();
  }
};