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

interface PlayListProps {
  plays: Play[];
  games: Game[];
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
  const { plays, games } = props;

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

  return (
    <>
      <List>
        {currentData.map((play) => {
          const game = games.find((g) => g.id === play.gameId);
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
