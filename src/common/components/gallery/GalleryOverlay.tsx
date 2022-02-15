import { MouseEventHandler, VFC } from "react";
import OverlayModal from "./OverlayModal";
import SwipeableGallery from "./SwipeableGallery";

interface ImageOverlayProps {
  visible: boolean;
  onClose: MouseEventHandler;
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
    <OverlayModal visible={visible} onClose={onClose} sourceRect={sourceRect}>
      <SwipeableGallery
        images={images}
        index={index}
        onIndexChange={onIndexChange}
      />
    </OverlayModal>
  );
};

export default GalleryOverlay;
