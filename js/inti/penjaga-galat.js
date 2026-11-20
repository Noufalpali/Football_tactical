// Menampilkan galat JavaScript di halaman agar mudah dilaporkan (tidak diam-diam gagal)
function tampilkanGalat(pesan){
  let b=document.getElementById("galat");
  if(!b){
    b=document.createElement("div");b.id="galat";
    b.style.cssText="position:fixed;left:8px;right:8px;bottom:8px;z-index:99;background:#a50044;color:#fff;padding:10px 14px;border-radius:8px;font:14px/1.4 system-ui,sans-serif";
    document.body.appendChild(b);
  }
  b.textContent="Terjadi galat: "+pesan+" (salin pesan ini untuk dilaporkan)";
}
window.addEventListener("error",e=>tampilkanGalat(e.message));
window.addEventListener("unhandledrejection",e=>tampilkanGalat(String(e.reason)));