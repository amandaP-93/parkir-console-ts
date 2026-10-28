import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let inputPilih: string, pilih: number;

rl.question("Masukkan angka: ", (inputPilih) => {
  pilih = Number(inputPilih);

  switch (pilih) {
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

  rl.close();
});