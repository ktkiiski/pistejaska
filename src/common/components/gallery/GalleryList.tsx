import { useRef, useState, VFC } from "react";
import GalleryOverlay from "./GalleryOverlay";
import { GalleryItem } from "./SwipeableGallery";

interface GalleryListProps {
  images: GalleryItem[];
}

const GalleryList: VFC<GalleryListProps> = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const sourceElementRef = useRef<HTMLImageElement | null>(null);
  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-1">
      {images.map(({ src, title }, index) => (
        <img
          key={index}
          src={src}
          alt={title}
          className="max-w-full max-h-80 shrink-0 cursor-pointer shadow hover:opacity-90 transition-opacity"
          // Keep track of the image HTML element that is currently "active"
          ref={
            index !== imageIndex
              ? null
              : (el) => {
                  sourceElementRef.current = el;
                }
          }
          onClick={() => {
            setImageIndex(index);
            setIsOverlayOpen(true);
          }}
        />
      ))}
      <GalleryOverlay
        images={images}
        index={imageIndex}
        onIndexChange={setImageIndex}
        visible={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        sourceElementRef={sourceElementRef}
      />
    </div>
  );
};

export default GalleryList;
