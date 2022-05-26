import { useEffect, useState } from "react";
import { Play, Player } from "./domain/play";
import { v4 as uuid } from "uuid";
import { usePlayers } from "./common/hooks/usePlayers";
import { useGames } from "./common/hooks/useGames";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { Game } from "./domain/game";
import { app } from "./common/firebase";
import CardButtonRow from "./common/components/buttons/CardButtonRow";
import Button from "./common/components/buttons/Button";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import Heading1 from "./common/components/typography/Heading1";
import List from "./common/components/lists/List";
import ListItem from "./common/components/lists/ListItem";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import { shuffle } from "lodash";
import InputTextField from "./common/components/inputs/InputTextField";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Temporal } from "@js-temporal/polyfill";
import SelectPlayersRandomizerButton from "./SelectPlayersRandomizerButton";

function shiftRandomly<T>(values: T[]) {
  const offset = Math.floor(Math.random() * values.length);
  return shiftValues(values, offset);
}

function shiftValues<T>(values: T[], offset: number) {
  const shift = offset % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

async function createPlay(
  gameId: string,
  players: Player[],
  userId: string
): Promise<Play> {
  const playId = `${gameId}-${uuid()}`;
  const play = new Play({
    gameId: gameId,
    id: playId,
    players: players,
    expansions: [],
    scores: [],
    misc: Game.getDefaultMiscFieldValues(),
    createdBy: userId,
    created: Temporal.Now.instant().toString({
      fractionalSecondDigits: 3,
    }),
  });

  const db = getFirestore(app);
  await setDoc(doc(db, "plays-v1", playId), play.toDTO());
  return play;
}

const SelectPlayers = (props: {
  gameId: string;
  initialPlayers?: Player[];
}) => {
  const navigate = useNavigate();
  const [games, isLoadingGames] = useGames();
  const { gameId, initialPlayers = [] } = props;
  const game = games?.find((g) => g.id === gameId);
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const [allPlayers] = usePlayers();

  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [showAllPlayers, setShowAllPlayers] = useState<boolean>(false);
  const [currentPlayerName, setCurrentPlayerName] = useState<string>("");
  const [isRandomizingStarter, setIsRandomizingStarter] = useState(false);
  const [isRandomizingOrder, setIsRandomizingOrder] = useState(false);
  const isRandomizing = isRandomizingStarter || isRandomizingOrder;

  const selectablePlayers = allPlayers
    .filter(
      (p) =>
        players.find((selectPlayer) => selectPlayer.id === p.id) === undefined
    )
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const visiblePlayers = showAllPlayers
    ? selectablePlayers
    : selectablePlayers.slice(0, 6);

  const onStartGame = async (userId: string) => {
    setIsStarting(true);
    try {
      const play = await createPlay(gameId, players, userId);
      navigate(`/edit/${play.id}`);
    } catch (error) {
      console.error(error);
      setIsStarting(false);
    }
  };

  const onAddPlayer = () => {
    setPlayers([...players, { name: currentPlayerName, id: uuid() }]);
    setCurrentPlayerName("");
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

  const randomizeStartingPlayer = () => {
    setPlayers(shiftRandomly(players));
    setIsRandomizingStarter(true);
  };

  const randomizeOrder = () => {
    setPlayers(shuffle(players));
    setIsRandomizingOrder(true);
  };

  useEffect(() => {
    if (!isRandomizing) {
      return undefined;
    }
    let hasEnded = false;
    let animation = requestAnimationFrame(animate);
    function animate() {
      if (hasEnded) return;
      setPlayers(
        isRandomizingStarter
          ? // Animating random starting player: just shift players without changing order
            (oldPlayers) => shiftValues(oldPlayers, 1)
          : // Shuffle players
            (oldPlayers) => shuffle(oldPlayers)
      );
      animation = requestAnimationFrame(animate);
    }
    function endAnimation() {
      hasEnded = true;
      cancelAnimationFrame(animation);
      clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      setIsRandomizingOrder(false);
      setIsRandomizingStarter(false);
      endAnimation();
    }, 1000);

    return endAnimation;
  }, [isRandomizing, isRandomizingStarter]);

  if (isLoadingGames || isStarting) {
    return <LoadingSpinner />;
  }
  if (!game) {
    return <ViewContentLayout>Unknown game!</ViewContentLayout>;
  }

  if (!user) {
    return <></>;
  }

  return (
    <ViewContentLayout
      footer={
        <CardButtonRow>
          {game.simultaneousTurns ? null : (
            <SelectPlayersRandomizerButton
              onRandomizeStartingPlayer={randomizeStartingPlayer}
              onRandomizeOrder={randomizeOrder}
              disabled={players.length < 2 || isRandomizing}
            />
          )}
          <ButtonPrimary
            onClick={() => onStartGame(user.uid)}
            disabled={players.length < 1 || isRandomizing}
          >
            Start
          </ButtonPrimary>
        </CardButtonRow>
      }
    >
      <Heading1>Select players</Heading1>

      <p>
        {`Add players to the new game of `}
        <strong>{game.name}</strong>
        {game.simultaneousTurns ? "" : ` in the playing order.`}
      </p>
      <div>
        <InputTextField
          className="my-3"
          label="Search..."
          value={searchTerm}
          autoFocus
          onChange={onSearch}
        />
        <List>
          {visiblePlayers.map((player) => (
            <ListItem onClick={() => onSelectPlayer(player)} key={player.id}>
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
              <ListItemText title={player.name} />
            </ListItem>
          ))}
          {!showAllPlayers && selectablePlayers.length > 6 ? (
            <ListItem onClick={() => setShowAllPlayers(true)} key="showmore">
              Show more...
            </ListItem>
          ) : showAllPlayers && selectablePlayers.length > 6 ? (
            <ListItem onClick={() => setShowAllPlayers(false)} key="showless">
              Show less...
            </ListItem>
          ) : (
            <></>
          )}

          <ListItem key="currentplayer">
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
            <InputTextField
              className="mb-2"
              label="New player"
              value={currentPlayerName}
              onChange={setCurrentPlayerName}
            />
            <Button className="ml-4" onClick={onAddPlayer}>
              Add
            </Button>
          </ListItem>
        </List>
      </div>

      <List className="mt-8">
        {players.map((player) => (
          <ListItem key={player.id}>
            <ListItemIcon>
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
            </ListItemIcon>
            <ListItemText title={player.name} />
            <ListItemIcon
              onClick={() => onDeSelectPlayer(player)}
              className={isRandomizing ? "invisible" : ""}
            >
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
    </ViewContentLayout>
  );
};

export default SelectPlayers;
