import { useMemo, useCallback, useReducer } from "react";
import { useHistory } from "react-router";
import { Play } from "./domain/play";
import { orderBy } from "lodash";
import { Game } from "./domain/game";
import List from "./common/components/lists/List";
import ListItem from "./common/components/lists/ListItem";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import ListItemDescription from "./common/components/lists/ListItemDescription";
import ButtonTextOnly from "./common/components/buttons/ButtonTextOnly";

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
  const history = useHistory();

  const data = useMemo(
    () =>
      orderBy(plays, [(play) => play.getDate(), "created"], ["desc", "desc"]),
    [plays]
  );

  const [limit, increaseLimit] = useReducer((oldLimit) => oldLimit * 2, 10);
  const currentData = data.slice(0, limit);
  const hasMore = limit < data.length;

  const onSelectPlay = useCallback(
    (play: Play) => history.push("/view/" + play.id),
    [history]
  );
  return (
    <>
      <List>
        {currentData.map((play) => {
          const game = games.find((g) => g.id === play.gameId);
          return (
            <ListItem key={play.id} onClick={() => onSelectPlay(play)}>
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
                {play.getDate().toLocaleDateString()}
                <br />
                <span className="text-slate-300">{getPlayLabel(play)}</span>
              </ListItemDescription>
            </ListItem>
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
