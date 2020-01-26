import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { TablePagination } from "@material-ui/core";

import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";
import { orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";

export const PlayList = (props: RouteComponentProps<{}>) => {
  // eslint-disable-next-line
  const [plays, loading, error] = usePlays();

  useEffect(() => {
    setData(orderBy(plays, ["date", "created"], ["desc", "desc"]));
    // eslint-disable-next-line
  }, [plays.length]);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const [currentData, setCurrentData] = useState<any[]>([]);

  useEffect(() => {
    const offset = currentPage * itemsPerPage;
    setCurrentData(data.slice(offset, offset + itemsPerPage));
  }, [currentPage, data, itemsPerPage]);

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }

  const onSelectPlay = (play: Play) => props.history.push("/view/" + play.id);
  const getGame = (play: Play) =>
    games.find(g => g.id === play.gameId) || ({} as any);

  return (
    <div>
      <h3>Plays</h3>
      <List component="nav">
        {currentData.map(play => (
          <ListItem button onClick={() => onSelectPlay(play)} key={play.id}>
            <ListItemIcon>
              <img
                width={30}
                height={30}
                src={getGame(play).icon}
                alt={getGame(play).name}
              />
            </ListItemIcon>
            <ListItemText
              primary={play.getName()}
              secondary={getGame(play).name}
            />
          </ListItem>
        ))}
      </List>

      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        backIconButtonProps={{
          "aria-label": "Previous Page"
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page"
        }}
        onChangePage={(e, page) => {
          setCurrentPage(page);
        }}
        onChangeRowsPerPage={e => {
          setCurrentPage(0);
          setItemsPerPage((e as any).target.value);
        }}
        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
      />
    </div>
  );
};
