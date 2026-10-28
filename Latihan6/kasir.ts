let totalPembelian: number = 250000;
let diskon: number = 0;
let totalBayar: number;

if (totalPembelian > 200000) {
    diskon = totalPembelian * 0.05;
}

totalBayar = totalPembelian - diskon;

console.log("Total Pembelian : " + totalPembelian);
console.log("Diskon          : " + diskon);
console.log("Total Bayar      : " + totalBayar);