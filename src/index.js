import "./index.css";
import { h, render } from "preact";
import Day from "./components/day";
import { Block, Grid } from "jsxstyle/preact";

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

const days = Array(10)
  .fill(0)
  .map((_v, i) => i + 1);

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
    <Grid
      mediaQueries={{
        sm: "screen and (max-width: 640px)",
        lg: "screen and (min-width: 850px)"
      }}
      gridTemplateColumns="repeat(2,1fr)"
      gridRowGap="1rem"
      gridColumnGap="1rem"
      smGridTemplateColumns="repeat(1,1fr)"
      lgGridTemplateColumns="repeat(3,1fr)"
      maxWidth="1080px"
      margin="0 auto"
    >
      {days.reverse().map(d => (
        <Day day={d} />
      ))}
    </Grid>
  </Block>
);

render(App, document.getElementById("root"));

console.log("Running");
