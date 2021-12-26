import React, { useEffect, useState } from "react";
import { Player } from "./domain/play";
import { TextField } from "@material-ui/core";
import { v4 as uuid } from "uuid";
import { PlayNew } from "./PlayNew";
import { usePlayers } from "./common/hooks/usePlayers";
import { useGames } from "./common/hooks/useGames";
import {
  TailwindCard,
  TailwindContainerTitle,
} from "./common/components/Container";
import {
  TailwindList,
  TailwindListItem,
  TailwindListItemIcon,
  TailwindListItemText,
} from "./common/components/List";
import {
  TailwindButton,
  TailwindButtonPrimary,
  TailwindCardButtonRow,
} from "./common/components/Button";

function shiftRandomly<T>(values: T[]) {
  const offset = Math.floor(Math.random() * values.length);
  return shiftValues(values, offset);
}

function shiftValues<T>(values: T[], offset: number) {
  const shift = offset % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

const SelectPlayers = (props: {
  gameId: string;
  initialPlayers?: Player[];
}) => {
  const [games] = useGames();
  const { gameId, initialPlayers = [] } = props;
  const game = games?.find((g) => g.id === gameId);

  const [allPlayers] = usePlayers();

  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [showAllPlayers, setShowAllPlayers] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [isRandomizing, setIsRandomizing] = useState(false);

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

  const onSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setShowAllPlayers(false);
  };

  useEffect(() => {
    if (!isRandomizing) {
      return undefined;
    }
    let animation = requestAnimationFrame(animate);
    function animate() {
      setPlayers((oldPlayers) => shiftValues(oldPlayers, 1));
      animation = requestAnimationFrame(animate);
    }
    const timeout = setTimeout(() => setIsRandomizing(false), 1000);
    return () => {
      cancelAnimationFrame(animation);
      clearTimeout(timeout);
    };
  }, [isRandomizing]);

  if (!games) {
    return <div>Loading…</div>;
  }
  if (!game) {
    return <div>Unknown game!</div>;
  }

  const selectPlayers = (
    <div className="p-2">
      <TailwindCard className="p-0">
        <div className="p-2">
          <TailwindContainerTitle>Select players</TailwindContainerTitle>

          <p>
            {`Add players to the new game of `}
            <strong>{game.name}</strong>
            {game.simultaneousTurns ? "" : ` in the playing order.`}
          </p>
          <div>
            <TextField
              label="Search..."
              value={searchTerm}
              autoFocus
              onChange={(e) => onSearch(e.currentTarget.value)}
            />
            <TailwindList>
              {visiblePlayers.map((player) => (
                <TailwindListItem
                  onClick={() => onSelectPlayer(player)}
                  className="text-sm"
                  key={player.id}
                >
                  <TailwindListItemIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                    >
                      <path d="M9 1C4.58 1 1 4.58 1 9s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 2.75c1.24 0 2.25 1.01 2.25 2.25S10.24 8.25 9 8.25 6.75 7.24 6.75 6 7.76 3.75 9 3.75zM9 14.5c-1.86 0-3.49-.92-4.49-2.33C4.62 10.72 7.53 10 9 10c1.47 0 4.38.72 4.49 2.17-1 1.41-2.63 2.33-4.49 2.33z" />
                    </svg>
                  </TailwindListItemIcon>
                  <TailwindListItemText title={player.name} />
                </TailwindListItem>
              ))}
              {!showAllPlayers && selectablePlayers.length > 6 ? (
                <TailwindListItem onClick={() => setShowAllPlayers(true)} key='showmore'>
                  Show more...
                </TailwindListItem>
              ) : showAllPlayers && selectablePlayers.length > 6 ? (
                <TailwindListItem onClick={() => setShowAllPlayers(false)} key='showless'>
                  Show less...
                </TailwindListItem>
              ) : (
                <></>
              )}

              <TailwindListItem key='currentplayer'>
                <TailwindListItemIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </TailwindListItemIcon>
                <TextField
                  value={currentPlayer}
                  placeholder="New player"
                  onChange={(e) => setCurrentPlayer(e.currentTarget.value)}
                />
                <TailwindButton onClick={onAddPlayer}>Add</TailwindButton>
              </TailwindListItem>
            </TailwindList>
          </div>

          <TailwindList className="mt-8">
            {players.map((player) => (
              <TailwindListItem key={player.id}>
                <TailwindListItemIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </TailwindListItemIcon>
                <TailwindListItemText title={player.name} />
                {isRandomizing ? (
                  <></>
                ) : (
                  <TailwindListItemIcon
                    onClick={() => onDeSelectPlayer(player)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </TailwindListItemIcon>
                )}
              </TailwindListItem>
            ))}
          </TailwindList>
        </div>
        <TailwindCardButtonRow>
          {game.simultaneousTurns ? null : (
            <TailwindButton
              onClick={() => {
                setPlayers(shiftRandomly(players));
                setIsRandomizing(true);
              }}
              disabled={players.length < 2 || isRandomizing}
            >
              Random starting player
            </TailwindButton>
          )}
          <TailwindButtonPrimary
            onClick={onStartGame}
            disabled={players.length === 0 || isRandomizing}
          >
            Start
          </TailwindButtonPrimary>
        </TailwindCardButtonRow>
      </TailwindCard>
    </div>
  );

  return !isStarted ? selectPlayers : <PlayNew game={game} players={players} />;
};

export default SelectPlayers;
