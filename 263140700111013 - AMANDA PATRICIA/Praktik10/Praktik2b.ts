import * as readline from "readline-sync";

let baris: number;
let kolom: number;
let i: number, j: number;

let A: number[][] = [];
let B: number[][] = [];
let C: number[][] = [];
let D: number[][] = [];

baris = Number(readline.question("Enter the number of rows : "));
kolom = Number(readline.question("Enter the number of columns : "));

// Input Matrix A
console.log("Set A");
for (i = 0; i < baris; i++) {
    A[i] = [];
    for (j = 0; j < kolom; j++) {
        A[i]![j] = Number(readline.question(`Enter data A[${i}][${j}] : `));
    }
}

// Input Matrix B
console.log("Set B");
for (i = 0; i < baris; i++) {
    B[i] = [];
    for (j = 0; j < kolom; j++) {
        B[i]![j] = Number(readline.question(`Enter data B[${i}][${j}] : `));
    }
}

// Matrix addition and subtraction
for (i = 0; i < baris; i++) {
    C[i] = [];
    D[i] = [];
    for (j = 0; j < kolom; j++) {
        C[i]![j] = A[i]![j]! + B[i]![j]!;
        D[i]![j] = A[i]![j]! - B[i]![j]!;
    }
}

// Display Matrix A+B
console.log("Matrix A+B :");
for (i = 0; i < baris; i++) {
    console.log(C[i]!.join(" "));
}

// Display Matrix A-B
console.log("Matrix A-B :");
for (i = 0; i < baris; i++) {
    console.log(D[i]!.join(" "));
}
