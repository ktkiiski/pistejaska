import { useMemo, useReducer } from "react";
import { Play } from "./domain/play";
import { orderBy } from "lodash";
import { Game } from "./domain/game";
import List from "./common/components/lists/List";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import ListItemDescription from "./common/components/lists/ListItemDescription";
import ButtonTextOnly from "./common/components/buttons/ButtonTextOnly";
import ListLinkItem from "./common/components/lists/ListLinkItem";
import { convertToLocaleDateString } from "./common/dateUtils";
import { Comment } from "./domain/comment";

interface PlayListProps {
  plays: Play[];
  games: Game[];
  comments: Comment[];
}

function getPlayLabel(play: Play) {
  if (!play.isResolved()) {
    return "(Ongoing)";
  }
  const winners = play.getWinners();
  if (winners.length !== 1) {
    return `(Tied)`;
  }
  return winners[0].player.name;
}

const PlayList = (props: PlayListProps) => {
  const { plays, games, comments } = props;

  const data = useMemo(
    () =>
      orderBy(
        plays,
        [(play) => play.getDate().epochSeconds, "created"],
        ["desc", "desc"]
      ),
    [plays]
  );

  const [limit, increaseLimit] = useReducer((oldLimit) => oldLimit * 2, 10);
  const currentData = data.slice(0, limit);
  const hasMore = limit < data.length;

  const commentsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 inline"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );

  return (
    <>
      <List>
        {currentData.map((play) => {
          const game = games.find((g) => g.id === play.gameId);
          const noOfplayComments =
            comments?.filter((x) => x.playId === play.id)?.length ?? 0;
          return (
            <ListLinkItem key={play.id} to={`/view/${play.id}`}>
              <ListItemIcon>
                {game ? (
                  <img
                    alt="gamepic"
                    src={game.icon}
                    className="mx-auto object-cover rounded-full h-14 w-14 "
                  />
                ) : (
                  <div className="mx-auto object-cover rounded-full h-14 w-14 background-gray" />
                )}
              </ListItemIcon>
              <ListItemText
                title={play.getName() ?? ""}
                description={game?.name}
              />
              <ListItemDescription>
                {convertToLocaleDateString(play.getDate())}
                <br />
                <span className="text-slate-300">{getPlayLabel(play)}</span>
                {noOfplayComments > 0 ? (
                  <>
                    <div className="flex-col text-slate-400">
                      {commentsIcon} {noOfplayComments}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </ListItemDescription>
            </ListLinkItem>
          );
        })}
      </List>
      {hasMore && (
        <div className="mt-1 flex flex-col items-center">
          <ButtonTextOnly onClick={increaseLimit}>Show more</ButtonTextOnly>
        </div>
      )}
    </>
  );
};

export default PlayList;
