import classNames from "classnames";
import { useState, VFC } from "react";
import GalleryOverlay from "./GalleryOverlay";

interface GalleryStripeProps {
  className?: string;
  images: string[];
}

const GalleryStripe: VFC<GalleryStripeProps> = ({ className, images }) => {
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);
  const [sourceImageRect, setSourceImageRect] = useState<DOMRect | null>(null);
  return (
    <div
      className={classNames(
        "flex flex-row items-stretch h-40 space-x-0.5 overflow-x-auto",
        className
      )}
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={src}
          className="max-h-full cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(event) => {
            setFullScreenImageIndex(index);
            setIsImageOverlayOpen(true);
            const clientRect = event.currentTarget.getBoundingClientRect();
            setSourceImageRect(clientRect);
          }}
        />
      ))}
      <GalleryOverlay
        images={images}
        index={fullScreenImageIndex}
        onIndexChange={setFullScreenImageIndex}
        visible={isImageOverlayOpen}
        onClose={() => setIsImageOverlayOpen(false)}
        sourceRect={sourceImageRect}
      />
    </div>
  );
};

export default GalleryStripe;
