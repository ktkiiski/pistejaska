import classNames from "classnames";
import React, { VFC } from "react";
import { Link } from "react-router-dom";

interface OverlayInfoProps {
  className?: string;
  title: string;
  date: Date;
  link: string;
}

const OverlayInfo: VFC<OverlayInfoProps> = ({
  title,
  date,
  link,
  className,
}) => {
  return (
    <Link
      to={link}
      className={classNames(
        "block absolute left-0 right-0 bottom-0 bg-black/60 hover:bg-black/70 flex flex-row items-center text-white text-xs py-1 px-2 cursor-pointer transition-background",
        className
      )}
    >
      <span className="block">{title}</span>
      <span className="block ml-auto">{date?.toLocaleDateString()}</span>
    </Link>
  );
};

export default OverlayInfo;
