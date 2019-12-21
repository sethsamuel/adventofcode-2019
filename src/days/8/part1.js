import _ from "lodash";
self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const pixels = input.split("").map(i => parseInt(i));

    const width = 25;
    const height = 6;
    let bestLayer = [Number.MAX_SAFE_INTEGER, 0, 0];
    for (let layer = 0; layer * width * height < pixels.length; layer++) {
      let counts = [0, 0, 0];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let pixel = pixels[layer * width * height + y * width + x];
          if (isNaN(pixel)) {
            debugger;
          }
          counts[pixel]++;
        }
      }
      if (counts[0] < bestLayer[0]) {
        bestLayer = counts;
      }
    }
    console.log(bestLayer);

    postMessage({ command: "RESULT", result: bestLayer[1] * bestLayer[2] });
  }
};

console.log("Worker loaded");
