const $=s=>document.querySelector(s);
const fact=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r};
const C=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
const fmt=n=>n.toLocaleString("id-ID");
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const PB=(n,r)=>{let x=1n;for(let i=0;i<r;i++)x*=BigInt(n-i);return x<0n?0n:x};