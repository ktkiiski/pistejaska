import React, { useState } from "react";
import { Player } from "./domain/play";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Button, TextField } from "@material-ui/core";
import { v4 as uuid } from "uuid";
import { PlayNew } from "./PlayNew";
import { usePlayers } from "./common/hooks/usePlayers";
import ButtonRow from "./ButtonRow";
import { useGames } from "./common/hooks/useGames";

const SelectPlayers = (props: {
  gameId: string;
  initialPlayers?: Player[];
}) => {
  const games = useGames();
  const { gameId, initialPlayers = [] } = props;
  const game = games?.find((g) => g.id === gameId);
  if (game === undefined) throw new Error("unknown game");

  const [allPlayers] = usePlayers();

  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [showAllPlayers, setShowAllPlayers] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");

  const selectablePlayers = allPlayers
    .filter(
      (p) =>
        players.find((selectPlayer) => selectPlayer.id === p.id) === undefined
    )
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const visiblePlayers = showAllPlayers
    ? selectablePlayers
    : selectablePlayers.slice(0, 6);

  const onStartGame = () => {
    setIsStarted(true);
  };

  const onAddPlayer = () => {
    setPlayers([...players, { name: currentPlayer, id: uuid() }]);
    setCurrentPlayer("");
  };

  const onSelectPlayer = (player: Player) => {
    setPlayers([...players, player]);
    setSearchTerm("");
    setShowAllPlayers(false);
  };

  const onDeSelectPlayer = (player: Player) => {
    setPlayers(players.filter((p) => p.id !== player.id));
  };

  const onRandomizeStartingPlayer = () => {
    const offset = Math.floor(Math.random() * players.length);
    const newPlayers = [...players.slice(offset), ...players.slice(0, offset)];
    setPlayers(newPlayers);
  };

  const onSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setShowAllPlayers(false);
  };

  const selectPlayers = (
    <div>
      <h2>Select players</h2>
      <p>
        {`Add players to the new game of `}
        <strong>{game.name}</strong>
        {` in the playing order.`}
      </p>
      <div>
        <TextField
          label="Search..."
          value={searchTerm}
          autoFocus
          onChange={(e) => onSearch(e.currentTarget.value)}
        />
        <List component="nav">
          {visiblePlayers.map((player) => (
            <ListItem
              dense={true}
              button
              onClick={() => onSelectPlayer(player)}
              key={player.id}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M9 1C4.58 1 1 4.58 1 9s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 2.75c1.24 0 2.25 1.01 2.25 2.25S10.24 8.25 9 8.25 6.75 7.24 6.75 6 7.76 3.75 9 3.75zM9 14.5c-1.86 0-3.49-.92-4.49-2.33C4.62 10.72 7.53 10 9 10c1.47 0 4.38.72 4.49 2.17-1 1.41-2.63 2.33-4.49 2.33z" />
                </svg>
              </ListItemIcon>
              <ListItemText primary={player.name} />
            </ListItem>
          ))}
          {!showAllPlayers && selectablePlayers.length > 6 ? (
            <ListItem dense={true} onClick={() => setShowAllPlayers(true)}>
              Show more...
            </ListItem>
          ) : showAllPlayers && selectablePlayers.length > 6 ? (
            <ListItem dense={true} onClick={() => setShowAllPlayers(false)}>
              Show less...
            </ListItem>
          ) : (
            <></>
          )}

          <ListItem>
            <ListItemIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </ListItemIcon>
            <TextField
              value={currentPlayer}
              placeholder="New player"
              onChange={(e) => setCurrentPlayer(e.currentTarget.value)}
            />
            <Button color="default" onClick={onAddPlayer} variant="contained">
              Add
            </Button>
          </ListItem>
        </List>
      </div>

      <List component="nav">
        {players.map((player) => (
          <ListItem button key={player.id}>
            <ListItemIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M9 1C4.58 1 1 4.58 1 9s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 2.75c1.24 0 2.25 1.01 2.25 2.25S10.24 8.25 9 8.25 6.75 7.24 6.75 6 7.76 3.75 9 3.75zM9 14.5c-1.86 0-3.49-.92-4.49-2.33C4.62 10.72 7.53 10 9 10c1.47 0 4.38.72 4.49 2.17-1 1.41-2.63 2.33-4.49 2.33z" />
              </svg>
            </ListItemIcon>
            <ListItemText primary={player.name} />
            <ListItemIcon onClick={() => onDeSelectPlayer(player)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <ButtonRow>
        {game.simultaneousTurns ? null : (
          <Button
            color="default"
            onClick={onRandomizeStartingPlayer}
            disabled={players.length < 2}
            variant="outlined"
          >
            Random starting player
          </Button>
        )}
        <Button
          color="primary"
          onClick={onStartGame}
          disabled={players.length === 0}
          variant="contained"
        >
          Start
        </Button>
      </ButtonRow>
    </div>
  );

  return !isStarted ? selectPlayers : <PlayNew game={game} players={players} />;
};

export default SelectPlayers;
