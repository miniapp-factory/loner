"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  // Start spinning
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]); // clone
        // shift rows down
        for (let r = 2; r > 0; r--) {
          newGrid[r] = newGrid[r - 1];
        }
        // new top row
        newGrid[0] = Array.from({ length: 3 }, randomFruit);
        return newGrid;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // check win condition inline
      const checkWin = () => {
        // rows
        for (let r = 0; r < 3; r++) {
          if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) return true;
        }
        // columns
        for (let c = 0; c < 3; c++) {
          if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) return true;
        }
        return false;
      };
      setWin(checkWin());
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit.toLowerCase()}.png`}
            alt={fruit}
            width={80}
            height={80}
            className="border rounded"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-xl font-bold text-green-600">You Win!</span>
          <Share text={`I just won a fruit combo on the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
