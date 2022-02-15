import { FC, MouseEventHandler, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import useDisableWindowScroll from "../../hooks/useDisableWindowScroll";

interface OverlayModalProps {
  visible: boolean;
  onClose: MouseEventHandler;
  sourceRect?: DOMRect | null;
}

const OverlayModal: FC<OverlayModalProps> = ({
  visible,
  onClose,
  sourceRect,
  children,
}) => {
  useDisableWindowScroll(visible);
  const innerOverlayRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const setElementOutStyles = useCallback(() => {
    // Transform the content at the source position
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
    const innerOverlayStyle = innerOverlayRef.current!.style;
    innerOverlayStyle.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    // Set background full transparent
    const backgroundStyle = backgroundRef.current!.style;
    backgroundStyle.opacity = "0";
  }, [sourceRect]);

  const setElementInStyles = useCallback(() => {
    // Transform the content to its normal position
    const innerOverlayStyle = innerOverlayRef.current!.style;
    innerOverlayStyle.transform = "translate(0, 0) scale(1)";
    // Set background full opaque
    const backgroundStyle = backgroundRef.current!.style;
    backgroundStyle.opacity = "1";
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
      <div className="fixed inset-0 z-10 cursor-pointer" onClick={onClose}>
        <div
          className="absolute inset-0 transition-opacity backdrop-blur-lg bg-white/10"
          ref={backgroundRef}
        />
        <div
          className="absolute inset-0 transition-transform flex justify-center"
          ref={innerOverlayRef}
        >
          {children}
        </div>
      </div>
    </CSSTransition>
  );
  return createPortal(element, document.body);
};

export default OverlayModal;
