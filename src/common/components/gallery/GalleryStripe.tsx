import classNames from "classnames";
import { useCallback, useEffect, useRef, useState, VFC } from "react";
import { CSSTransition } from "react-transition-group";
import GalleryOverlay from "./GalleryOverlay";
import styles from "./GalleryStripe.module.css";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";
import { GalleryItem } from "./SwipeableGallery";

interface GalleryStripeProps {
  className?: string;
  images: GalleryItem[];
}

const imageTransitionClassNames: CSSTransitionClassNames = {
  enterActive: styles.entering,
  enterDone: styles.entered,
};

const loadThreshold = 100;

const GalleryStripe: VFC<GalleryStripeProps> = ({ className, images }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [sourceImageRect, setSourceImageRect] = useState<DOMRect | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onImageLoad = useCallback(() => {
    setVisibleCount((count) => count + 1);
  }, []);

  const checkLoadMore = useCallback(() => {
    const container = containerRef.current!;
    const placeholder = placeholderRef.current;
    if (placeholder) {
      const { scrollLeft, clientWidth } = container;
      const offsetLeft = placeholder?.offsetLeft ?? 0;
      if (scrollLeft + clientWidth + loadThreshold >= offsetLeft) {
        setRenderCount(visibleCount + 1);
      }
    }
  }, [visibleCount]);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (placeholder && visibleCount) {
      const estimatedImageWidth = placeholder.offsetLeft / visibleCount;
      const estimatedRemainingWidth =
        estimatedImageWidth * (images.length - visibleCount);
      placeholder.style.width = `${Math.ceil(estimatedRemainingWidth)}px`;
    }
    checkLoadMore();
    const container = containerRef.current!;
    container.addEventListener("scroll", checkLoadMore);
    return () => container.removeEventListener("scroll", checkLoadMore);
  });

  return (
    <div
      className={classNames(
        "relative flex flex-row items-stretch h-40 space-x-0.5 overflow-x-auto",
        className
      )}
      ref={containerRef}
    >
      {images.slice(0, renderCount).map(({ src, title }, index) => (
        <CSSTransition
          in={index < visibleCount}
          key={src}
          timeout={150}
          classNames={imageTransitionClassNames}
        >
          <img
            className={styles.image}
            onLoad={onImageLoad}
            onError={onImageLoad}
            onClick={(event) => {
              setImageIndex(index);
              setIsOverlayOpen(true);
              const clientRect = event.currentTarget.getBoundingClientRect();
              setSourceImageRect(clientRect);
            }}
            src={src}
            alt={title}
          />
        </CSSTransition>
      ))}
      {renderCount < images.length && (
        <div className="w-40 shrink-0" ref={placeholderRef} />
      )}
      <GalleryOverlay
        images={images}
        index={imageIndex}
        onIndexChange={setImageIndex}
        visible={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        sourceRect={sourceImageRect}
      />
    </div>
  );
};

export default GalleryStripe;
