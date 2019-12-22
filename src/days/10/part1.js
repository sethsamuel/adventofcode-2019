import _ from "lodash";
self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    // const pixels = input.split("").map(i => parseInt(i));
    // const test = `
    // ......#.#.
    // #..#.#....
    // ..#######.
    // .#.#.###..
    // .#..#.....
    // ..#....#.#
    // #..#....#.
    // .##.#..###
    // ##...#..#.
    // .#....####`;
    // const test = `
    // .#..#
    // .....
    // #####
    // ....#
    // ...##`;

    const pixels = input
      .trim()
      .split("\n")
      .map(r => r.trim().split(""));
    console.log(pixels);

    const counts = {};
    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        if (pixels[y][x] !== "#") {
          continue;
        }
        let count = 0;
        let hits = [];
        for (let yStep = -pixels.length; yStep < pixels.length; yStep++) {
          for (
            let xStep = -pixels[y].length;
            xStep < pixels[y].length;
            xStep++
          ) {
            if (yStep === 0 && xStep === 0) {
              continue;
            }
            if (x + xStep < 0 || x + xStep >= pixels[y].length) {
              continue;
            }
            if (y + yStep < 0 || y + yStep >= pixels.length) {
              continue;
            }
            if (
              hits.find(
                ([hitX, hitY]) =>
                  (hitX === 0 && xStep === 0 && hitY / yStep > 0) ||
                  (hitY === 0 && yStep === 0 && hitX / xStep > 0) ||
                  (yStep / xStep === hitY / hitX &&
                    yStep / hitY > 0 &&
                    xStep / hitX > 0)
              )
            ) {
              continue;
            }
            if (pixels[y + yStep][x + xStep] === "#") {
              count++;
              hits.push([xStep, yStep]);
            }
          }
        }
        if (x === 2 && y === 2) {
          console.log(hits);
        }
        counts[`${x},${y}`] = count;
      }
    }

    console.log(counts);
    const bestCount = _.maxBy(Object.keys(counts), k => counts[k]);

    postMessage({
      command: "RESULT",
      result: `${bestCount}: ${counts[bestCount]}`
    });
  }
};

console.log("Worker loaded");
