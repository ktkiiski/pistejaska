import React, { useState, VFC } from "react";
import GalleryOverlay from "./GalleryOverlay";

interface GalleryListProps {
  images: string[];
}

const GalleryList: VFC<GalleryListProps> = ({ images }) => {
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);
  const [sourceImageRect, setSourceImageRect] = useState<DOMRect | null>(null);
  return (
    <div className="flex flex-col items-center space-y-1">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={src}
          className="max-w-full max-h-80 cursor-pointer shadow hover:opacity-90 transition-opacity"
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

export default GalleryList;
