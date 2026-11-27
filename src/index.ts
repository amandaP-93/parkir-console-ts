// ===== BAGIAN 1: IMPOR DAN INPUT =====
// Impor modul readline bawaan Node.js untuk membaca input terminal
import * as readline from "readline";
// Deklarasi lokal agar tetap bisa dikompilasi tanpa global type definitions Node.js
declare const process: { stdin: any; stdout: any };
// Membuat antarmuka baca dari keyboard dan tulis ke layar
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// ===== BAGIAN 2: KONSTANTA DAN TIPE DATA =====
// Data tarif tiap jenis kendaraan (const karena nilainya tetap); indeks 0 = jenis 1
const JENIS: { nama: string; base: number; tambah: number }[] = [
  { nama: "Motor", base: 2000, tambah: 2000 }, // jenis 1
  { nama: "Mobil", base: 5000, tambah: 3000 }, // jenis 2
  { nama: "Truk", base: 8000, tambah: 4000 }, // jenis 3
];
// Data metode pembayaran beserta persen biaya tambahan (const karena tetap)
const METODE: { label: string; nama: string; persen: number }[] = [
  { label: "Tunai (Cash)", nama: "Tunai", persen: 0 }, // pilihan 1
  { label: "E-Money (+2%)", nama: "E-Money", persen: 2 }, // pilihan 2
  { label: "Kartu Kredit (+5%)", nama: "Kartu Kredit", persen: 5 }, // pilihan 3
];

// Bentuk data satu kendaraan yang sedang parkir
interface Kendaraan {
  id: number; // nomor unik
  nama: string; // nama pengendara
  plat: string; // plat nomor
  jenis: number; // 1 = Motor, 2 = Mobil, 3 = Truk
  isMember: boolean; // true kalau member
  jamMasuk: number; // jam masuk (0 - 23)
}
// Bentuk data satu transaksi yang sudah dibayar
interface Transaksi {
  nama: string; // nama pengendara
  plat: string; // plat nomor
  jenis: string; // nama jenis kendaraan
  durasi: number; // lama parkir (jam)
  metode: string; // metode pembayaran
  totalAkhir: number; // total yang dibayar
}

// Array kendaraan yang sedang parkir, berisi 5 data awal (seed)
const daftarParkir: Kendaraan[] = [
  { id: 1, nama: "Budi Santoso", plat: "N 1234 AB", jenis: 1, isMember: true, jamMasuk: 8 },
  { id: 2, nama: "Siti Aminah", plat: "N 5678 CD", jenis: 2, isMember: false, jamMasuk: 9 },
  { id: 3, nama: "Joko Prasetyo", plat: "L 9012 EF", jenis: 3, isMember: false, jamMasuk: 7 },
  { id: 4, nama: "Dewi Anggraini", plat: "N 3456 GH", jenis: 1, isMember: false, jamMasuk: 10 },
  { id: 5, nama: "Agus Setiawan", plat: "AB 7788 IJ", jenis: 2, isMember: true, jamMasuk: 6 },
];
// Array riwayat transaksi, awalnya kosong
const riwayat: Transaksi[] = [];
// Penghitung id berikutnya (let karena nilainya bertambah)
let idBerikutnya: number = 6;

// ===== BAGIAN 3: FUNGSI INPUT DAN VALIDASI (semua memakai looping) =====
// Membungkus rl.question menjadi Promise supaya bisa memakai await
function tanya(pertanyaan: string): Promise<string> {
  return new Promise((resolve) => rl.question(pertanyaan, resolve)); // selesai saat user menekan Enter
}

// Mengulang pertanyaan sampai teks tidak kosong
async function tanyaTeks(pertanyaan: string): Promise<string> {
  let teks: string = ""; // jawaban, awalnya kosong supaya loop berjalan
  while (teks === "") { // ulangi selama masih kosong
    teks = (await tanya(pertanyaan)).trim(); // baca dan buang spasi ujung
    if (teks === "") console.log("Tidak boleh kosong!"); // beri tahu user
  }
  return teks; // teks valid
}

// Mengulang sampai user mengisi angka bulat min-max; kalau opsional, Enter = lewati (undefined)
async function tanyaAngka(p: string, min: number, max: number, opsional: boolean = false): Promise<number | undefined> {
  while (true) { // ulangi sampai ada hasil valid
    const input: string = (await tanya(p)).trim(); // baca input
    if (opsional && input === "") return undefined; // dilewati
    const angka: number = Number(input); // ubah ke angka
    if (input !== "" && Number.isInteger(angka) && angka >= min && angka <= max) return angka; // valid
    // Tidak valid: tampilkan pesan lalu loop mengulang
    console.log(`Input tidak valid! Masukkan angka bulat ${min} - ${max}${opsional ? ", atau Enter untuk melewati" : ""}.`);
  }
}

// Mengulang sampai user mengetik y atau n (do...while); kalau opsional, Enter = lewati (undefined)
async function tanyaYaTidak(pertanyaan: string, opsional: boolean = false): Promise<boolean | undefined> {
  let jawab: string = ""; // jawaban user
  do { // pertanyaan pasti diajukan minimal sekali
    jawab = (await tanya(pertanyaan)).trim().toLowerCase(); // baca, rapikan, huruf kecil
    if (opsional && jawab === "") return undefined; // dilewati
    if (jawab !== "y" && jawab !== "n") console.log(`Ketik y atau n saja${opsional ? ", atau Enter untuk melewati" : ""}!`);
  } while (jawab !== "y" && jawab !== "n"); // ulangi kalau bukan y/n
  return jawab === "y"; // true kalau y
}

// Mengulang sampai plat valid dan belum dipakai kendaraan lain; platLama diisi saat edit (Enter = tetap)
async function tanyaPlat(pertanyaan: string, idSendiri: number, platLama?: string): Promise<string> {
  while (true) { // ulangi sampai valid
    const plat: string = (await tanya(pertanyaan)).trim().toUpperCase(); // plat selalu huruf besar
    if (plat === "" && platLama !== undefined) return platLama; // mode edit: lewati
    if (plat === "") console.log("Plat tidak boleh kosong!"); // plat kosong ditolak
    else if (daftarParkir.some((k) => k.plat === plat && k.id !== idSendiri)) console.log("Plat sudah terdaftar di area parkir!"); // plat ganda ditolak
    else return plat; // plat valid
  }
}

// ===== BAGIAN 4: FUNGSI BANTU TAMPILAN DAN PENCARIAN =====
// Mengubah kode jenis (1/2/3) menjadi nama jenis
function namaJenis(jenis: number): string {
  return JENIS[jenis - 1]?.nama ?? "Tidak diketahui"; // kode di luar 1-3 dianggap tidak dikenal
}

// Mengubah angka menjadi format rupiah, contoh: "Rp 12.000"
function formatRupiah(angka: number): string {
  return "Rp " + Math.round(angka).toLocaleString("id-ID"); // bulatkan lalu beri titik ribuan
}

// Menampilkan pilihan jenis kendaraan lalu meminta pilihan 1-3
async function tanyaJenis(): Promise<number> {
  console.log("\nPilih Jenis Kendaraan:"); // judul pilihan
  // forEach: cetak tiap jenis beserta tarifnya
  JENIS.forEach((j, i) =>
    console.log(`${i + 1}. ${j.nama.padEnd(5)} (${formatRupiah(j.base)} / jam ke-1, ${formatRupiah(j.tambah)} / jam berikutnya)`)
  );
  return (await tanyaAngka("Pilihan kendaraan (1-3): ", 1, 3)) as number; // pilihan sudah pasti valid
}

// Mencetak daftar kendaraan dalam bentuk tabel rapi
function cetakTabel(data: Kendaraan[]): void {
  const garis: string = "=".repeat(62); // garis pemisah
  console.log("\n" + garis); // garis atas
  console.log("ID".padEnd(5) + "Plat".padEnd(13) + "Nama".padEnd(19) + "Jenis".padEnd(8) + "Status".padEnd(12) + "Masuk"); // judul kolom
  console.log(garis);
  // for...of: cetak satu baris untuk tiap kendaraan
  for (const k of data) {
    const status: string = k.isMember ? "Member" : "Non-member"; // teks status member
    console.log(String(k.id).padEnd(5) + k.plat.padEnd(13) + k.nama.padEnd(19) + namaJenis(k.jenis).padEnd(8) + status.padEnd(12) + `${k.jamMasuk}:00`);
  }
  console.log(garis); // garis bawah
  console.log(`Total: ${data.length} kendaraan`); // jumlah data
}

// Mencetak detail lengkap satu kendaraan
function cetakDetail(k: Kendaraan): void {
  console.log("\n--- DETAIL KENDARAAN ---");
  console.log(`ID     : ${k.id}\nNama   : ${k.nama}\nPlat   : ${k.plat}\nJenis  : ${namaJenis(k.jenis)}`);
  console.log(`Member : ${k.isMember ? "Ya" : "Tidak"}\nMasuk  : jam ${k.jamMasuk}:00`);
}

// Menampilkan daftar, meminta ID, lalu mencari datanya dengan find
async function pilihKendaraanById(): Promise<Kendaraan | undefined> {
  if (daftarParkir.length === 0) { // data kosong: beri pesan lalu berhenti
    console.log("Belum ada kendaraan yang parkir.");
    return undefined;
  }
  cetakTabel(daftarParkir); // tampilkan semua data agar user tahu ID yang ada
  const id = (await tanyaAngka("Masukkan ID kendaraan: ", 1, 999999)) as number; // minta ID
  const k: Kendaraan | undefined = daftarParkir.find((item) => item.id === id); // cari data yang cocok
  if (k === undefined) console.log(`Kendaraan dengan ID ${id} tidak ditemukan!`); // pesan kalau tidak ada
  return k; // bisa undefined
}

// Menghapus data berdasarkan id memakai findIndex dan splice; true kalau berhasil
function hapusById(id: number): boolean {
  const index: number = daftarParkir.findIndex((k) => k.id === id); // posisi data, -1 kalau tidak ada
  if (index === -1) return false; // tidak ditemukan
  daftarParkir.splice(index, 1); // hapus 1 data pada posisi tersebut
  return true; // berhasil
}

// ===== BAGIAN 5: PERHITUNGAN TARIF, DURASI, DAN PEMBAYARAN =====
// Menghitung durasi parkir (jam); lewat tengah malam ditambah 24, minimal 1 jam
function hitungDurasi(jamMasuk: number, jamKeluar: number): number {
  let durasi: number = jamKeluar - jamMasuk; // selisih jam
  if (durasi < 0) durasi += 24; // negatif berarti melewati tengah malam
  return durasi === 0 ? 1 : durasi; // durasi 0 tetap dihitung 1 jam
}

// Menghitung total biaya parkir sesuai jenis, durasi, dan status member
function hitungTarif(jenis: number, durasi: number, isMember: boolean): number {
  const t = JENIS[jenis - 1]; // tarif jenis kendaraan
  if (t === undefined) { // jenis tidak dikenal
    console.log("Jenis kendaraan tidak valid!");
    return 0;
  }
  let total: number = t.base + (durasi - 1) * t.tambah; // jam pertama + jam berikutnya
  // switch: aturan khusus tiap jenis kendaraan (3 case + default)
  switch (jenis) {
    case 1: // Motor: member parkir > 1 jam dapat diskon
      if (isMember && durasi > 1) { // if dengan 2 kondisi
        let persenDiskon: number = 10; // diskon awal 10%
        if (durasi >= 5) { // if bersarang level 3: di dalam if, di dalam switch
          console.log("[Diskon Member Spesial] Parkir >= 5 jam dapat potongan 20%!");
          persenDiskon = 20; // parkir 5 jam atau lebih: diskon 20%
        } else {
          console.log("[Diskon Member] Parkir > 1 jam dapat potongan 10%!");
        }
        total -= (total * persenDiskon) / 100; // kurangi potongan dari biaya normal
      }
      break;
    case 2: // Mobil: bonus voucher untuk member atau parkir >= 5 jam
      if (durasi > 1 && (isMember || !(durasi < 5))) { // operator && , || , dan !
        console.log("[Bonus] Member atau parkir >= 5 jam mendapat voucher cuci mobil.");
      }
      break;
    case 3: // Truk: beri catatan kalau durasi ganjil (modulus)
      if (durasi > 1 && durasi % 2 !== 0) console.log("[Catatan] Durasi parkir ganjil.");
      break;
    default: // jenis lain tidak punya aturan khusus
      break;
  }
  return Math.round(total); // bulatkan ke rupiah terdekat
}

// Memproses pembayaran sampai lunas; mengembalikan null kalau dibatalkan
async function prosesPembayaran(totalBiaya: number): Promise<{ metode: string; totalAkhir: number } | null> {
  console.log("\nPilih Metode Pembayaran:");
  METODE.forEach((m, i) => console.log(`${i + 1}. ${m.label}`)); // tampilkan pilihan metode
  const pilihan = (await tanyaAngka("Pilihan pembayaran (1-3): ", 1, 3)) as number; // minta pilihan 1-3
  const metode = METODE[pilihan - 1]!; // metode terpilih (pasti ada karena sudah divalidasi)

  let tambahan: number = totalBiaya; // hitung biaya tambahan dengan *= dan /=
  tambahan *= metode.persen; // kalikan dengan persen
  tambahan /= 100; // bagi 100 menjadi nominal rupiah
  const totalAkhir: number = Math.round(totalBiaya + tambahan); // total akhir dibulatkan

  console.log(`\nMetode bayar        : ${metode.nama}`);
  console.log(`Total tagihan akhir : ${formatRupiah(totalAkhir)}`);

  let sudahDibayar: number = 0; // uang yang sudah dibayarkan
  while (sudahDibayar < totalAkhir) { // ulangi sampai lunas
    const uang: number = Number(await tanya(`Kekurangan ${formatRupiah(totalAkhir - sudahDibayar)}. Masukkan uang (0 = batal): Rp `));
    if (isNaN(uang) || uang < 0) {
      console.log("Nominal tidak valid!"); // bukan angka atau negatif
    } else if (uang === 0) {
      console.log("\nPEMBAYARAN DIBATALKAN. Uang dikembalikan."); // user membatalkan
      return null;
    } else {
      sudahDibayar += uang; // tambahkan ke total uang dibayar
    }
  }
  // Cetak struk pembayaran berhasil beserta kembalian
  console.log("\n=====================================");
  console.log("       PEMBAYARAN BERHASIL (LUNAS)   ");
  console.log(`       Kembalian : ${formatRupiah(sudahDibayar - totalAkhir)}`);
  console.log("=====================================");
  return { metode: metode.nama, totalAkhir }; // untuk dicatat di riwayat
}

// ===== BAGIAN 6: CRUD DAN SEARCH =====
// CREATE: menambah kendaraan baru ke array
async function kendaraanMasuk(): Promise<void> {
  console.log("\n--- KENDARAAN MASUK ---");
  const nama: string = await tanyaTeks("Nama pengendara : "); // nama tidak boleh kosong
  const plat: string = await tanyaPlat("Plat nomor      : ", -1); // plat unik
  const jenis: number = await tanyaJenis(); // jenis 1-3
  const isMember = (await tanyaYaTidak("Apakah member parkir? (y/n): ")) as boolean; // status member
  const jamMasuk = (await tanyaAngka("Jam masuk (0-23) : ", 0, 23)) as number; // jam masuk
  const id: number = idBerikutnya++; // id unik, penghitung naik satu
  daftarParkir.push({ id, nama, plat, jenis, isMember, jamMasuk }); // simpan di akhir array
  console.log(`\nKendaraan ${plat} berhasil dicatat masuk (ID: ${id}).`);
}

// READ: menampilkan semua kendaraan
function lihatDaftar(): void {
  console.log("\n--- DAFTAR KENDARAAN PARKIR ---");
  if (daftarParkir.length === 0) console.log("Belum ada kendaraan yang parkir."); // pesan data kosong
  else cetakTabel(daftarParkir); // cetak tabel
}

// READ: menampilkan detail satu kendaraan berdasarkan ID
async function lihatDetail(): Promise<void> {
  console.log("\n--- DETAIL KENDARAAN ---");
  const k = await pilihKendaraanById(); // cari berdasarkan ID
  if (k !== undefined) cetakDetail(k); // cetak kalau ketemu
}

// UPDATE: mengubah data berdasarkan ID; Enter = lewati kolom
async function editKendaraan(): Promise<void> {
  console.log("\n--- EDIT DATA KENDARAAN ---");
  const k = await pilihKendaraanById(); // pilih data yang diubah
  if (k === undefined) return; // tidak ada: berhenti
  console.log("\nNilai lama ada di dalam [ ]. Tekan Enter untuk melewati kolom yang tidak diubah.");
  const namaBaru: string = (await tanya(`Nama pengendara [${k.nama}]: `)).trim(); // nama baru
  if (namaBaru !== "") k.nama = namaBaru; // ganti kalau diisi
  k.plat = await tanyaPlat(`Plat nomor [${k.plat}]: `, k.id, k.plat); // plat divalidasi unik
  console.log("Jenis: 1. Motor  2. Mobil  3. Truk");
  k.jenis = (await tanyaAngka(`Jenis kendaraan [${namaJenis(k.jenis)}] (1-3, Enter = lewati): `, 1, 3, true)) ?? k.jenis; // Enter = tetap
  k.isMember = (await tanyaYaTidak(`Member? [${k.isMember ? "Ya" : "Tidak"}] (y/n, Enter = lewati): `, true)) ?? k.isMember; // Enter = tetap
  k.jamMasuk = (await tanyaAngka(`Jam masuk [${k.jamMasuk}] (0-23, Enter = lewati): `, 0, 23, true)) ?? k.jamMasuk; // Enter = tetap
  console.log(`\nData kendaraan ID ${k.id} berhasil diperbarui.`); // k menunjuk objek di array, jadi array ikut berubah
}

// DELETE: menghapus data setelah konfirmasi y/n
async function hapusKendaraan(): Promise<void> {
  console.log("\n--- HAPUS DATA KENDARAAN ---");
  const k = await pilihKendaraanById(); // pilih data yang dihapus
  if (k === undefined) return; // tidak ada: berhenti
  cetakDetail(k); // tampilkan detail agar user yakin
  if (await tanyaYaTidak(`\nYakin ingin menghapus data ${k.plat}? (y/n): `)) { // konfirmasi
    if (hapusById(k.id)) console.log(`Data kendaraan ${k.plat} berhasil dihapus.`);
  } else {
    console.log("Penghapusan dibatalkan."); // data tetap aman
  }
}

// SEARCH: kata kunci (tidak peka huruf besar/kecil) + filter jenis + filter status
async function cariKendaraan(): Promise<void> {
  console.log("\n--- CARI KENDARAAN ---");
  if (daftarParkir.length === 0) { // tidak ada yang bisa dicari
    console.log("Belum ada kendaraan yang parkir.");
    return;
  }
  const kata: string = (await tanya("Kata kunci nama/plat (Enter = semua): ")).trim().toLowerCase(); // huruf kecil
  console.log("Filter jenis  : 0. Semua  1. Motor  2. Mobil  3. Truk");
  const fJenis = (await tanyaAngka("Pilih filter jenis (0-3): ", 0, 3)) as number; // filter jenis
  console.log("Filter status : 0. Semua  1. Member  2. Non-member");
  const fMember = (await tanyaAngka("Pilih filter status (0-2): ", 0, 2)) as number; // filter status
  // filter(): hanya data yang memenuhi ketiga syarat yang lolos
  const hasil: Kendaraan[] = daftarParkir.filter((k) =>
    (k.nama.toLowerCase().includes(kata) || k.plat.toLowerCase().includes(kata)) && // kata kunci ("" selalu cocok)
    (fJenis === 0 || k.jenis === fJenis) && // jenis
    (fMember === 0 || (fMember === 1) === k.isMember) // status member
  );
  console.log(`\nDitemukan ${hasil.length} data.`);
  if (hasil.length === 0) console.log("Tidak ada kendaraan yang cocok dengan pencarian.");
  else cetakTabel(hasil);
}

// Kendaraan keluar: hitung tarif, bayar, catat riwayat, hapus dari daftar parkir
async function kendaraanKeluar(): Promise<void> {
  console.log("\n--- KENDARAAN KELUAR & PEMBAYARAN ---");
  const k = await pilihKendaraanById(); // pilih kendaraan yang keluar
  if (k === undefined) return; // tidak ada: berhenti
  const jamKeluar = (await tanyaAngka("Jam keluar (0-23) : ", 0, 23)) as number; // jam keluar
  const durasi: number = hitungDurasi(k.jamMasuk, jamKeluar); // lama parkir
  const totalBiaya: number = hitungTarif(k.jenis, durasi, k.isMember); // biaya parkir
  // Cetak ringkasan biaya parkir
  console.log("\n-----------------------------------------");
  console.log("           RINGKASAN BIAYA PARKIR        ");
  console.log("-----------------------------------------");
  console.log(`Pengendara    : ${k.nama}\nPlat Nomor    : ${k.plat}\nKendaraan     : ${namaJenis(k.jenis)}`);
  console.log(`Durasi Parkir : ${durasi} jam\nTotal Tarif   : ${formatRupiah(totalBiaya)}`);
  const hasil = await prosesPembayaran(totalBiaya); // null berarti dibatalkan
  if (hasil !== null) {
    riwayat.push({ nama: k.nama, plat: k.plat, jenis: namaJenis(k.jenis), durasi, metode: hasil.metode, totalAkhir: hasil.totalAkhir }); // catat transaksi
    hapusById(k.id); // kendaraan sudah keluar
    console.log(`Kendaraan ${k.plat} sudah keluar dari area parkir.`);
  } else {
    console.log(`Kendaraan ${k.plat} masih tercatat di area parkir.`); // pembayaran batal
  }
}

// Menampilkan riwayat transaksi dan total pendapatan
function lihatRiwayat(): void {
  console.log("\n--- RIWAYAT TRANSAKSI ---");
  if (riwayat.length === 0) { // belum ada transaksi
    console.log("Belum ada transaksi.");
    return;
  }
  let totalPendapatan: number = 0; // penampung total pendapatan
  // for biasa dengan index i
  for (let i = 0; i < riwayat.length; i++) {
    const t = riwayat[i]!; // transaksi ke-i (pasti ada)
    console.log(`${i + 1}. ${t.plat} | ${t.nama} | ${t.jenis} | ${t.durasi} jam | ${t.metode} | ${formatRupiah(t.totalAkhir)}`);
    totalPendapatan += t.totalAkhir; // tambahkan ke total
  }
  console.log(`\nTotal pendapatan: ${formatRupiah(totalPendapatan)}`);
}

// ===== BAGIAN 7: MENU UTAMA (looping sampai user memilih Keluar) =====
async function main(): Promise<void> {
  // Cetak judul program
  console.log(" ============================================ ");
  console.log("            SISTEM TERMINAL PARKIR            ");
  console.log(" ============================================ ");
  let jalan: boolean = true; // penanda menu masih berjalan
  while (jalan) { // ulangi menu sampai user memilih 0
    console.log("\n=== MENU UTAMA ===");
    console.log("1. Kendaraan Masuk\n2. Lihat Daftar Kendaraan Parkir\n3. Lihat Detail Kendaraan (by ID)\n4. Edit Data Kendaraan");
    console.log("5. Hapus Data Kendaraan\n6. Cari Kendaraan\n7. Kendaraan Keluar & Bayar\n8. Riwayat Transaksi\n0. Keluar");
    const pilih = (await tanyaAngka("Pilih menu (0-8): ", 0, 8)) as number; // input tidak valid diulang otomatis
    // switch: jalankan fitur sesuai pilihan menu
    switch (pilih) {
      case 1: await kendaraanMasuk(); break; // Create
      case 2: lihatDaftar(); break; // Read semua data
      case 3: await lihatDetail(); break; // Read detail by ID
      case 4: await editKendaraan(); break; // Update
      case 5: await hapusKendaraan(); break; // Delete
      case 6: await cariKendaraan(); break; // Search
      case 7: await kendaraanKeluar(); break; // Keluar + pembayaran
      case 8: lihatRiwayat(); break; // Riwayat transaksi
      case 0: jalan = false; console.log("\nTerima kasih, program selesai."); break; // keluar dari loop
      default: console.log("Pilihan menu tidak valid!"); break; // pengaman
    }
  }
  rl.close(); // tutup readline supaya program berhenti
}

// Memulai program
main();
