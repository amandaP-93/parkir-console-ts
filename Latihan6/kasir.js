"use strict";
let totalPembelian = 250000;
let diskon = 0;
let totalBayar;
if (totalPembelian > 200000) {
    diskon = totalPembelian * 0.05;
}
totalBayar = totalPembelian - diskon;
console.log("Total Pembelian : " + totalPembelian);
console.log("Diskon          : " + diskon);
console.log("Total Bayar      : " + totalBayar);
