self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));
    console.log(`${codes.length} pieces of input`);

    codes[1] = 12;
    codes[2] = 2;

    let head = 0;
    while (codes[head] !== 99) {
      if (codes[head] === 1) {
        codes[codes[head + 3]] =
          codes[codes[head + 1]] + codes[codes[head + 2]];
      } else if (codes[head] === 2) {
        codes[codes[head + 3]] =
          codes[codes[head + 1]] * codes[codes[head + 2]];
      } else {
        console.error("Bad op", codes[head]);
        postMessage({ command: "RESULT", result: "ERR" });
        return;
      }
      head += 4;
    }
    postMessage({ command: "RESULT", result: codes[0] });
  }
};

console.log("Worker loaded");
