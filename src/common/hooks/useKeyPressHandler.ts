import { useEffect } from "react";

export default function useKeyPressHandler(
  eventName: "keydown" | "keyup",
  key: string,
  callback?: ((event: KeyboardEvent) => void) | null
) {
  useEffect(() => {
    if (!callback) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback(event);
      }
    };
    document.addEventListener(eventName, onKeyDown);
    return () => document.removeEventListener(eventName, onKeyDown);
  }, [key, callback, eventName]);
}
