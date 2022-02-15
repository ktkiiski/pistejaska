import { FC, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import useDisableWindowScroll from "../../hooks/useDisableWindowScroll";
import useKeyPressHandler from "../../hooks/useKeyPressHandler";
import OverlayCloseButton from "./OverlayCloseButton";

interface OverlayModalProps {
  visible: boolean;
  sourceRect?: DOMRect | null;
  onClose?: () => void;
}

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
  sourceRect,
  children,
  onClose,
}) => {
  const innerOverlayRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useDisableWindowScroll(visible);
  useKeyPressHandler("keydown", "Escape", onClose);

  const setElementOutStyles = useCallback(() => {
    innerOverlayRef.current!.style.transform =
      getContentShrinkTransform(sourceRect);
    backgroundRef.current!.style.opacity = "0";
    closeButtonRef.current!.style.opacity = "0";
  }, [sourceRect]);

  const setElementInStyles = useCallback(() => {
    innerOverlayRef.current!.style.transform = "translate(0, 0) scale(1)";
    backgroundRef.current!.style.opacity = "1";
    closeButtonRef.current!.style.opacity = "1";
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
      <div className="fixed inset-0 z-10">
        <div
          className="absolute inset-0 transition-opacity backdrop-blur-lg bg-white/10"
          ref={backgroundRef}
        ></div>
        <div
          className="absolute inset-0 transition-transform flex flex-col items-center justify-center"
          ref={innerOverlayRef}
        >
          {children}
        </div>
        {onClose && (
          <OverlayCloseButton
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-1 right-1 transition-opacity"
          />
        )}
      </div>
    </CSSTransition>
  );
  return createPortal(element, document.body);
};

export default OverlayModal;
