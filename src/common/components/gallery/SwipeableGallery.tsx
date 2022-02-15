import { VFC } from "react";
import SwipeableViews from "react-swipeable-views";
import { bindKeyboard } from "react-swipeable-views-utils";

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

interface SwipeableGalleryProps {
  images: string[];
  index: number;
  onIndexChange: (newIndex: number) => void;
}

const swipeableContainerStyle = { width: "100%", height: "100%" };

const SwipeableGallery: VFC<SwipeableGalleryProps> = ({
  images,
  index,
  onIndexChange,
}) => {
  return (
    <BindKeyboardSwipeableViews
      index={index}
      className="cursor-pointer no-select"
      onChangeIndex={onIndexChange}
      slideClassName="w-full h-full flex justify-center items-center"
      containerStyle={swipeableContainerStyle}
      onClick={() => onIndexChange((index + 1) % images.length)}
    >
      {images.map((src, index) => (
        <img
          key={index}
          className="max-w-full max-h-full shadow-lg object-contain"
          src={src}
          alt={src}
        />
      ))}
    </BindKeyboardSwipeableViews>
  );
};

export default SwipeableGallery;
