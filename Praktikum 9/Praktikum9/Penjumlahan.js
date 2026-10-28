import * as readline from "readline-sync";
let batas;
batas = Number(readline.question("Masukkan batas angka maksimum: "));
let total = 0;
for (let i = 1; i <= batas; i++) {
    if (i % 2 === 1) {
        total += i;
    }
    else {
        total -= i;
    }
}
console.log(`Hasil penjumlahan berselang-seling: ${total}`);
