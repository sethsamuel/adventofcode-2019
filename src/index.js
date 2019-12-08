import "./index.css";
import { h, render } from "preact";
import { useState } from "preact/hooks";
import { Block, Grid, InlineBlock, Column, Col } from "jsxstyle/preact";
import Stats from "stats.js";
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = "auto";
stats.dom.style.right = "0";
document.body.appendChild(stats.dom);
function animate() {
  stats.begin();

  stats.end();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

const Day = ({}) => {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState();

  const start1 = async () => {
    console.log("Starting");
    const worker = new Worker("./days/1/part1.js");
    worker.onmessage = e => {
      console.log("Messag from worker", e);
      const { command } = e.data;
      if (command === "RESULT") {
        console.log("Result", e.data.result);
        setResult(e.data.result);
        setProgress(1);
      } else if (command === "PROGRESS") {
        const { complete, total } = e.data;
        console.log("Progress", complete / total);
        setProgress(complete / total);
      }
    };
    const input = await import("./days/1/input.txt");

    worker.postMessage({ command: "START", input });
  };

  const start2 = async () => {
    console.log("Starting");
    const worker = new Worker("./days/1/part2.js");
    worker.onmessage = e => {
      console.log("Messag from worker", e);
      const { command } = e.data;
      if (command === "RESULT") {
        console.log("Result", e.data.result);
        setResult(e.data.result);
        setProgress(1);
      } else if (command === "PROGRESS") {
        const { complete, total } = e.data;
        console.log("Progress", complete / total);
        setProgress(complete / total);
      }
    };
    const input = await import("./days/1/input.txt");

    worker.postMessage({ command: "START", input });
  };

  return (
    <Col border="1px solid black" padding="2rem" alignItems="center">
      <Block fontWeight="500" fontSize="2rem">
        Day 1
      </Block>
      {progress < 1 ? (
        <InlineBlock
          component="progress"
          width="100%"
          props={{ max: 1, value: progress.toString() }}
        />
      ) : (
        result
      )}

      <InlineBlock
        component="button"
        margin="0 auto"
        props={{ onClick: start1 }}
      >
        Start Part 1
      </InlineBlock>
      <InlineBlock
        component="button"
        margin="0 auto"
        props={{ onClick: start2 }}
      >
        Start Part 2
      </InlineBlock>
    </Col>
  );
};

const App = (
  <Block padding="4rem">
    <Block
      mediaQueries={{
        sm: "screen and (max-width: 640px)"
      }}
      fontSize="4rem"
      smFontSize="3rem"
      smTextAlign="center"
    >
      Advent of Code 2019
    </Block>
    <Block textAlign="center" marginTop="2rem">
      Let's build some weird shit.
    </Block>
    <Grid gridTemplateColumns="repeat(4,1fr)">
      <Day />
    </Grid>
  </Block>
);

render(App, document.getElementById("root"));

console.log("Running");
