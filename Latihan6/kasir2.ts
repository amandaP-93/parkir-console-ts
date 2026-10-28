let totalPembelian: number = 250000;
let diskon: number;

if (totalPembelian <= 150000) {
    diskon = 0;
} else if (totalPembelian <= 300000) {
    diskon = totalPembelian * 0.10;
} else if (totalPembelian <= 500000) {
    diskon = totalPembelian * 0.15;
} else {
    diskon = totalPembelian * 0.20;
}

let totalBayar: number = totalPembelian - diskon;

console.log("Enter total purchase : " + totalPembelian);
console.log("Discount             : " + diskon);
console.log("Total Payment        : " + totalBayar);