"use client";

import { useEffect, useRef, useState } from "react";
import { luckyWheelSegments, type LuckyWheelReward } from "@/content/lucky-wheel";
import type { Messages } from "@/lib/i18n/messages";

const segmentAngle = 360 / luckyWheelSegments.length;
const spinDurationMs = 4600;

function randomSegmentIndex() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % luckyWheelSegments.length;
  }
  return Math.floor(Math.random() * luckyWheelSegments.length);
}

export function LuckyWheel({ copy }: { copy: Messages["luckyWheel"] }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<LuckyWheelReward | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function spin() {
    if (spinning) return;
    const index = randomSegmentIndex();
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const targetRotation = ((-index * segmentAngle) % 360 + 360) % 360;
    const alignment = (targetRotation - normalizedRotation + 360) % 360;
    const nextRotation = rotation + 5 * 360 + alignment;

    setResult(null);
    setSpinning(true);
    setRotation(nextRotation);
    timer.current = setTimeout(() => {
      setResult(luckyWheelSegments[index].reward);
      setSpinning(false);
    }, spinDurationMs);
  }

  return <div className="lucky-wheel-game">
    <div className="lucky-wheel-stage">
      <span className="lucky-wheel-pointer" aria-hidden="true" />
      <div
        className="lucky-wheel-disc"
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-hidden="true"
      >
        <svg className="lucky-wheel-labels" viewBox="0 0 100 100">
          {luckyWheelSegments.map((segment, index) => {
            const angle = index * segmentAngle - 90;
            const radians = angle * Math.PI / 180;
            const x = 50 + Math.cos(radians) * 35;
            const y = 50 + Math.sin(radians) * 35;
            const onDarkSegment = [2, 5, 8].includes(index);
            return <text
              className={`lucky-wheel-label ${segment.tone === "prize" || onDarkSegment ? "lucky-wheel-label-light" : ""}`}
              dominantBaseline="middle"
              key={segment.id}
              textAnchor="middle"
              transform={`rotate(${angle + 90} ${x} ${y})`}
              x={x}
              y={y}
            >{copy.rewards[segment.reward]}</text>;
          })}
        </svg>
        <span className="lucky-wheel-hub">SA</span>
      </div>
    </div>
    <button className="button lucky-wheel-spin" type="button" onClick={spin} disabled={spinning}>
      {spinning ? copy.spinning : result ? copy.spinAgain : copy.spin}
    </button>
    <div className="lucky-wheel-result" aria-live="polite" aria-atomic="true">
      {result && <><p>{result === "noPrize" ? copy.noPrizeTitle : copy.winnerTitle}</p><strong>{copy.rewards[result]}</strong><span>{result === "noPrize" ? copy.noPrizeBody : copy.winnerBody}</span></>}
    </div>
  </div>;
}

