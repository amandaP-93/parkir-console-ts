import * as readline from "readline-sync";
let jumlah;
jumlah = Number(readline.question("Masukkan jumlah angka: "));
let i = 1;
let angka;
let ganjil = 0;
let genap = 0;
while (i <= jumlah) {
    angka = Number(readline.question(`Masukkan angka ke-${i}: `));
    if (angka % 2 === 0) {
        genap++;
    }
    else {
        ganjil++;
    }
    i++;
}
console.log(`Jumlah bilangan genap: ${genap}`);
console.log(`Jumlah bilangan ganjil: ${ganjil}`);
