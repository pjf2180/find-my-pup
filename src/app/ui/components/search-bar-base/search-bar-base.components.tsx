"use client";
import clsx from "clsx";
import { ReactNode, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import React from "react";

interface SearchBarBaseProps {
  children: ReactNode;
  onSelectionChange: (idx: number) => void;
}

export function SearchBarBase({ children, onSelectionChange }: SearchBarBaseProps) {
  const [activeOptionIdx, setActiveOptionIdx] = useState(-1);
  const barIsActive = activeOptionIdx > -1;
  const containerRef = useRef<HTMLDivElement>(null);
  const options = React.Children.toArray(children);
  console.log(options);

  useClickOutside(containerRef, () => {
    setActiveOptionIdx(-1);
  });

  const handleOptionChange = (i: number) => {
    setActiveOptionIdx(i);
    onSelectionChange(i);
  };

  return (
    <div className="w-[768px] flex flex-col p-4 gap-4" ref={containerRef}>
      {/* BAR */}
      <div
        className={clsx(
          "relative flex items-center bg-white rounded-full shadow-md max-w-3xl border h-20 overflow-hidden",

          { "bg-[rgba(232,232,232)]": barIsActive }
        )}
      >
        {options.map((option, i) => {
          const directionToActive = getDirectionToActiveOption(
            i,
            activeOptionIdx
          );
          const nextToActive = Math.abs(activeOptionIdx - i) === 1;

          return (
            <div
              key={i}
              className={clsx("flex-1 h-full cursor-pointer", {})}
              onClick={() => handleOptionChange(i)}
            >
              <div
                className={clsx("relative flex flex-row h-full group", {
                  "justify-end": nextToActive && directionToActive === "right",
                  "justify-center":
                    nextToActive && directionToActive === "rightOn",
                })}
              >
                <div
                  key={i}
                  className={clsx(
                    "absolute top-0 left-0 right-0 bottom-0 h-full w-full flex justify-between items-center rounded-full px-4 py-4 pr-0 cursor-pointer",
                    {
                      "bg-white": activeOptionIdx == i,
                      "z-30": directionToActive === "rightOn",
                      "z-20": directionToActive !== "rightOn",
                    },
                    {
                      "group-hover:bg-[rgba(216,216,216)]":
                        activeOptionIdx !== i && activeOptionIdx != -1,
                    },
                    {
                      "hover:bg-[rgba(216,216,216)]":
                        activeOptionIdx != i && !barIsActive,
                    }
                  )}
                  onClick={() => handleOptionChange(i)}
                >
                  {option}
                </div>

                <div
                  className={clsx("w-1/2  bg-blue", {
                    "group-hover:bg-[rgba(216,216,216)]":
                      directionToActive != "rightOn" &&
                      barIsActive &&
                      nextToActive,
                    "group-hover:translate-x-1/2":
                      directionToActive === "right" && barIsActive,
                    "group-hover:-translate-x-1/2":
                      directionToActive === "left" && barIsActive,
                  })}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getDirectionToActiveOption(currentIdx: number, activeIdx: number) {
  if (currentIdx === activeIdx) {
    return "rightOn";
  } else if (currentIdx < activeIdx) {
    return "right";
  } else {
    return "left";
  }
}
