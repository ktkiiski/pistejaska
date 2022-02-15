import { MouseEventHandler, VFC } from "react";
import OverlayModal from "./OverlayModal";

interface ImageOverlayProps {
  visible: boolean;
  onClose: MouseEventHandler;
  src: string;
  sourceRect?: DOMRect | null;
}

const ImageOverlay: VFC<ImageOverlayProps> = ({
  src,
  visible,
  onClose,
  sourceRect,
}) => {
  return (
    <OverlayModal visible={visible} onClose={onClose} sourceRect={sourceRect}>
      <img className="shadow-lg object-contain" src={src} alt={src} />
    </OverlayModal>
  );
};

export default ImageOverlay;
