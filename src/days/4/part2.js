self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const [start, end] = input.split("-").map(i => parseInt(i));
    let lastProgress = new Date().getTime();

    let matches = 0;
    const isMatch = i => {
      const digits = i
        .toString()
        .split("")
        .map(c => parseInt(c));

      let pairFound = false;
      for (let offset = 0; offset < digits.length; offset++) {
        if (digits[offset + 1] < digits[offset]) {
          return false;
        }
        if (pairFound) {
          continue;
        }
        if (digits[offset + 1] === digits[offset]) {
          if (offset === 0) {
            pairFound = digits[offset + 2] != digits[offset];
          } else if (offset === digits.length - 2) {
            pairFound = digits[offset - 1] != digits[offset];
          } else {
            pairFound =
              digits[offset - 1] != digits[offset] &&
              digits[offset + 2] != digits[offset];
          }
        }
      }
      return pairFound;
    };
    for (let i = start; i <= end; i++) {
      if (new Date().getTime() - lastProgress > 1 / 30) {
        lastProgress = new Date().getTime();

        postMessage({
          command: "PROGRESS",
          complete: i - start,
          total: end - start
        });
      }

      if (isMatch(i)) {
        matches++;
      }
    }

    postMessage({ command: "RESULT", result: matches });
  }
};

console.log("Worker loaded");
