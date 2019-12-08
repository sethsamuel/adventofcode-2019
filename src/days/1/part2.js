self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n").map(l => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const fuelRequired = mass => {
      //   for (let i = 0; i <= 100000000; i++) {
      //     3 + 5;
      //   }
      const fuel = Math.max(0, Math.floor(mass / 3) - 2);
      if (fuel > 0) {
        return fuel + fuelRequired(fuel);
      } else {
        return fuel;
      }
    };

    let complete = 0;
    let lastProgress = new Date().getTime();

    const totalFuel = lines.reduce((sum, mass) => {
      const newSum = sum + fuelRequired(mass);
      complete++;
      if (new Date().getTime() - lastProgress > 1 / 30) {
        lastProgress = new Date().getTime();

        postMessage({ command: "PROGRESS", complete, total: lines.length });
      }
      return newSum;
    }, 0);
    postMessage({ command: "RESULT", result: totalFuel });
  }
  //   const input = await import("./input.txt");
};

console.log("Worker loaded");
