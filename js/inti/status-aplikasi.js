// Status aplikasi, slot posisi per formasi, kelola skuad, dan registri fitur
// shift: dy = geser garis maju (+) / mundur (-) untuk bek, gelandang, penyerang; dx = geser kiri/kanan; w = lebar formasi
const state={fm:"4-3-3",tab:"kom",A:0,B:10,nextA:false,lineup:[],shift:{dy:[0,0,0],dx:0,w:1}};
const Features={}; // tiap fitur mendaftar di js/fitur/*.js

// Koordinat 11 slot untuk formasi aktif (lapangan 68 x 105), sudah memperhitungkan geseran
function slots(){
  const{dy,dx,w}=state.shift,ys=[76,54,30],o=[{x:34,y:95,l:0}];
  F[state.fm].forEach((c,i)=>{for(let j=0;j<c;j++){
    const x=34+(68*(j+1)/(c+1)-34)*w+dx,y=ys[i]-dy[i];
    o.push({x:Math.min(63,Math.max(5,x)),y:Math.min(93,Math.max(8,y)),l:i+1});
  }});
  return o;
}
// Susunan otomatis: pemain pertama tiap lini menurut urutan di data-pemain.js.
// Jika satu lini kekurangan pemain, slot diisi pemain lain yang belum terpakai.
function auto(){
  const S=slots(),used=new Set(),L=[],idx=R.map((r,i)=>i);
  S.forEach((s,k)=>{const c=idx.find(i=>R[i].l===s.l&&!used.has(i));if(c!==undefined){used.add(c);L[k]=c}});
  S.forEach((s,k)=>{if(L[k]===undefined){const c=idx.find(i=>!used.has(i));used.add(c);L[k]=c}});
  state.lineup=L;
  state.A=0;state.B=L.length-1;state.nextA=false;
}
// Jumlah starter yang berada di luar posisi alaminya
function offCount(){return slots().filter((q,i)=>R[state.lineup[i]].l!==q.l).length}

// Tambah pemain; mengembalikan pesan galat, atau null jika berhasil
function addPlayer(n,no,l){
  n=n.trim().slice(0,30);
  if(!n)return"Nama pemain wajib diisi.";
  if(!Number.isInteger(no)||no<1||no>99)return"Nomor punggung harus bilangan bulat 1 sampai 99.";
  if(R.some(r=>r.no===no))return"Nomor "+no+" sudah dipakai pemain lain.";
  const w=n.split(/\s+/);
  R.push({n,s:w.length>1?w[0][0]+". "+w[w.length-1]:n,l,no});
  return null;
}
// Hapus pemain ke-i; starter yang dihapus digantikan pemain cadangan (lini sama didahulukan)
function removePlayer(i){
  if(R.length<=11)return"Skuad minimal 11 pemain.";
  const was=state.lineup.indexOf(i);
  if(was>=0){
    const bench=R.map((r,k)=>k).filter(k=>k!==i&&!state.lineup.includes(k));
    const same=bench.find(k=>R[k].l===slots()[was].l);
    state.lineup[was]=same!==undefined?same:bench[0];
  }
  R.splice(i,1);
  state.lineup=state.lineup.map(k=>k>i?k-1:k);
  return null;
}

// Ringkasan skuad aktif + tombol pindah ke tab Skuad (dipakai tab Kombinasi dan Permutasi)
function skuadInfo(){
  const c=[0,1,2,3].map(l=>R.filter(x=>x.l===l).length);
  return `<p class="mut">Skuad saat ini: <b>${R.length} pemain</b> (${c.map((n,i)=>n+" "+LN[i].toLowerCase()).join(", ")}). <button id="goSkuad">Tambah atau hapus pemain</button></p>`;
}