// Fungsi bantu umum dan rumus kombinatorika
const $=s=>document.querySelector(s);
const fact=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r};
// Kombinasi C(n,k)
const C=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
const fmt=n=>n.toLocaleString("id-ID");
// Acak Fisher-Yates (mengubah array asli)
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
// Escape teks sebelum disisipkan ke innerHTML (nama pemain diketik pengguna)
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// Permutasi P(n,r) dengan BigInt agar angka besar (misal P(27,11)) tetap tepat
const PB=(n,r)=>{let x=1n;for(let i=0;i<r;i++)x*=BigInt(n-i);return x<0n?0n:x};