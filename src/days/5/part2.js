self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const codes = input.split(",").map(l => parseInt(l));
    console.log(`${codes.length} pieces of input`);

    const getOutput = ({ noun, verb }) => {
      const memory = [].concat(codes);
      memory[1] = noun;
      memory[2] = verb;
      // console.log(memory.slice(0, 4));
      let head = 0;
      while (memory[head] !== 99) {
        if (memory[head] === 1) {
          memory[memory[head + 3]] =
            memory[memory[head + 1]] + memory[memory[head + 2]];
        } else if (memory[head] === 2) {
          memory[memory[head + 3]] =
            memory[memory[head + 1]] * memory[memory[head + 2]];
        } else {
          return;
        }
        head += 4;
      }
      return memory[0];
    };

    let complete = 0;
    let lastProgress = new Date().getTime();
    for (let noun = 0; noun < 100; noun++) {
      for (let verb = 0; verb < 100; verb++) {
        const output = getOutput({ noun, verb });
        if (output === 19690720) {
          postMessage({ command: "RESULT", result: noun * 100 + verb });
          return;
        }
        if (new Date().getTime() - lastProgress > 1 / 30) {
          lastProgress = new Date().getTime();

          postMessage({
            command: "PROGRESS",
            complete: noun * 100 + verb,
            total: 100 * 100
          });
        }
      }
    }
    postMessage({ command: "RESULT", result: "NOTFOUND" });
  }
};

console.log("Worker loaded");
