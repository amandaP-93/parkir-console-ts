import * as readline from "readline";
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const Diskon = 0.05;
let InputPilihan, Pilih;
r1.question("Masukkan angka: ", (InputPilihan) => {
    Pilih = Number(InputPilihan);
    switch (Pilih) {
        case 1:
            console.log("Anda memasukkan angka 1");
            break;
        case 2:
            console.log("Anda memasukkan angka 2");
            break;
        case 3:
            console.log("Anda memasukkan angka 3");
            break;
        case 4:
            console.log("Anda memasukkan angka 4");
            break;
        default:
            console.log("Angka yang Anda masukkan salah!");
            break;
    }
    r1.close();
});
