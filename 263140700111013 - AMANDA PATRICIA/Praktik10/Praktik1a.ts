import * as readline from "readline-sync";
 
 let i: number;
 let jumlah: number = 4;
 let a: number[] = new Array(jumlah);
 
 
//entering data
for (i = 0; i < jumlah; i++) {
        a[i] = Number(readline.question(`Enter data no. ${i + 1}: `));
}
console.log("-------Data Array-------");
for (i = 0; i < jumlah; i++) {
    console.log(`Data no. ${i + 1}  : ${a[i]}`);
}
