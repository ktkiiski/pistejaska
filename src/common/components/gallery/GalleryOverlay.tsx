import { VFC } from "react";
import OverlayCloseButton from "./OverlayCloseButton";
import OverlayInfo from "./OverlayInfo";
import OverlayModal from "./OverlayModal";
import SwipeableGallery, { GalleryItem } from "./SwipeableGallery";

interface ImageOverlayProps {
  visible: boolean;
  onClose: () => void;
  images: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  sourceRect?: DOMRect | null;
}

const GalleryOverlay: VFC<ImageOverlayProps> = ({
  images,
  index,
  onIndexChange,
  visible,
  onClose,
  sourceRect,
}) => {
  const image = images[index];
  return (
    <OverlayModal
      visible={visible}
      sourceRect={sourceRect}
      onClose={onClose}
      controls={
        <>
          <OverlayCloseButton
            onClick={onClose}
            className="absolute top-1 right-1"
          />
          {image && (
            <OverlayInfo
              title={image.title}
              date={image.date}
              link={image.link}
            />
          )}
        </>
      }
    >
      <SwipeableGallery
        images={images}
        index={index}
        onIndexChange={onIndexChange}
      />
    </OverlayModal>
  );
};

export default GalleryOverlay;
