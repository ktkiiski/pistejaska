import React, { useState } from "react";
import { Player } from "./domain/play";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { RouteComponentProps } from "react-router";
import { Button, TextField } from "@material-ui/core";
import uuid from "uuid";
import { PlayNew } from "./PlayNew";
import { games } from "./domain/games";

export const SelectPlayers = (
  props: RouteComponentProps<{ gameId: string }>
) => {
  const game = games.find(g => g.id === props.match.params["gameId"]);
  if (game === undefined) throw new Error("unknown game");

  const [players, setPlayers] = useState<Player[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const onStartGame = () => {
    setIsStarted(true);
  };

  const onAddPlayer = () => {
    setPlayers([...players, { name: currentPlayer, id: uuid() }]);
    setCurrentPlayer("");
  };

  const selectPlayers = (
    <div>
      <h2>Add players</h2>

      <TextField
        value={currentPlayer}
        onChange={e => setCurrentPlayer(e.currentTarget.value)}
      />
      <Button color="default" onClick={onAddPlayer} variant="contained">
        Add
      </Button>

      <List component="nav">
        {players.map(player => (
          <ListItem button key={player.id}>
            <ListItemIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M6 8c1.11 0 2-.9 2-2s-.89-2-2-2c-1.1 0-2 .9-2 2s.9 2 2 2zm6 0c1.11 0 2-.9 2-2s-.89-2-2-2c-1.11 0-2 .9-2 2s.9 2 2 2zM6 9.2c-1.67 0-5 .83-5 2.5V13h10v-1.3c0-1.67-3.33-2.5-5-2.5zm6 0c-.25 0-.54.02-.84.06.79.6 1.34 1.4 1.34 2.44V13H17v-1.3c0-1.67-3.33-2.5-5-2.5z" />
              </svg>
            </ListItemIcon>
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
      <Button
        color="primary"
        onClick={onStartGame}
        disabled={players.length === 0}
        variant="contained"
      >
        Start
      </Button>
    </div>
  );

  return !isStarted ? selectPlayers : <PlayNew game={game} players={players} />;
};
