self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));
    console.log(`${codes.length} pieces of input`);

    const getOutput = ({ input }) => {
      const memory = [].concat(codes);
      // memory[1] = 20;
      // memory[2] = 3;

      // console.log(memory.slice(0, 4));
      let head = 0;
      let output;
      let lastHead;
      while (memory[head] !== 99) {
        if (lastHead === head) {
          console.error("Loop");
          return;
        }
        lastHead = head;
        const instruction = memory[head].toString().padStart(5, "0");
        console.log(instruction);
        const op = parseInt(instruction.slice(3, 5));
        const modes = instruction
          .slice(0, 3)
          .split("")
          .map(i => parseInt(i));

        console.log(`Op: ${op} Modes: ${modes}`);

        let step = 0;
        if (op === 1 || op === 2) {
          const arg1 =
            modes[2] === 0 ? memory[memory[head + 1]] : memory[head + 1];
          const arg2 =
            modes[1] === 0 ? memory[memory[head + 2]] : memory[head + 2];
          if (modes[0] === 0) {
            console.log(
              `Updating ${memory[memory[head + 3]]} with params ${arg1} ${arg2}`
            );
            memory[memory[head + 3]] = op === 1 ? arg1 + arg2 : arg1 * arg2;
          } else {
            console.error("Write in immediate mode");
            return;
            memory[head + 3] = op === 1 ? arg1 + arg2 : arg1 * arg2;
          }
          step = 4;
        } else if (op === 3) {
          console.log("Placing input in ", memory[head + 1]);
          memory[memory[head + 1]] = input;
          step = 2;
        } else if (op === 4) {
          console.log("Output in address");
          output = modes[2] === 0 ? memory[memory[head + 1]] : memory[head + 1];
          if (output !== 0) {
            console.log("Error", memory[head + 1], memory[memory[head + 1]]);
            // return null;
          }
          step = 2;
        } else {
          console.error("Unknown op");
          return;
        }
        head += step;
      }
      return output;
    };

    const output = getOutput({ input: 1 });
    postMessage({ command: "RESULT", result: output });
    return;
  }
};

console.log("Worker loaded");
