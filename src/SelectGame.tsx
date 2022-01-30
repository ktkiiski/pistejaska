import { useState } from "react";
import { RouteComponentProps } from "react-router";
import { Game, GameDefinition } from "./domain/game";
import { useGames } from "./common/hooks/useGames";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { usePlays } from "./common/hooks/usePlays";
import { orderBy } from "lodash";
import Heading1 from "./common/components/typography/Heading1";
import List from "./common/components/lists/List";
import ListItem from "./common/components/lists/ListItem";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import InputTextField from "./common/components/inputs/InputTextField";

const maxRecentlyPlayedGames = 6;

function useRecentlyPlayedGames(games: Game[]) {
  const [plays] = usePlays();
  const sortedPlays = orderBy(
    plays,
    [(play) => play.getDate(), "created"],
    ["desc", "desc"]
  );
  const recentlyPlayedGames: Game[] = [];
  for (
    let i = 0;
    i < sortedPlays.length &&
    recentlyPlayedGames.length < maxRecentlyPlayedGames;
    i += 1
  ) {
    const { gameId } = sortedPlays[i];
    if (gameId && recentlyPlayedGames.every((g) => g.id !== gameId)) {
      const game = games.find((game) => game.id === gameId);
      if (game) {
        recentlyPlayedGames.push(game);
      }
    }
  }
  return recentlyPlayedGames;
}

export const SelectGame = (props: RouteComponentProps<{}>) => {
  const [games] = useGames();
  const recentlyPlayedGames = useRecentlyPlayedGames(games);
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
    <ViewContentLayout>
      <Heading1>Select game</Heading1>

      {!recentlyPlayedGames.length ? null : (
        <div
          className={`p-3 grid grid-rows-1 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 overflow-hidden`}
          style={{ gridAutoRows: 0 }}
        >
          {recentlyPlayedGames.map((game) => (
            <div
              className="aspect-square w-full h-full cursor-pointer hover:opacity-80"
              onClick={() => onSelectGame(game)}
            >
              <img
                src={game.icon}
                alt={game.name}
                className="w-full h-full object-contain object-center"
              />
            </div>
          ))}
        </div>
      )}

      <div className="p-2">
        <InputTextField
          label="Search..."
          value={searchTerm}
          autoFocus
          onChange={setSearchTerm}
        />
      </div>

      <List onClickShowAll={() => {}}>
        {listedGames
          .filter((g) => g.lowercaseName.includes(searchTerm.toLowerCase()))
          .map((game) => (
            <ListItem onClick={() => onSelectGame(game)} key={game.id}>
              <ListItemIcon>
                <img
                  alt="gamepic"
                  src={game.icon}
                  className="mx-auto object-cover rounded-full h-10 w-10"
                />
              </ListItemIcon>
              <ListItemText title={game.name} />
            </ListItem>
          ))}
      </List>
    </ViewContentLayout>
  );
};
