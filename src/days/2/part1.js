self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));
    console.log(`${codes.length} pieces of input`);

    // postMessage({ command: "PROGRESS", total: 0 });

    // postMessage({ command: "RESULT", result: });
  }
};

console.log("Worker loaded");
