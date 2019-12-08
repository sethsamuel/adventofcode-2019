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

const days = [1, 2, 3];

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
        sm: "screen and (max-width: 780px)",
        lg: "screen and (min-width: 1280px)"
      }}
      gridTemplateColumns="repeat(3,1fr)"
      smGridTemplateColumns="repeat(1,1fr)"
      lgGridTemplateColumns="repeat(4,1fr)"
    >
      {days.map(d => (
        <Day day={d} />
      ))}
    </Grid>
  </Block>
);

render(App, document.getElementById("root"));

console.log("Running");
