import { h } from "preact";
import { useState } from "preact/hooks";
import { Block, InlineBlock, Col, Row } from "jsxstyle/preact";

// import inputs from "../days/*/input.txt";
const inputs = {
  1: import("../days/1/input.txt"),
  2: import("../days/2/input.txt")
};
const workers = {
  "1.1": new Worker("../days/1/part1.js"),
  "1.2": new Worker("../days/1/part2.js"),
  "2.1": new Worker("../days/2/part1.js")
  //   "2.2": new Worker("../days/2/part2.js")
};

const Day = ({ day }) => {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState();

  const start = async part => {
    console.log("Starting");
    const worker = workers[`${day}.${part}`];
    // const worker = new Worker(`../days/${day}/part${part}.js`);
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
    // const input = await (async () => {
    //   if (day === "1") {
    //     return await import("../days/1/input.txt");
    //   } else {
    //     return "";
    //   }
    // });

    const input = await inputs[day];
    worker.postMessage({ command: "START", input });
  };

  return (
    <Col border="1px solid black" padding="2rem" alignItems="center">
      <Block fontWeight="500" fontSize="2rem">
        Day {day}
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
      <Row>
        <InlineBlock
          component="button"
          margin="0 auto"
          marginRight="0.5rem"
          props={{ onClick: () => start(1) }}
        >
          Part 1
        </InlineBlock>
        <InlineBlock
          component="button"
          margin="0 auto"
          props={{ onClick: () => start(2) }}
        >
          Part 2
        </InlineBlock>
      </Row>
    </Col>
  );
};

export default Day;
