function draw(p,E,path){
  const on=new Set(path),pe=new Set();
  for(let i=1;i<path.length;i++)pe.add(Math.min(path[i-1],path[i])+"-"+Math.max(path[i-1],path[i]));
  let s=`<rect width="68" height="105" fill="#1e5a3c"/><g fill="none" stroke="#f4f7f2" stroke-opacity=".55" stroke-width=".4"><rect x="2" y="2" width="64" height="101"/><line x1="2" y1="52.5" x2="66" y2="52.5"/><circle cx="34" cy="52.5" r="9"/><rect x="13.5" y="2" width="41" height="16"/><rect x="13.5" y="87" width="41" height="16"/><rect x="24.5" y="2" width="19" height="5.5"/><rect x="24.5" y="97.5" width="19" height="5.5"/></g>`;
  E.forEach(([a,b])=>{const h=pe.has(a+"-"+b);
    s+=`<line x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}" stroke="${h?"#ffa94d":"#f4f7f2"}" stroke-opacity="${h?1:.35}" stroke-width="${h?1.3:.35}"/>`});
  p.forEach((q,i)=>{
    const r=R[state.lineup[i]],off=r.l!==q.l;
    s+=`<g data-slot="${i}" style="cursor:grab"><circle cx="${q.x}" cy="${q.y}" r="4.2" fill="${COL[r.l]}" stroke="${on.has(i)?"#ffa94d":"#0f2a1d"}" stroke-width="${on.has(i)?1.2:.5}"/>${off?`<circle cx="${q.x}" cy="${q.y}" r="5.4" fill="none" stroke="#ff5252" stroke-width=".7" stroke-dasharray="1.2 1"/>`:""}<text x="${q.x}" y="${q.y+1.4}" font-size="3.6" font-weight="700" text-anchor="middle" fill="#0f2a1d">${r.no}</text><text x="${q.x}" y="${q.y+8.6}" font-size="2.9" font-weight="600" text-anchor="middle" fill="#fff" stroke="#0f2a1d" stroke-width=".6" paint-order="stroke">${r.s}</text></g>`});
  $("#pitch").innerHTML=s;
}
