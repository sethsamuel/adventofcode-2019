self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));
    // const test =
    //   "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";
    // const test = "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0";
    // const test =
    // "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10";
    // const codes = test.split(",").map(l => parseInt(l));

    console.log(`${codes.length} pieces of input`);

    const Machine = ({ codes = [] } = {}) => {
      const inputs = [];
      const memory = [...codes];
      const getValue = (address, mode) => {
        if (mode === 0 && (address < 0 || address >= memory.length)) {
          throw "Address out of bounds";
        }
        return mode === 0 ? memory[address] : address;
      };
      let head = 0;
      let output = 0;
      const run = () => {
        let lastHead;
        while (memory[head] !== 99) {
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
            const arg1 = getValue(memory[head + 1], modes[2]);
            const arg2 = getValue(memory[head + 2], modes[1]);

            if (modes[0] === 0) {
              // console.log(
              //   `Updating ${memory[head + 3]} with params ${arg1} ${arg2}`
              // );
              const value = op === 1 ? arg1 + arg2 : arg1 * arg2;
              if (isNaN(value)) {
                debugger;
              }
              memory[memory[head + 3]] = value;
            } else {
              console.error("Write in immediate mode");
              return [null, false];
              memory[head + 3] = op === 1 ? arg1 + arg2 : arg1 * arg2;
            }
            step = 4;
          } else if (op === 3) {
            if (inputs.length < 1) {
              //Await input
              return [output, false];
            }
            // console.log("Placing input in ", memory[head + 1]);
            memory[memory[head + 1]] = inputs.shift();
            step = 2;
          } else if (op === 4) {
            // console.log("Output in address");
            output = getValue(memory[head + 1], modes[2]);
            if (isNaN(output)) {
              debugger;
            }
            step = 2;
          } else if (op === 5 || op === 6) {
            const test = getValue(memory[head + 1], modes[2]);
            const pointer = getValue(memory[head + 2], modes[1]);

            if ((op === 5 && test !== 0) || (op === 6 && test === 0)) {
              head = pointer;
              step = 0;
            } else {
              step = 3;
            }
          } else if (op === 7 || op === 8) {
            const arg1 = getValue(memory[head + 1], modes[2]);
            const arg2 = getValue(memory[head + 2], modes[1]);
            if ((op === 7 && arg1 < arg2) || (op === 8 && arg1 === arg2)) {
              memory[memory[head + 3]] = 1;
            } else {
              memory[memory[head + 3]] = 0;
            }
            step = 4;
          } else {
            console.error("Unknown op");
            return [null, false];
          }
          head += step;
        }
        return [output, true];
      };
      const addInput = input => {
        inputs.push(input);
      };

      return { run, addInput };
    };

    const isValidPhases = phases => {
      for (let i in phases) {
        if (phases[i] < 5) {
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

      // console.log("Phase", phases);

      const machines = phases.map(p => {
        const machine = Machine({ codes });
        machine.addInput(p);
        return machine;
      });

      machines[0].addInput(0);
      for (let i = 0; i < machines.length; i++) {
        // console.log("Running machine", i);
        const result = machines[i].run();
        const [output, halted] = result;
        // console.log(`Machine ${i} outputted ${output} and halted: ${halted}`);
        if (isNaN(output) || output > 139629729) {
          throw "Output out of range";
        }
        if (i === machines.length - 1) {
          if (halted) {
            lastOutput = output;
          } else {
            i = -1;
            machines[i + 1].addInput(output);
          }
        } else {
          machines[i + 1].addInput(output);
        }
      }

      if (lastOutput > maxPhaseValue) {
        // console.log("New best phase", phases);
        maxPhaseValue = lastOutput;
        maxPhase = phases;
      }

      if (new Date().getTime() - lastProgress > 1 / 30) {
        lastProgress = new Date().getTime();
        // postMessage({
        //   command: "PROGRESS",
        //   complete: i,
        //   total
        // });
      }
    }

    console.log("Best phase", maxPhase);
    postMessage({ command: "RESULT", result: maxPhaseValue });
    return;
  }
};

console.log("Worker loaded");
