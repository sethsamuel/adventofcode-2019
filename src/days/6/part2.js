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
    K)L
    K)YOU
    I)SAN`;
    // const lines = test.split("\n").map(l => l.trim());
    const lines = input.split("\n");

    console.log(lines.sort());
    const orbits = {};
    for (let line of lines) {
      const objects = line.split(")");
      orbits[objects[0]] = orbits[objects[0]] || {
        children: [],
        ancestors: []
      };
      orbits[objects[1]] = orbits[objects[1]] || {
        children: [],
        ancestors: []
      };
      orbits[objects[0]].children = [
        ...orbits[objects[0]].children,
        objects[1]
      ];
      orbits[objects[1]].parent = objects[0];
    }
    console.log(orbits);
    let center = _.find(orbits, o => !o.parent);
    console.log(center);

    const buildAncestors = key => {
      let parent = orbits[key].parent;
      while (parent) {
        orbits[key].ancestors.push(parent);
        parent = orbits[parent].parent;
      }
    };
    buildAncestors("YOU");
    buildAncestors("SAN");
    console.log(orbits["YOU"]);
    console.log(orbits["SAN"]);
    const fca = orbits["YOU"].ancestors.find(n =>
      orbits["SAN"].ancestors.includes(n)
    );
    console.log("FCA", fca);

    let distance =
      orbits["YOU"].ancestors.indexOf(fca) +
      orbits["SAN"].ancestors.indexOf(fca);

    postMessage({ command: "RESULT", result: distance });
  }
};

console.log("Worker loaded");
