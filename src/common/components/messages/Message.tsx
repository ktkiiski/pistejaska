import { Temporal } from "@js-temporal/polyfill";
import { VFC } from "react";
import Markdown from "../Markdown";

interface MessageProps {
  children: string;
  date: Temporal.Instant;
}

const Message: VFC<MessageProps> = ({ children, date }) => {
  return (
    <div
      className="py-2 px-3 rounded-l rounded-r-2xl first:rounded-tl-2xl last:rounded-bl-2xl mr-4 bg-white shadow"
      data-tip={date.toLocaleString()}
      data-delay-show={500}
    >
      <Markdown>{children}</Markdown>
    </div>
  );
};

export default Message;
