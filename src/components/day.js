import { h } from "preact";
import { useState } from "preact/hooks";
import { Block, InlineBlock, Col, Row } from "jsxstyle/preact";

const inputs = {
  1: import("../days/1/input.txt"),
  2: import("../days/2/input.txt"),
  3: import("../days/3/input.txt"),
  4: import("../days/4/input.txt"),
  5: import("../days/5/input.txt")
};

const workers = {
  "1.1": new Worker("../days/1/part1.js"),
  "1.2": new Worker("../days/1/part2.js"),
  "2.1": new Worker("../days/2/part1.js"),
  "2.2": new Worker("../days/2/part2.js"),
  "3.1": new Worker("../days/3/part1.js"),
  "3.2": new Worker("../days/3/part2.js"),
  "4.1": new Worker("../days/4/part1.js"),
  "4.2": new Worker("../days/4/part2.js"),
  "5.1": new Worker("../days/5/part1.js"),
  "5.2": new Worker("../days/5/part2.js")
};

const Day = ({ day }) => {
  const [progress, setProgress] = useState();
  const [result, setResult] = useState();
  const [isRunning, setIsRunning] = useState(false);

  const start = async part => {
    if (isRunning) {
      return;
    }
    console.log("Starting");
    setIsRunning(true);
    setResult(null);
    const worker = workers[`${day}.${part}`];
    // const worker = new Worker(`../days/${day}/part${part}.js`);
    // const worker = (() => {
    //   if (day === "1" && part === "1") {
    //     return new Worker("../days/1/part1.js");
    //   }
    // })();
    worker.onmessage = e => {
      console.log("Messag from worker", e);
      const { command } = e.data;
      if (command === "RESULT") {
        console.log("Result", e.data.result);
        setResult(e.data.result);
        setProgress(1);
        setIsRunning(false);
      } else if (command === "PROGRESS") {
        const { complete, total } = e.data;
        console.log("Progress", complete / total);
        setProgress(complete / total);
      }
    };

    const input = await inputs[day];
    worker.postMessage({ command: "START", input });
  };

  return (
    <Col border="1px solid black" padding="2rem" alignItems="center">
      <Block fontWeight="500" fontSize="2rem" marginBottom="1rem">
        Day {day}
      </Block>
      {result !== null ? (
        result
      ) : isRunning ? (
        <InlineBlock
          component="progress"
          width="100%"
          margin="2px 0"
          props={{
            max: 1,
            value: progress ? progress.toString() : undefined
          }}
        />
      ) : null}
      <Row marginTop="1rem">
        <InlineBlock
          component="button"
          margin="0 auto"
          marginRight="0.5rem"
          props={{ onClick: () => start("1") }}
        >
          Part 1
        </InlineBlock>
        <InlineBlock
          component="button"
          margin="0 auto"
          props={{ onClick: () => start("2") }}
        >
          Part 2
        </InlineBlock>
      </Row>
    </Col>
  );
};

export default Day;
