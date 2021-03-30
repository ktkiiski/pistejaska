import React, { useState, useMemo } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { TablePagination } from "@material-ui/core";

import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { useGames } from "./common/hooks/useGames";
import GamePopularityChart from "./GameTrendChart";

export const PlayList = (props: RouteComponentProps<{}>) => {
  const games = useGames();
  const [plays, , error] = usePlays();

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

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }

  const onSelectPlay = (play: Play) => props.history.push("/view/" + play.id);
  return (
    <div>
      <h2>Plays</h2>
      <GamePopularityChart plays={plays} />
      <List component="nav">
        {currentData.map((play) => {
          const game = games?.find((g) => g.id === play.gameId);
          return (
            <ListItem button onClick={() => onSelectPlay(play)} key={play.id}>
              {game && (
                <ListItemIcon>
                  <img
                    width={30}
                    height={30}
                    src={game.icon}
                    alt={game.name}
                  />
                </ListItemIcon>
              )}
              <ListItemText
                primary={play.getName()}
                secondary={game?.name}
              />
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
        onChangePage={(e, page) => {
          setCurrentPage(page);
        }}
        onChangeRowsPerPage={(e) => {
          setCurrentPage(0);
          setItemsPerPage((e as any).target.value);
        }}
        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
      />
    </div>
  );
};
