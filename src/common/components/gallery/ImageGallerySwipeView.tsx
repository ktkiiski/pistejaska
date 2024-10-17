import { VFC } from "react";
import SwipeableViews from "react-swipeable-views";
import { bindKeyboard } from "react-swipeable-views-utils";
import { Temporal } from "@js-temporal/polyfill";

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

export interface ImageGalleryItem {
  src: string;
  date: Temporal.Instant;
  title: string;
  link: string;
}

interface ImageGallerySwipeViewProps {
  images: ImageGalleryItem[];
  index: number;
  onIndexChange: (newIndex: number) => void;
}

const swipeableContainerStyle = { width: "100%", height: "100%" };

const ImageGallerySwipeView: VFC<ImageGallerySwipeViewProps> = ({
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
      {images.map(({ src, title }, index) => (
        <img
          key={index}
          className="max-w-full max-h-full shadow-lg object-contain"
          src={src}
          loading="lazy"
          alt={title}
        />
      ))}
    </BindKeyboardSwipeableViews>
  );
};

export default ImageGallerySwipeView;
