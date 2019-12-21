self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));
    // const test = "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0";
    // const test =
    //   "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0";
    // const codes = test.split(",").map(l => parseInt(l));

    console.log(`${codes.length} pieces of input`);

    const getOutput = ({ inputs = [] }) => {
      const memory = [].concat(codes);

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
        // console.log(instruction);
        const op = parseInt(instruction.slice(3, 5));
        const modes = instruction
          .slice(0, 3)
          .split("")
          .map(i => parseInt(i));

        // console.log(`Op: ${op} Modes: ${modes}`);

        let step = 0;
        if (op === 1 || op === 2) {
          const arg1 =
            modes[2] === 0 ? memory[memory[head + 1]] : memory[head + 1];
          const arg2 =
            modes[1] === 0 ? memory[memory[head + 2]] : memory[head + 2];
          if (modes[0] === 0) {
            // console.log(
            //   `Updating ${memory[memory[head + 3]]} with params ${arg1} ${arg2}`
            // );
            memory[memory[head + 3]] = op === 1 ? arg1 + arg2 : arg1 * arg2;
          } else {
            console.error("Write in immediate mode");
            return;
            memory[head + 3] = op === 1 ? arg1 + arg2 : arg1 * arg2;
          }
          step = 4;
        } else if (op === 3) {
          // console.log("Placing input in ", memory[head + 1]);
          memory[memory[head + 1]] = inputs.shift();
          step = 2;
        } else if (op === 4) {
          // console.log("Output in address");
          output = modes[2] === 0 ? memory[memory[head + 1]] : memory[head + 1];
          if (output !== 0) {
            // console.log("Error", memory[head + 1], memory[memory[head + 1]]);
            // return null;
          }
          step = 2;
        } else if (op === 5 || op === 6) {
          const test =
            modes[2] === 0 ? memory[memory[head + 1]] : memory[head + 1];
          const pointer =
            modes[1] === 0 ? memory[memory[head + 2]] : memory[head + 2];
          if ((op === 5 && test !== 0) || (op === 6 && test === 0)) {
            head = pointer;
            step = 0;
          } else {
            step = 3;
          }
        } else if (op === 7 || op === 8) {
          const arg1 =
            modes[2] === 0 ? memory[memory[head + 1]] : memory[head + 1];
          const arg2 =
            modes[1] === 0 ? memory[memory[head + 2]] : memory[head + 2];
          if ((op === 7 && arg1 < arg2) || (op === 8 && arg1 === arg2)) {
            memory[memory[head + 3]] = 1;
          } else {
            memory[memory[head + 3]] = 0;
          }
          step = 4;
        } else {
          console.error("Unknown op");
          return;
        }
        head += step;
      }
      return output;
    };

    const isValidPhases = phases => {
      for (let i in phases) {
        if (phases[i] > 4) {
          return false;
        }
        for (let j in phases) {
          if (i !== j && phases[i] === phases[j]) {
            return false;
          }
        }
      }
      return true;
    };

    const ampCount = 5;
    const total = Math.pow(10, ampCount);
    let lastProgress = new Date().getTime();
    let maxPhaseValue = 0;
    let maxPhase = [];
    for (let i = 0; i < total; i++) {
      let phases = i
        .toString()
        .padStart(ampCount, "0")
        .split("")
        .map(p => parseInt(p));
      if (!isValidPhases(phases)) {
        continue;
      }

      let lastOutput = 0;
      for (let phase of phases) {
        lastOutput = getOutput({ inputs: [phase, lastOutput] });
      }
      if (lastOutput > maxPhaseValue) {
        console.log("New best phase", phases);
        maxPhaseValue = lastOutput;
        maxPhase = phases;
      }

      if (new Date().getTime() - lastProgress > 1 / 30) {
        lastProgress = new Date().getTime();
        postMessage({
          command: "PROGRESS",
          complete: i,
          total
        });
      }
    }

    console.log("Best phase", maxPhase);
    postMessage({ command: "RESULT", result: maxPhaseValue });
    return;
  }
};

console.log("Worker loaded");
