import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { RouteComponentProps } from "react-router";
import { TextField } from "@material-ui/core";
import { GameDefinition } from "./domain/game";
import { useGames } from "./domain/games";

export const SelectGame = (props: RouteComponentProps<{}>) => {
  const games = useGames();
  const onSelectGame = (game: GameDefinition) =>
    props.history.push("/new/" + game.id);

  const [searchTerm, setSearchTerm] = useState("");
  const listedGames = (games || []).map((game) => ({
    ...game,
    lowercaseName: game.name.toLowerCase(),
  }));
  listedGames.sort(({ lowercaseName: name1 }, { lowercaseName: name2 }) => {
    return name1 === "generic game"
      ? -1
      : name2 === "generic game"
      ? 1
      : name1 > name2
      ? 1
      : name1 < name2
      ? -1
      : 0;
  });
  return (
    <div>
      <h2>Select game</h2>
      <TextField
        label="Search..."
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <List component="nav">
        {listedGames
          .filter((g) => g.lowercaseName.includes(searchTerm.toLowerCase()))
          .map((game) => (
            <ListItem button onClick={() => onSelectGame(game)} key={game.id}>
              <ListItemIcon>
                <img width={30} height={30} src={game.icon} alt={game.name} />
              </ListItemIcon>
              <ListItemText primary={game.name} />
            </ListItem>
          ))}
      </List>
    </div>
  );
};
