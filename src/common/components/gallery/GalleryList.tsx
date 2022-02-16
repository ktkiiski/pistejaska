import { useState, VFC } from "react";
import GalleryOverlay from "./GalleryOverlay";
import { GalleryItem } from "./SwipeableGallery";

interface GalleryListProps {
  images: GalleryItem[];
}

const GalleryList: VFC<GalleryListProps> = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [sourceImageRect, setSourceImageRect] = useState<DOMRect | null>(null);
  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-1">
      {images.map(({ src, title }, index) => (
        <img
          key={index}
          src={src}
          alt={title}
          className="max-w-full max-h-80 shrink-0 cursor-pointer shadow hover:opacity-90 transition-opacity"
          onClick={(event) => {
            setImageIndex(index);
            setIsOverlayOpen(true);
            const clientRect = event.currentTarget.getBoundingClientRect();
            setSourceImageRect(clientRect);
          }}
        />
      ))}
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

export default GalleryList;
