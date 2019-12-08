self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const parseInput = input => {
      return input
        .split("\n")
        .map(w =>
          w
            .split(",")
            .map(c => [c.trim().slice(0, 1), parseInt(c.trim().slice(1))])
        );
    };
    // const wires = parseInput(`R75,D30,R83,U83,L12,D49,R71,U7,L72
    // U62,R66,U55,R34,D71,R55,D58,R83`);
    // const wires = parseInput(`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
    // U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`);
    const wires = parseInput(input);

    console.log(wires);

    const segments = wires.map(move =>
      move.reduce(
        (segments, move) => {
          if (move[0] === "U" || move[0] === "D") {
            const dy = move[1] * (move[0] === "D" ? -1 : 1);
            const nextPoint = {
              x: segments.cursor.x,
              y: segments.cursor.y + dy
            };
            return {
              cursor: nextPoint,
              steps: segments.steps + Math.abs(dy),
              h: segments.h,
              v: [
                ...segments.v,
                dy > 0
                  ? {
                      start: segments.cursor,
                      end: nextPoint,
                      steps: segments.steps
                    }
                  : {
                      start: nextPoint,
                      end: segments.cursor,
                      steps: segments.steps
                    }
              ]
            };
          } else if (move[0] === "R" || move[0] === "L") {
            const dx = move[1] * (move[0] === "L" ? -1 : 1);
            const nextPoint = {
              x: segments.cursor.x + dx,
              y: segments.cursor.y
            };
            return {
              cursor: nextPoint,
              steps: segments.steps + Math.abs(dx),
              h: [
                ...segments.h,
                dx > 0
                  ? {
                      start: segments.cursor,
                      end: nextPoint,
                      steps: segments.steps
                    }
                  : {
                      start: nextPoint,
                      end: segments.cursor,
                      steps: segments.steps
                    }
              ],
              v: segments.v
            };
          } else {
            throw `Bad input, unknown move ${move}`;
          }
        },
        { cursor: { x: 0, y: 0 }, steps: 0, h: [], v: [] }
      )
    );
    console.log(segments);

    let intersections = [];
    for (let horizontal of segments[0].h) {
      for (let vertical of segments[1].v) {
        if (
          horizontal.start.y >= vertical.start.y &&
          horizontal.start.y <= vertical.end.y &&
          vertical.start.x >= horizontal.start.x &&
          vertical.start.x <= horizontal.end.x
        ) {
          intersections.push({
            x: vertical.start.x,
            y: horizontal.start.y,
            steps:
              vertical.steps +
              Math.abs(vertical.start.y - horizontal.start.y) +
              horizontal.steps +
              Math.abs(horizontal.start.x - vertical.start.x)
          });
        }
      }
    }
    for (let horizontal of segments[1].h) {
      for (let vertical of segments[0].v) {
        if (
          horizontal.start.y >= vertical.start.y &&
          horizontal.start.y <= vertical.end.y &&
          vertical.start.x >= horizontal.start.x &&
          vertical.start.x <= horizontal.end.x
        ) {
          intersections.push({
            x: vertical.start.x,
            y: horizontal.start.y,
            steps:
              vertical.steps +
              Math.abs(vertical.start.y - horizontal.start.y) +
              horizontal.steps +
              Math.abs(horizontal.start.x - vertical.start.x)
          });
        }
      }
    }

    console.log(intersections);
    let result = intersections.reduce(
      (closest, i) =>
        (i.x !== 0 || i.y !== 0) && i.steps < closest ? i.steps : closest,
      Number.MAX_SAFE_INTEGER
    );

    postMessage({ command: "RESULT", result });
  }
};

console.log("Worker loaded");
