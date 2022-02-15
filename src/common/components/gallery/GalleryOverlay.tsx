import { VFC } from "react";
import OverlayModal from "./OverlayModal";
import SwipeableGallery from "./SwipeableGallery";

interface ImageOverlayProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
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
  return (
    <OverlayModal visible={visible} sourceRect={sourceRect} onClose={onClose}>
      <SwipeableGallery
        images={images}
        index={index}
        onIndexChange={onIndexChange}
      />
    </OverlayModal>
  );
};

export default GalleryOverlay;
