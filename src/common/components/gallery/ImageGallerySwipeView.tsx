import { VFC } from "react";
import SwipeableViews from "react-swipeable-views";
import { bindKeyboard, virtualize } from "react-swipeable-views-utils";
import { Temporal } from "@js-temporal/polyfill";
import { mapVirtualIdxToArrayIdx } from "./utils";

const BindKeyboardSwipeableViews = bindKeyboard(virtualize(SwipeableViews));

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

const slideRenderer = (images: ImageGalleryItem[], index: number) => {
  const idx = mapVirtualIdxToArrayIdx(index, images.length);
  const img = images[idx];

  return (
    <div key={index} className="w-full h-full flex justify-center items-center">
      <img
        className="max-w-full max-h-full shadow-lg object-contain"
        src={img.src}
        alt={img.title}
      />
    </div>
  );
};

const ImageGallerySwipeView: VFC<ImageGallerySwipeViewProps> = ({
  images,
  index,
  onIndexChange,
}) => {
  return (
    <BindKeyboardSwipeableViews
      containerStyle={swipeableContainerStyle}
      className="cursor-pointer no-select"
      index={index}
      onClick={() => onIndexChange(index + 1)}
      onChangeIndex={onIndexChange}
      slideRenderer={({ index }) => slideRenderer(images, index)}
    ></BindKeyboardSwipeableViews>
  );
};

export default ImageGallerySwipeView;
