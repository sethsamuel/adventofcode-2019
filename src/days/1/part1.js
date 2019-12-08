self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n").map(l => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const fuelRequired = mass => {
      return Math.floor(mass / 3) - 2;
    };

    const totalFuel = lines.reduce((sum, mass) => sum + fuelRequired(mass), 0);
    postMessage({ command: "RESULT", result: totalFuel });
  }
  //   const input = await import("./input.txt");
};

console.log("Worker loaded");
