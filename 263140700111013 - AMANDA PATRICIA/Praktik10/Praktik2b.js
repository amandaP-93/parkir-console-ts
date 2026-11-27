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
const readline = __importStar(require("readline-sync"));
let baris;
let kolom;
let i, j;
let A = [];
let B = [];
let C = [];
let D = [];
baris = Number(readline.question("Enter the number of rows : "));
kolom = Number(readline.question("Enter the number of columns : "));
// Input Matrix A
console.log("Set A");
for (i = 0; i < baris; i++) {
    A[i] = [];
    for (j = 0; j < kolom; j++) {
        A[i][j] = Number(readline.question(`Enter data A[${i}][${j}] : `));
    }
}
// Input Matrix B
console.log("Set B");
for (i = 0; i < baris; i++) {
    B[i] = [];
    for (j = 0; j < kolom; j++) {
        B[i][j] = Number(readline.question(`Enter data B[${i}][${j}] : `));
    }
}
// Matrix addition and subtraction
for (i = 0; i < baris; i++) {
    C[i] = [];
    D[i] = [];
    for (j = 0; j < kolom; j++) {
        C[i][j] = A[i][j] + B[i][j];
        D[i][j] = A[i][j] - B[i][j];
    }
}
// Display Matrix A+B
console.log("Matrix A+B :");
for (i = 0; i < baris; i++) {
    console.log(C[i].join(" "));
}
// Display Matrix A-B
console.log("Matrix A-B :");
for (i = 0; i < baris; i++) {
    console.log(D[i].join(" "));
}
