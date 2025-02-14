import { useState, useRef } from "react";

export function useDebouncedState(
  initialValue: string,
  delay: number,
  callback: (value: string) => void
): [string, (v: string) => void] {

  const debounceFnRef = useRef(createDebouncedFn(delay));
  const [state, setState] = useState<string>(initialValue);

  const handleSetState = (v: string) => {
    setState(v);
    debounceFnRef.current(v, callback);
  };
  return [state, handleSetState];
}

function createDebouncedFn(delay: number) {
  let timeoutId: NodeJS.Timeout;
  const fn = (value: string, cb: (v: string) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(value);
    }, delay);
  };
  return fn;
}
