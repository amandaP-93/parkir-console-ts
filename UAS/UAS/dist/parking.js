"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// ============================================================
// BAGIAN 1: KONSTANTA TARIF
// (nilai disamakan dengan flowchart, ubah di sini kalau perlu)
// ============================================================
const BASE_MOTOR = 2000;
const TARIF_TAMBAHAN_MOTOR = 2000;
const BASE_MOBIL = 5000;
const TARIF_TAMBAHAN_MOBIL = 3000;
const BASE_TRUK = 8000;
const TARIF_TAMBAHAN_TRUK = 4000;
const FAKTOR_EMONEY = 1.02; // E-Money naik 2%
const FAKTOR_KARTU_KREDIT = 1.05; // Kartu kredit naik 5%
const daftarParkir = []; // kendaraan yang sedang parkir
const riwayat = []; // transaksi yang sudah selesai
// ============================================================
// BAGIAN 3: FUNGSI BANTU INPUT (semua pakai looping validasi)
// ============================================================
// Membungkus rl.question supaya bisa dipakai dengan await
function tanya(pertanyaan) {
    return new Promise((resolve) => rl.question(pertanyaan, resolve));
}
// Ulangi sampai user mengisi teks (tidak boleh kosong)
async function tanyaTeks(pertanyaan) {
    let teks = "";
    while (teks === "") {
        teks = (await tanya(pertanyaan)).trim();
        if (teks === "") {
            console.log("Tidak boleh kosong!");
        }
    }
    return teks;
}
// Ulangi sampai user mengisi angka bulat dalam rentang min - max
async function tanyaAngka(pertanyaan, min, max) {
    let angka = NaN;
    while (isNaN(angka) || !Number.isInteger(angka) || angka < min || angka > max) {
        angka = Number(await tanya(pertanyaan));
        if (isNaN(angka) || !Number.isInteger(angka) || angka < min || angka > max) {
            console.log(`Input tidak valid! Masukkan angka bulat ${min} - ${max}.`);
        }
    }
    return angka;
}
// Ulangi sampai user mengetik y atau n
async function tanyaMember() {
    let jawab = "";
    while (jawab !== "y" && jawab !== "n") {
        jawab = (await tanya("Apakah member parkir? (y/n): ")).trim().toLowerCase();
        if (jawab !== "y" && jawab !== "n") {
            console.log("Ketik y atau n saja!");
        }
    }
    return jawab === "y";
}
async function tanyaJenis() {
    console.log("\nPilih Jenis Kendaraan:");
    console.log("1. Motor (Rp 2.000 / jam ke-1, Rp 2.000 / jam berikutnya)");
    console.log("2. Mobil (Rp 5.000 / jam ke-1, Rp 3.000 / jam berikutnya)");
    console.log("3. Truk  (Rp 8.000 / jam ke-1, Rp 4.000 / jam berikutnya)");
    return await tanyaAngka("Pilihan kendaraan (1-3): ", 1, 3);
}
// Cari index kendaraan berdasarkan plat, hasil -1 artinya tidak ada
function cariIndexPlat(plat) {
    for (let i = 0; i < daftarParkir.length; i++) {
        const k = daftarParkir[i];
        if (k !== undefined && k.plat === plat) {
            return i;
        }
    }
    return -1;
}
// Ulangi sampai plat tidak kosong DAN belum terdaftar (cegah plat ganda)
async function tanyaPlatBaru(pertanyaan) {
    let plat = "";
    while (plat === "") {
        plat = (await tanya(pertanyaan)).trim().toUpperCase();
        if (plat === "") {
            console.log("Plat tidak boleh kosong!");
        }
        else if (cariIndexPlat(plat) !== -1) {
            console.log("Plat sudah terdaftar di area parkir!");
            plat = "";
        }
    }
    return plat;
}
function namaJenis(jenis) {
    switch (jenis) {
        case 1:
            return "Motor";
        case 2:
            return "Mobil";
        case 3:
            return "Truk";
        default:
            return "Tidak diketahui";
    }
}
function formatRupiah(angka) {
    return "Rp " + Math.round(angka).toLocaleString("id-ID");
}
// ============================================================
// BAGIAN 4: PERHITUNGAN TARIF (dari kode kamu, jadi satu fungsi)
// ============================================================
function hitungTarif(jenis, durasi, isMember) {
    let baseRate = 0;
    let tarifTambahan = 0;
    let totalBiaya = 0;
    // switch 1: jenis kendaraan
    switch (jenis) {
        case 1: {
            baseRate = BASE_MOTOR;
            tarifTambahan = TARIF_TAMBAHAN_MOTOR;
            if (durasi <= 1) {
                totalBiaya = baseRate;
            }
            else if (durasi > 1 && isMember === true) {
                // diskon member (hanya untuk motor)
                let biayaNormal = baseRate + (durasi - 1) * tarifTambahan;
                if (durasi >= 5) {
                    console.log("[Diskon Member Spesial] Parkir >= 5 jam dapat potongan 20%!");
                    totalBiaya = biayaNormal * 0.8;
                }
                else {
                    console.log("[Diskon Member] Parkir > 1 jam dapat potongan 10%!");
                    totalBiaya = biayaNormal * 0.9;
                }
            }
            else {
                totalBiaya = baseRate + (durasi - 1) * tarifTambahan;
            }
            break;
        }
        case 2: {
            baseRate = BASE_MOBIL;
            tarifTambahan = TARIF_TAMBAHAN_MOBIL;
            if (durasi <= 1) {
                totalBiaya = baseRate;
            }
            else {
                totalBiaya = baseRate + (durasi - 1) * tarifTambahan;
                // operator logika ! (NOT) dan || (OR)
                if (isMember || !(durasi < 5)) {
                    console.log("[Bonus] Member atau parkir >= 5 jam mendapat voucher cuci mobil.");
                }
            }
            break;
        }
        case 3: {
            baseRate = BASE_TRUK;
            tarifTambahan = TARIF_TAMBAHAN_TRUK;
            if (durasi <= 1) {
                totalBiaya = baseRate;
            }
            else {
                totalBiaya = baseRate + (durasi - 1) * tarifTambahan;
                // operator modulus (%)
                if (durasi % 2 !== 0) {
                    console.log("[Catatan] Durasi parkir ganjil.");
                }
            }
            break;
        }
        default:
            console.log("Jenis kendaraan tidak valid!");
            break;
    }
    return Math.round(totalBiaya);
}
// ============================================================
// BAGIAN 5: PEMBAYARAN (looping sampai lunas)
// Mengembalikan null kalau pembayaran dibatalkan
// ============================================================
async function prosesPembayaran(totalBiaya) {
    console.log("\nPilih Metode Pembayaran:");
    console.log("1. Tunai (Cash)");
    console.log("2. E-Money (+2%)");
    console.log("3. Kartu Kredit (+5%)");
    const metodeBayar = await tanyaAngka("Pilihan pembayaran (1-3): ", 1, 3);
    let totalAkhir = totalBiaya;
    let namaMetode = "";
    // switch 2: metode pembayaran
    switch (metodeBayar) {
        case 1:
            namaMetode = "Tunai";
            totalAkhir = totalBiaya;
            break;
        case 2:
            namaMetode = "E-Money";
            totalAkhir = Math.round(totalBiaya * FAKTOR_EMONEY);
            break;
        case 3:
            namaMetode = "Kartu Kredit";
            totalAkhir = Math.round(totalBiaya * FAKTOR_KARTU_KREDIT);
            break;
        default:
            namaMetode = "Tunai";
            totalAkhir = totalBiaya;
            break;
    }
    console.log(`\nMetode bayar        : ${namaMetode}`);
    console.log(`Total tagihan akhir : ${formatRupiah(totalAkhir)}`);
    // Looping: minta uang terus sampai cukup, ketik 0 untuk batal
    let sudahDibayar = 0;
    while (sudahDibayar < totalAkhir) {
        const kurang = totalAkhir - sudahDibayar;
        const uang = Number(await tanya(`Kekurangan ${formatRupiah(kurang)}. Masukkan uang (0 = batal): Rp `));
        if (isNaN(uang) || uang < 0) {
            console.log("Nominal tidak valid!");
        }
        else if (uang === 0) {
            console.log("\nPEMBAYARAN DIBATALKAN. Uang dikembalikan.");
            return null;
        }
        else {
            sudahDibayar += uang;
        }
    }
    const kembalian = sudahDibayar - totalAkhir;
    console.log("\n=====================================");
    console.log("       PEMBAYARAN BERHASIL (LUNAS)   ");
    console.log(`       Kembalian : ${formatRupiah(kembalian)}`);
    console.log("=====================================");
    return { metode: namaMetode, totalAkhir: totalAkhir };
}
// ============================================================
// BAGIAN 6: FITUR CRUD
// ============================================================
// CREATE: kendaraan masuk
async function kendaraanMasuk() {
    console.log("\n--- KENDARAAN MASUK ---");
    const nama = await tanyaTeks("Nama pengendara : ");
    const plat = await tanyaPlatBaru("Plat nomor      : ");
    const jenis = await tanyaJenis();
    const isMember = await tanyaMember();
    const jamMasuk = await tanyaAngka("Jam masuk (0-23) : ", 0, 23);
    daftarParkir.push({ nama, plat, jenis, isMember, jamMasuk });
    console.log(`\nKendaraan ${plat} berhasil dicatat masuk.`);
}
// READ: tampilkan semua kendaraan yang sedang parkir
function lihatDaftar() {
    console.log("\n--- DAFTAR KENDARAAN PARKIR ---");
    if (daftarParkir.length === 0) {
        console.log("Belum ada kendaraan yang parkir.");
        return;
    }
    for (let i = 0; i < daftarParkir.length; i++) {
        const k = daftarParkir[i];
        if (k === undefined) {
            continue;
        }
        // tanda ? : artinya "kalau isMember benar tulis Member, kalau tidak tulis Non-member"
        const status = k.isMember ? "Member" : "Non-member";
        console.log(`${i + 1}. ${k.plat} | ${k.nama} | ${namaJenis(k.jenis)} | ${status} | masuk jam ${k.jamMasuk}:00`);
    }
    console.log(`Total: ${daftarParkir.length} kendaraan`);
}
// READ: cari berdasarkan plat
async function cariKendaraan() {
    console.log("\n--- CARI KENDARAAN ---");
    const plat = (await tanya("Masukkan plat nomor: ")).trim().toUpperCase();
    const index = cariIndexPlat(plat);
    if (index === -1) {
        console.log("Kendaraan tidak ditemukan!");
        return;
    }
    const k = daftarParkir[index];
    if (k === undefined) {
        return;
    }
    console.log(`Nama   : ${k.nama}`);
    console.log(`Plat   : ${k.plat}`);
    console.log(`Jenis  : ${namaJenis(k.jenis)}`);
    console.log(`Member : ${k.isMember ? "Ya" : "Tidak"}`);
    console.log(`Masuk  : jam ${k.jamMasuk}:00`);
}
// UPDATE: edit data kendaraan
async function editKendaraan() {
    console.log("\n--- EDIT DATA KENDARAAN ---");
    const plat = (await tanya("Masukkan plat nomor yang mau diedit: ")).trim().toUpperCase();
    const index = cariIndexPlat(plat);
    if (index === -1) {
        console.log("Kendaraan tidak ditemukan!");
        return;
    }
    // k menunjuk ke objek yang sama di dalam array,
    // jadi kalau k diubah, isi array ikut berubah
    const k = daftarParkir[index];
    if (k === undefined) {
        return;
    }
    let selesai = false;
    while (!selesai) {
        console.log(`\nData saat ini: ${k.plat} | ${k.nama} | ${namaJenis(k.jenis)} | ${k.isMember ? "Member" : "Non-member"}`);
        console.log("1. Ubah nama");
        console.log("2. Ubah plat");
        console.log("3. Ubah jenis kendaraan");
        console.log("4. Ubah status member");
        console.log("0. Selesai");
        const pilih = await tanyaAngka("Pilih (0-4): ", 0, 4);
        switch (pilih) {
            case 1:
                k.nama = await tanyaTeks("Nama baru: ");
                console.log("Nama berhasil diubah.");
                break;
            case 2:
                k.plat = await tanyaPlatBaru("Plat baru: ");
                console.log("Plat berhasil diubah.");
                break;
            case 3:
                k.jenis = await tanyaJenis();
                console.log("Jenis kendaraan berhasil diubah.");
                break;
            case 4:
                k.isMember = await tanyaMember();
                console.log("Status member berhasil diubah.");
                break;
            case 0:
                selesai = true;
                break;
        }
    }
}
// DELETE: kendaraan keluar, hitung tarif, bayar, lalu hapus dari daftar
async function kendaraanKeluar() {
    console.log("\n--- KENDARAAN KELUAR & PEMBAYARAN ---");
    const plat = (await tanya("Masukkan plat nomor: ")).trim().toUpperCase();
    const index = cariIndexPlat(plat);
    if (index === -1) {
        console.log("Kendaraan tidak ditemukan!");
        return;
    }
    const k = daftarParkir[index];
    if (k === undefined) {
        return;
    }
    const jamKeluar = await tanyaAngka("Jam keluar (0-23) : ", 0, 23);
    // hitung durasi dari jam masuk dan jam keluar
    let durasi = jamKeluar - k.jamMasuk;
    if (durasi < 0) {
        durasi += 24; // parkir melewati tengah malam
    }
    if (durasi === 0) {
        durasi = 1; // minimal dihitung 1 jam
    }
    const totalBiaya = hitungTarif(k.jenis, durasi, k.isMember);
    console.log("\n-----------------------------------------");
    console.log("           RINGKASAN BIAYA PARKIR        ");
    console.log("-----------------------------------------");
    console.log(`Pengendara    : ${k.nama}`);
    console.log(`Plat Nomor    : ${k.plat}`);
    console.log(`Kendaraan     : ${namaJenis(k.jenis)}`);
    console.log(`Durasi Parkir : ${durasi} jam`);
    console.log(`Total Tarif   : ${formatRupiah(totalBiaya)}`);
    const hasil = await prosesPembayaran(totalBiaya);
    if (hasil !== null) {
        riwayat.push({
            nama: k.nama,
            plat: k.plat,
            jenis: namaJenis(k.jenis),
            durasi: durasi,
            metode: hasil.metode,
            totalAkhir: hasil.totalAkhir,
        });
        daftarParkir.splice(index, 1); // hapus 1 data pada posisi index
        console.log(`Kendaraan ${k.plat} sudah keluar dari area parkir.`);
    }
    else {
        console.log(`Kendaraan ${k.plat} masih tercatat di area parkir.`);
    }
}
// READ: riwayat transaksi + total pendapatan
function lihatRiwayat() {
    console.log("\n--- RIWAYAT TRANSAKSI ---");
    if (riwayat.length === 0) {
        console.log("Belum ada transaksi.");
        return;
    }
    let totalPendapatan = 0;
    for (let i = 0; i < riwayat.length; i++) {
        const t = riwayat[i];
        if (t === undefined) {
            continue;
        }
        console.log(`${i + 1}. ${t.plat} | ${t.nama} | ${t.jenis} | ${t.durasi} jam | ${t.metode} | ${formatRupiah(t.totalAkhir)}`);
        totalPendapatan += t.totalAkhir;
    }
    console.log(`\nTotal pendapatan: ${formatRupiah(totalPendapatan)}`);
}
// ============================================================
// BAGIAN 7: MENU UTAMA (looping sampai user pilih Keluar)
// ============================================================
async function main() {
    console.log(" ============================================ ");
    console.log("            SISTEM TERMINAL PARKIR            ");
    console.log(" ============================================ ");
    let jalan = true;
    while (jalan) {
        console.log("\n=== MENU UTAMA ===");
        console.log("1. Kendaraan Masuk");
        console.log("2. Lihat Daftar Kendaraan Parkir");
        console.log("3. Cari Kendaraan");
        console.log("4. Edit Data Kendaraan");
        console.log("5. Kendaraan Keluar & Bayar");
        console.log("6. Riwayat Transaksi");
        console.log("0. Keluar");
        const pilih = await tanyaAngka("Pilih menu (0-6): ", 0, 6);
        switch (pilih) {
            case 1:
                await kendaraanMasuk();
                break;
            case 2:
                lihatDaftar();
                break;
            case 3:
                await cariKendaraan();
                break;
            case 4:
                await editKendaraan();
                break;
            case 5:
                await kendaraanKeluar();
                break;
            case 6:
                lihatRiwayat();
                break;
            case 0:
                jalan = false;
                console.log("\nTerima kasih, program selesai.");
                break;
        }
    }
    rl.close();
}
main();
//# sourceMappingURL=parking.js.map