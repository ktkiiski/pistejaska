import {
  MouseEvent,
  MouseEventHandler,
  TouchEvent,
  TouchEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";

interface LongPressEventHandlers<Element> {
  onMouseDown: MouseEventHandler<Element>;
  onTouchStart: TouchEventHandler<Element>;
  onMouseUp: MouseEventHandler<Element>;
  onMouseLeave: MouseEventHandler<Element>;
  onTouchEnd: TouchEventHandler<Element>;
}

interface LongPressOptions<Element> {
  onClick?: (event: MouseEvent<Element> | TouchEvent<Element>) => void;
  shouldPreventDefault?: boolean;
  delay?: number;
}

const isTouchEvent = (event: Event): event is Event & TouchEvent =>
  "touches" in event;

const preventDefault = (event: Event) => {
  if (isTouchEvent(event) && event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default function useLongPress<Element>(
  onLongPress: MouseEventHandler<Element>,
  {
    shouldPreventDefault = true,
    delay = 300,
    onClick,
  }: LongPressOptions<Element> = {}
): LongPressEventHandlers<Element> {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (
      event: TouchEvent<Element> | MouseEvent<Element>,
      shouldTriggerClick = true
    ) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (shouldTriggerClick && !longPressTriggered && onClick) {
        onClick(event);
      }
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );
  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  };
}
