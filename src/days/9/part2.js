import _ from "lodash";

self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));

    // const test = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99";
    // const test = "1102,34915192,34915192,7,4,7,99,0";
    // const test = "104,1125899906842624,99";
    // const codes = test.split(",").map(l => parseInt(l));

    console.log(`${codes.length} pieces of input`);

    const Machine = ({ codes = [] } = {}) => {
      const inputs = [];
      const memory = [...codes];
      let base = 0;
      const getValue = (address, mode) => {
        if ((mode === 0 && address < 0) || (mode === 2 && address + base < 0)) {
          throw "Address out of bounds";
        }
        switch (mode) {
          case 0:
            return memory[address] || 0;
          case 2:
            return memory[address + base] || 0;
          case 1:
            return address;
        }
        throw "Unknown mode";
      };
      let head = 0;
      let outputs = [];
      const run = () => {
        while (memory[head] !== 99) {
          if (_.isNil(memory[head]) || _.isNil(memory[head + 1])) {
            // debugger;
          }
          const instruction = (memory[head] || 0).toString().padStart(5, "0");
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

            const value = op === 1 ? arg1 + arg2 : arg1 * arg2;
            if (isNaN(value)) {
              debugger;
            }
            // console.log(
            //   `Updating ${memory[head + 3]} with params ${arg1} ${arg2}`
            // );
            if (modes[0] === 0) {
              memory[memory[head + 3]] = value;
            } else if (modes[0] === 2) {
              memory[base + memory[head + 3]] = value;
            } else {
              throw "Write in immediate mode";
            }
            step = 4;
          } else if (op === 3) {
            if (inputs.length < 1) {
              //Await input
              return [outputs, false];
            }
            // console.log("Placing input in ", memory[head + 1]);
            // debugger;
            const value = inputs.shift();
            if (modes[2] === 0) {
              memory[memory[head + 1]] = value;
            } else if (modes[2] === 2) {
              memory[base + memory[head + 1]] = value;
            } else {
              throw "Write in immediate mode";
            }
            step = 2;
          } else if (op === 4) {
            const output = getValue(memory[head + 1], modes[2]);
            console.log(`Output ${output}`);
            if (isNaN(output)) {
              debugger;
            }
            outputs.push(output);
            step = 2;
          } else if (op === 5 || op === 6) {
            const test = getValue(memory[head + 1], modes[2]);
            const pointer = getValue(memory[head + 2], modes[1]);
            if (_.isNil(memory[pointer])) {
              debugger;
            }
            if ((op === 5 && test !== 0) || (op === 6 && test === 0)) {
              head = pointer;
              step = 0;
            } else {
              step = 3;
            }
          } else if (op === 7 || op === 8) {
            const arg1 = getValue(memory[head + 1], modes[2]);
            const arg2 = getValue(memory[head + 2], modes[1]);
            const value =
              (op === 7 && arg1 < arg2) || (op === 8 && arg1 === arg2) ? 1 : 0;
            if (modes[0] === 0) {
              memory[memory[head + 3]] = value;
            } else if (modes[0] === 2) {
              memory[base + memory[head + 3]] = value;
            }
            step = 4;
          } else if (op === 9) {
            base += getValue(memory[head + 1], modes[2]);
            step = 2;
          } else {
            console.error("Unknown op");
            return [null, false];
          }
          head += step;
          if (_.isNil(memory[head]) || _.isNil(memory[head + 1])) {
            // debugger;
          }
        }
        return [outputs, true];
      };
      const addInput = input => {
        inputs.push(input);
      };

      return { run, addInput };
    };

    const machine = Machine({ codes });
    machine.addInput(2);
    let isComplete = false;
    const outputs = [];
    while (!isComplete) {
      const result = machine.run();
      const [output, halted] = result;
      outputs.push(output);
      console.log(output);
      isComplete = halted;
    }

    postMessage({ command: "RESULT", result: outputs.join(",") });
    return;
  }
};

console.log("Worker loaded");
