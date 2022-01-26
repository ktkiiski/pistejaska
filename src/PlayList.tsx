import { useState, useMemo, useCallback } from "react";
import { TablePagination } from "@material-ui/core";
import { useHistory } from "react-router";
import { Play } from "./domain/play";
import { orderBy } from "lodash";
import { Game } from "./domain/game";
import List from "./common/components/lists/List";
import ListItem from "./common/components/lists/ListItem";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import ListItemDescription from "./common/components/lists/ListItemDescription";

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

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const currentData = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return data.slice(offset, offset + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  const [showAll, setShowAll] = useState(false);

  const onSelectPlay = useCallback(
    (play: Play) => history.push("/view/" + play.id),
    [history]
  );
  return (
    <>
      <List onClickShowAll={() => setShowAll(!showAll)}>
        {(showAll ? data : currentData).map((play) => {
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
                <span className="text-gray-300">{getPlayLabel(play)}</span>
              </ListItemDescription>
            </ListItem>
          );
        })}
      </List>

      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={(e, page) => {
          setCurrentPage(page);
        }}
        onChangeRowsPerPage={(e) => {
          setCurrentPage(0);
          setItemsPerPage((e as any).target.value);
        }}
        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
      />
    </>
  );
};

export default PlayList;
