import assert from "node:assert/strict";
import { luckyWheelSegments } from "../content/lucky-wheel.ts";

assert.equal(luckyWheelSegments.length, 10, "the demo wheel must have exactly 10 segments");
assert.equal(luckyWheelSegments.filter((segment) => segment.reward === "noPrize").length, 7, "seven segments must be no-prize outcomes");
assert.deepEqual(
  luckyWheelSegments.filter((segment) => segment.reward !== "noPrize").map((segment) => segment.reward).sort(),
  ["discount10000Krw", "discount10Percent", "discount50000Krw"].sort(),
  "the wheel must contain each approved sample reward exactly once",
);
assert.equal(new Set(luckyWheelSegments.map((segment) => segment.id)).size, 10, "segment IDs must be unique");

console.log("PASS lucky wheel has 10 unique segments, 7 no-prize outcomes and 3 approved demo rewards");
