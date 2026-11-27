"use strict";
let baris = 2, kolom = 2;
let i, j;
let A = [[6, 3], [4, 2]];
let B = [[3, 2], [2, 1]];
let C = [];
// Matrix addition operation
for (i = 0; i < baris; i++) {
    C[i] = [];
    for (j = 0; j < kolom; j++) {
        C[i][j] = A[i][j] + B[i][j];
    }
}
// Display Matrix A
console.log("Matrix A :");
for (i = 0; i < baris; i++) {
    let hasil = "";
    for (j = 0; j < kolom; j++) {
        hasil += A[j][i] + " ";
    }
    console.log(hasil);
}
// Display Matrix B
console.log("Matrix B :");
for (i = 0; i < baris; i++) {
    let hasil = "";
    for (j = 0; j < kolom; j++) {
        hasil += B[j][i] + " ";
    }
    console.log(hasil);
}
// Display Matrix A+B
console.log("Matrix A+B :");
for (i = 0; i < baris; i++) {
    let hasil = "";
    for (j = 0; j < kolom; j++) {
        hasil += C[j][i] + " ";
    }
    console.log(hasil);
}
