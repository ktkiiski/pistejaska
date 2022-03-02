import {
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface LongPressEventHandlers<Element> {
  onTouchStart: TouchEventHandler<Element>;
  onTouchEnd: TouchEventHandler<Element>;
}

const defaultLongPressDelay = 300;

export default function useLongPress<Element>(
  onLongPress: (event: TouchEvent) => void,
  delay = defaultLongPressDelay
): [boolean, LongPressEventHandlers<Element>] {
  const [pressEvent, setPressEvent] = useState<TouchEvent>();
  const [isLongPressed, setIsLongPressed] = useState(false);
  // In case the callback function is re-created on every render,
  // use a ref to avoid restarting the long press delay on every render.
  const longPressTriggerRef = useRef(onLongPress);
  longPressTriggerRef.current = onLongPress;

  // Saves the touch event when touch starts
  const onTouchStart = useCallback<TouchEventHandler<Element>>((event) => {
    setIsLongPressed(false);
    setPressEvent(event.nativeEvent);
  }, []);

  // Whenever the touch ends, prevent the event default if long press has occured
  const onTouchEnd = useCallback<TouchEventHandler<Element>>(
    (event) => {
      if (isLongPressed) {
        // Long press has occured during this touch, so prevent any click etc. from occurring
        event.preventDefault();
      }
      // Ensure long press is cancelled
      setPressEvent(undefined);
    },
    [isLongPressed]
  );

  useEffect(() => {
    if (!pressEvent) return undefined;

    // Cancels the long press
    const stopTouch = () => setPressEvent(undefined);

    // Whenever touch move occurs (e.g. scroll) cancel the long press
    window.addEventListener("touchmove", stopTouch);

    // After the certain delay perform the long press
    const timeout = setTimeout(() => {
      longPressTriggerRef.current(pressEvent);
      setIsLongPressed(true);
      stopTouch();
    }, delay);

    return () => {
      // Reset the long press timeout
      clearTimeout(timeout);
      // Stop listening
      window.removeEventListener("touchmove", stopTouch);
    };
  }, [delay, pressEvent]);

  return [
    pressEvent != null && !isLongPressed,
    {
      onTouchStart,
      onTouchEnd,
    },
  ];
}
