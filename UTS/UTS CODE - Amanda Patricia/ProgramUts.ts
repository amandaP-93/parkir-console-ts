import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

// Tarif parkir setiap kendaraan.
const sepeda1: number = 2000, sepeda2: number = 1000;
const motor1: number = 3000, motor2: number = 2000;
const mobil1: number = 5000, mobil2: number = 4000;

async function main(): Promise<void> {
  try {
    // Memasukkan data parkir.
    const kendaraan: string = (
      await rl.question("Kendaraan (sepeda/motor/mobil): ")
    ).trim().toLowerCase();

    const durasi: number = Number(
      await rl.question("Durasi parkir (jam): ")
    );

    // Memeriksa durasi parkir.
    if (!Number.isFinite(durasi) || durasi <= 0 || durasi > 24) {
      console.log("Durasi harus lebih dari 0 dan maksimal 24 jam.");
    } else {
      let tarif1: number = 0;
      let tarif2: number = 0;

      // Menentukan tarif berdasarkan kendaraan.
      switch (kendaraan) {
        case "sepeda":
          tarif1 = sepeda1;
          tarif2 = sepeda2;
          break;
        case "motor":
          tarif1 = motor1;
          tarif2 = motor2;
          break;
        case "mobil":
          tarif1 = mobil1;
          tarif2 = mobil2;
          break;
        default:
          console.log("Jenis kendaraan tidak tersedia.");
          break;
      }

      // Memeriksa tarif kendaraan.
      if (tarif1 > 0 && durasi <= 24) {
        const metode: string = (
          await rl.question("Pembayaran (tunai/debit/e-wallet): ")
        ).trim().toLowerCase();

        let valid: boolean = false;

        // Memeriksa metode pembayaran.
        switch (metode) {
          case "tunai":
            valid = true;
            break;
          case "debit":
            valid = true;
            break;
          case "e-wallet":
            valid = true;
            break;
          default:
            console.log("Metode pembayaran tidak tersedia.");
            break;
        }

        // Menghitung biaya jika pembayaran valid.
        if (valid) {
          const jam: number = Math.ceil(durasi);
          let total: number = tarif1;
          total += (jam - 1) * tarif2;

          console.log("\n===== STRUK PARKIR =====");
          console.log("Kendaraan:", kendaraan);
          console.log("Durasi:", durasi, "jam");
          console.log("Pembayaran:", metode);
          console.log("Total: Rp" + total.toLocaleString("id-ID"));
        }
      }
    }
  } finally {
    // Menutup input setelah program selesai.
    rl.close();
  }
}

main();