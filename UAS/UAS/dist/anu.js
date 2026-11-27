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
// Membuat interface readline untuk input/output pada terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Deklarasi konstanta (const) untuk tarif dasar (1 jam pertama) dan tarif per jam berikutnya
const BASE_MOTOR = 3000;
const NEXT_MOTOR = 2000;
const BASE_MOBIL = 5000;
const NEXT_MOBIL = 3000;
const BASE_TRUK = 7000;
const NEXT_TRUK = 4000;
const BIAYA_ADMIN_EMONEY = 1000;
console.log("==================================================");
console.log("       SISTEM HITUNG TARIF PARKIR (UTS PAKET B)   ");
console.log("==================================================");
// Input 1: Nama Pengendara (tipe data string)
rl.question("Masukkan Nama Pengendara : ", (namaPengendara) => {
    // Input 2: Plat Nomor (tipe data string)
    rl.question("Masukkan Plat Nomor : ", (platNomor) => {
        // Input 3: Durasi Parkir (tipe data number)
        rl.question("Masukkan Durasi Parkir (Jam): ", (inputDurasi) => {
            let durasiParkir = Number(inputDurasi);
            // Input 4: Status Member (tipe data boolean)
            rl.question("Apakah Member Parkir? (y/n): ", (inputMember) => {
                // Operator Logika || dan Perbandingan ===
                let isMember = inputMember.toLowerCase() === "y" || inputMember.toLowerCase() === "ya";
                console.log("\nPilih Jenis Kendaraan:");
                console.log("1. Motor (Rp 3.000 / jam ke-1, Rp 2.000 / jam berikutnya)");
                console.log("2. Mobil (Rp 5.000 / jam ke-1, Rp 3.000 / jam berikutnya)");
                console.log("3. Truk (Rp 7.000 / jam ke-1, Rp 4.000 / jam berikutnya)");
                // Input 5: Pilihan Kendaraan
                rl.question("Pilihan Kendaraan (1-3) : ", (inputKendaraan) => {
                    let jenisKendaraan = Number(inputKendaraan);
                    // Deklarasi variabel yang dapat berubah (let)
                    let baseRate = 0;
                    let nextRate = 0;
                    let totalBiaya = 0;
                    let namaKendaraan = "";
                    // =========================================================
                    // SWITCH 1 (Penggunaan SWITCH Pertama - Min 3 Case + Default)
                    // NESTING LEVEL 1: Block Switch utama
                    // =========================================================
                    switch (jenisKendaraan) {
                        case 1:
                            namaKendaraan = "Motor";
                            baseRate = BASE_MOTOR;
                            nextRate = NEXT_MOTOR;
                            // =====================================================
                            // IF 1 (Penggunaan IF Pertama - Menghitung Durasi Parkir)
                            // NESTING LEVEL 2: IF di dalam Case Switch
                            // =====================================================
                            if (durasiParkir <= 1) {
                                totalBiaya = baseRate;
                            }
                            else if (durasiParkir > 1 && isMember === true) {
                                // Kondisi Majemuk menggunakan operator logika && dan perbandingan > & ===
                                // ===================================================
                                // IF 2 (Penggunaan IF Kedua - Diskon Durasi Panjang Member)
                                // NESTING LEVEL 3: IF di dalam IF di dalam Switch (Kedalaman 3 Level!)
                                // ===================================================
                                if (durasiParkir >= 10) {
                                    console.log("[Diskon Member Spesial] Parkir >= 10 jam dapat potongan 20%!");
                                    let biayaNormal = baseRate + (durasiParkir - 1) * nextRate;
                                    totalBiaya = biayaNormal * 0.8; // Diskon 20%
                                }
                                else {
                                    console.log("[Diskon Member] Parkir > 1 jam dapat potongan 10%!");
                                    let biayaNormal = baseRate + (durasiParkir - 1) * nextRate;
                                    totalBiaya = biayaNormal * 0.9; // Diskon 10%
                                }
                            }
                            else {
                                // Perhitungan Standar Non-Member (durasi > 1 jam)
                                totalBiaya = baseRate + (durasiParkir - 1) * nextRate;
                            }
                            break;
                        case 2:
                            namaKendaraan = "Mobil";
                            baseRate = BASE_MOBIL;
                            nextRate = NEXT_MOBIL;
                            if (durasiParkir <= 1) {
                                totalBiaya = baseRate;
                            }
                            else {
                                totalBiaya = baseRate + (durasiParkir - 1) * nextRate;
                                // Penggunaan operator logika ! (NOT) dan || (OR)
                                if (isMember || !(durasiParkir < 5)) {
                                    console.log("[Bonus Poin] Member atau Parkir >= 5 jam mendapat voucher cuci mobil.");
                                }
                            }
                            break;
                        case 3:
                            namaKendaraan = "Truk";
                            baseRate = BASE_TRUK;
                            nextRate = NEXT_TRUK;
                            if (durasiParkir <= 1) {
                                totalBiaya = baseRate;
                            }
                            else {
                                totalBiaya = baseRate + (durasiParkir - 1) * nextRate;
                                // Penggunaan Operator Modulus (%)
                                let sisaJam = durasiParkir % 2;
                                if (sisaJam !== 0) {
                                    console.log("[Catatan] Durasi parkir ganjil.");
                                }
                            }
                            break;
                        default:
                            console.log("Pilihan kendaraan tidak valid!");
                            rl.close();
                            return;
                    }
                    // Contoh penggunaan Compound Assignment Operator (*=, /=)
                    let penyesuaian = 1;
                    penyesuaian *= 1; // Compound Multiplication
                    totalBiaya /= penyesuaian; // Compound Division
                    console.log("\n--------------------------------------------------");
                    console.log("              RINGKASAN BIAYA PARKIR              ");
                    console.log("--------------------------------------------------");
                    console.log(`Pengendara    : ${namaPengendara}`);
                    console.log(`Plat Nomor    : ${platNomor}`);
                    console.log(`Kendaraan     : ${namaKendaraan}`);
                    console.log(`Durasi Parkir : ${durasiParkir} Jam`);
                    console.log(`Total Tarif   : Rp ${totalBiaya}`);
                    console.log("\nPilih Metode Pembayaran:");
                    console.log("1. Tunai (Cash)");
                    console.log("2. E-Money (+ Biaya Admin Rp 1.000)");
                    console.log("3. Kartu Kredit (+ Surcharge 2%)");
                    // Input 6: Pilihan Metode Pembayaran
                    rl.question("Pilihan Pembayaran (1-3) : ", (inputBayar) => {
                        let metodeBayar = Number(inputBayar);
                        let totalAkhir = totalBiaya;
                        // =========================================================
                        // SWITCH 2 (Penggunaan SWITCH Kedua - Min 3 Case + Default)
                        // =========================================================
                        switch (metodeBayar) {
                            case 1:
                                console.log("Metode Bayar: Tunai");
                                break;
                            case 2:
                                console.log("Metode Bayar: E-Money");
                                // Compound Assignment Operator +=
                                totalAkhir += BIAYA_ADMIN_EMONEY;
                                console.log(`+ Biaya Admin E-Money: Rp ${BIAYA_ADMIN_EMONEY}`);
                                break;
                            case 3:
                                console.log("Metode Bayar: Kartu Kredit");
                                // Compound Assignment Operator *=
                                totalAkhir *= 1.02; // Surcharge 2%
                                console.log("+ Surcharge 2% Kartu Kredit");
                                break;
                            default:
                                console.log("Pilihan tidak valid, pembayaran diproses secara Tunai.");
                                break;
                        }
                        console.log(`Total Tagihan Akhir : Rp ${totalAkhir}`);
                        // Input 7: Uang Pembayaran
                        rl.question("Masukkan Uang Pembayaran : Rp ", (inputUang) => {
                            let uangDibayar = Number(inputUang);
                            // =======================================================
                            // IF 3 (Penggunaan IF Ketiga)
                            // Validasi Pembayaran (Kondisi Majemuk &&, Perbandingan >= dan !==)
                            // =======================================================
                            let isLunas = uangDibayar >= totalAkhir;
                            if (isLunas && uangDibayar !== 0) {
                                // Operator Aritmatika Pengurangan (-)
                                let kembalian = uangDibayar - totalAkhir;
                                console.log("\n=================================");
                                console.log("    PEMBAYARAN BERHASIL (LUNAS)  ");
                                console.log(`    Kembalian : Rp ${kembalian}`);
                                console.log("=================================");
                            }
                            else {
                                // Compound Operator -=
                                let kekurangan = totalAkhir;
                                kekurangan -= uangDibayar;
                                console.log("\n=================================");
                                console.log("    PEMBAYARAN GAGAL / KURANG    ");
                                console.log(`    Kekurangan : Rp ${kekurangan}`);
                                console.log("=================================");
                            }
                            // Menutup interface readline
                            rl.close();
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=anu.js.map