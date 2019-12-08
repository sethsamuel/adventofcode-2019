import "./index.css";
import { h, render } from "preact";
import { Block, Grid, InlineBlock, Column, Col } from "jsxstyle/preact";

const worker1 = new Worker("./days/1/part1.js");
worker1.onmessage = e => {
  console.log("Messag from worker", e);
  const { command } = e.data;
  if (command === "RESULT") {
    console.log("Result", e.data.result);
  }
};

const start = async () => {
  console.log("Starting");
  const input = await import("./days/1/input.txt");

  worker1.postMessage({ command: "START", input });
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
      <Col border="1px solid black" padding="2rem" alignItems="center">
        <Block fontWeight="500" fontSize="2rem">
          Day 1
        </Block>
        <InlineBlock
          component="button"
          margin="0 auto"
          props={{ onClick: start }}
        >
          Start
        </InlineBlock>
      </Col>
    </Grid>
  </Block>
);

render(App, document.getElementById("root"));

console.log("Running");
