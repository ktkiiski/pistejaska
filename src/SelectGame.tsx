import { useState } from "react";
import { RouteComponentProps } from "react-router";
import { TextField } from "@material-ui/core";
import { GameDefinition } from "./domain/game";
import { useGames } from "./common/hooks/useGames";
import { TailwindContainerTitle } from "./common/components/Container";
import {
  TailwindList,
  TailwindListItem,
  TailwindListItemIcon,
  TailwindListItemText,
} from "./common/components/List";
import ViewContentLayout from "./common/components/ViewContentLayout";

export const SelectGame = (props: RouteComponentProps<{}>) => {
  const [games] = useGames();
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
      <TailwindContainerTitle>Select game</TailwindContainerTitle>

      <div className="p-2">
        <TextField
          label="Search..."
          value={searchTerm}
          autoFocus
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </div>

      <TailwindList onClickShowAll={() => {}}>
        {listedGames
          .filter((g) => g.lowercaseName.includes(searchTerm.toLowerCase()))
          .map((game) => (
            <TailwindListItem onClick={() => onSelectGame(game)} key={game.id}>
              <TailwindListItemIcon>
                <img
                  alt="gamepic"
                  src={game.icon}
                  className="mx-auto object-cover rounded-full h-10 w-10"
                />
              </TailwindListItemIcon>
              <TailwindListItemText title={game.name} />
            </TailwindListItem>
          ))}
      </TailwindList>
    </ViewContentLayout>
  );
};
