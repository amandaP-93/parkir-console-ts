const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Menu:");
console.log("1. Addition");
console.log("2. Subtraction");
console.log("3. Multiplication");
console.log("4. Division");

rl.question("Enter number 1 : ", (input1: string) => {
    const num1 = Number(input1);

    rl.question("Enter number 2 : ", (input2: string) => {
        const num2 = Number(input2);

        rl.question("Enter your menu choice (1-4) : ", (inputChoice: string) => {
            const choice = Number(inputChoice);

            switch (choice) {
                case 1:
                    console.log(`Addition result ${num1} + ${num2} = ${num1 + num2}`);
                    break;

                case 2:
                    console.log(`Subtraction result ${num1} - ${num2} = ${num1 - num2}`);
                    break;

                case 3:
                    console.log(`Multiplication result ${num1} * ${num2} = ${num1 * num2}`);
                    break;

                case 4:
                    console.log(`Division result ${num1} / ${num2} = ${num1 / num2}`);
                    break;

                default:
                    console.log("Invalid menu choice!");
                    break;
            }

            rl.close();
        });
    });
});