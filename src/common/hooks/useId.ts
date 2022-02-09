import { useState } from "react";

let counter = 0;

export default function useId(prefix: string, defaultId?: string): string {
  const [idNumber] = useState(() => counter++);
  return defaultId ?? `${prefix}${idNumber}`;
}
