# Papan Taktik Sepakbola: Matematika Diskrit

Buka `index.html` di browser (tidak perlu server).

## Struktur File

```
Football_tactical/
│
├── index.html                  ← Halaman utama aplikasi
│
├── css/                        ← Semua gaya tampilan
│   ├── dasar.css               ← Warna, tipografi, elemen umum
│   ├── tata-letak.css          ← Grid halaman, panel, tab
│   ├── lapangan.css            ← Lapangan SVG dan efek drag
│   ├── daftar-pemain.css       ← Chip nama pemain di skuad
│   └── formulir.css            ← Form tambah pemain & slider formasi
│
└── js/                         ← Semua logika JavaScript
    │
    ├── inti/                   ← Fondasi aplikasi (dimuat pertama)
    │   ├── penjaga-galat.js    ← Penangkap & penampil galat JS
    │   ├── data-pemain.js      ← Data formasi & skuad
    │   ├── fungsi-bantu.js     ← C(n,k), faktorial, P(n,r), pengacak
    │   └── status-aplikasi.js  ← State, posisi slot, logika skuad
    │
    ├── komponen/               ← Komponen antarmuka
    │   ├── gambar-lapangan.js  ← Render lapangan SVG
    │   ├── daftar-skuad.js     ← Render chip daftar pemain
    │   └── seret-lepas.js      ← Interaksi seret & lepas pemain
    │
    ├── fitur/                  ← Satu file per tab materi & alat
    │   ├── kombinasi.js        ← Tab Kombinasi (C(n,k))
    │   ├── permutasi.js        ← Tab Permutasi (P(n,r), n!)
    │   ├── graf.js             ← Tab Graf (Dijkstra)
    │   ├── formasi.js          ← Tab Formasi (geser garis & lebar)
    │   └── skuad.js            ← Tab Skuad (kelola tambah/hapus pemain)
    │
    └── utama.js                ← Penghubung semua komponen
```

## Menambah Fitur Baru

Buat file `js/fitur/nama-fitur.js` yang mengisi:

```js
Features.kunci = {
  label: "Nama Tab",
  hint:  "Petunjuk yang muncul di bawah lapangan.",
  html()   { return `<div id="res"></div>` },
  update(res) { res.innerHTML = "..." }
};
```

Lalu tambahkan `<script src="js/fitur/nama-fitur.js"></script>` di `index.html` sebelum `utama.js`.
