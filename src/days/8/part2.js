import _ from "lodash";
self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const pixels = input.split("").map(i => parseInt(i));
    // const pixels = "0222112222120000".split("").map(i => parseInt(i));

    const width = 25;
    const height = 6;

    // const width = 2;
    // const height = 2;
    const image = Array(height)
      .fill(0)
      .map(i => Array(width).fill(2));
    console.log("Initial", [...image]);
    for (
      let layer = pixels.length / (width * height) - 1;
      layer >= 0;
      layer--
    ) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let pixel = pixels[layer * width * height + y * width + x];
          if (isNaN(pixel)) {
            debugger;
          }
          if (pixel !== 2) {
            image[y][x] = pixel;
          }
        }
      }
    }
    console.log(image);
    const result = image
      .map(row => row.map(i => (i === 0 ? " " : "O")).join(""))
      .join("\n");
    console.log(result);

    postMessage({ command: "RESULT", result });
  }
};

console.log("Worker loaded");
