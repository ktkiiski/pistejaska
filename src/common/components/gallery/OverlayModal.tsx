import {
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import useDisableWindowScroll from "../../hooks/useDisableWindowScroll";
import useKeyPressHandler from "../../hooks/useKeyPressHandler";

interface OverlayModalProps {
  visible: boolean;
  sourceElementRef?: RefObject<HTMLElement | null>;
  onClose?: () => void;
  controls?: ReactNode;
}

/**
 * Calculates a transform for a full-sized element so that it
 * seems to be placed at the top of the source bounding client rectangle
 * and have approximately the same size.
 */
function getContentShrinkTransform(sourceRect?: DOMRect | null) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const sourceWidth = sourceRect?.width ?? windowWidth;
  const sourceHeight = sourceRect?.height ?? windowHeight;
  const sourceLeft = sourceRect?.left ?? 0;
  const sourceTop = sourceRect?.top ?? 0;
  const deltaX = sourceLeft + sourceWidth / 2 - windowWidth / 2;
  const deltaY = sourceTop + sourceHeight / 2 - windowHeight / 2;
  const scaleX = sourceWidth / windowWidth;
  const scaleY = sourceHeight / windowHeight;
  const scale = Math.max(scaleX, scaleY);
  return `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
}

const OverlayModal: FC<OverlayModalProps> = ({
  visible,
  sourceElementRef,
  children,
  onClose,
  controls,
}) => {
  const innerOverlayRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const sourceRectRef = useRef<DOMRect>();

  useDisableWindowScroll(visible);
  useKeyPressHandler("keydown", "Escape", onClose);

  /**
   * Keep track of the bounding client rectangle of the source
   * image element. This is done on an animation frame so that
   * we won't trigger forced redraws in the middle of React lifecycles.
   *
   * Note that we use refs instead of states to avoid React re-rendering,
   * which are not needed here.
   */
  useEffect(() => {
    const request = requestAnimationFrame(() => {
      sourceRectRef.current =
        sourceElementRef?.current?.getBoundingClientRect();
    });
    return () => cancelAnimationFrame(request);
  });

  const setElementOutStyles = useCallback(() => {
    backgroundRef.current!.style.opacity = "0";
    innerOverlayRef.current!.style.transform = getContentShrinkTransform(
      sourceRectRef.current
    );
  }, []);

  const setElementInStyles = useCallback(() => {
    backgroundRef.current!.style.opacity = "1";
    innerOverlayRef.current!.style.transform = "translate(0, 0) scale(1)";
  }, []);

  const element = (
    <CSSTransition
      in={visible}
      mountOnEnter
      unmountOnExit
      timeout={150}
      onEnter={setElementOutStyles}
      onEntering={setElementInStyles}
      onExit={setElementInStyles}
      onExiting={setElementOutStyles}
    >
      <div
        className="fixed inset-0 z-10 transition-opacity backdrop-blur-lg"
        ref={backgroundRef}
      >
        <div
          className="absolute inset-0 transition-transform flex flex-col items-center justify-center"
          ref={innerOverlayRef}
        >
          {children}
        </div>
        {controls}
      </div>
    </CSSTransition>
  );
  return createPortal(element, document.body);
};

export default OverlayModal;
