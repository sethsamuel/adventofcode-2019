import _ from "lodash";
self.onmessage = async e => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const test = `COM)B
    B)C
    C)D
    D)E
    E)F
    B)G
    G)H
    D)I
    E)J
    J)K
    K)L`;
    // const lines = test.split("\n").map(l => l.trim());
    const lines = input.split("\n");

    console.log(lines.sort());
    const orbits = {};
    for (let line of lines) {
      const objects = line.split(")");
      orbits[objects[0]] = orbits[objects[0]] || { children: [] };
      orbits[objects[1]] = orbits[objects[1]] || { children: [] };
      orbits[objects[0]].children = [
        ...orbits[objects[0]].children,
        objects[1]
      ];
      orbits[objects[1]].parent = objects[0];
    }
    console.log(orbits);
    let center = _.find(orbits, o => !o.parent);
    console.log(center);
    const countOrbits = (object, depth) =>
      object.children.length +
      Math.max(0, depth - 1) +
      _.reduce(
        object.children,
        (sum, k) => sum + countOrbits(orbits[k], depth + 1),
        0
      );

    let checksum = countOrbits(center, 0);

    postMessage({ command: "RESULT", result: checksum });
  }
};

console.log("Worker loaded");
