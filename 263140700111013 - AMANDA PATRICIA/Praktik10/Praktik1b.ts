import * as readline from "readline-sync";

let jumlah: number;
let i: number;
let cari: number;
let ketemu: boolean = false;
let a: number[] = [];

jumlah = Number(readline.question("Enter the number of data items : "));

// Entering data
for (i = 0; i < jumlah; i++) {
    a[i] = Number(readline.question(`Enter data no. ${i + 1}: `));
}

// Searching data
cari = Number(readline.question("Enter the number to be searched for : "));

for (i = 0; i < jumlah; i++) {
    if (a[i] === cari) {
        ketemu = true;
        break;
    }
}

// Displaying result
if (ketemu) {
    console.log("data found");
} else {
    console.log("data not found");
}