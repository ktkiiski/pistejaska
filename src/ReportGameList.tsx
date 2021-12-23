import { RouteComponentProps } from "react-router";
import { orderBy } from "lodash";
import { GameDefinition } from "./domain/game";
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

export const ReportGameList = (props: RouteComponentProps<{}>) => {
  const [games] = useGames();
  const onSelectGame = (game: GameDefinition) =>
    props.history.push("/games/" + game.id);

  return (
    <div className="p-2">
      <TailwindCard>
        <TailwindContainerTitle>Games</TailwindContainerTitle>

        <TailwindList>
          {orderBy(games, (g) => g.name.toLowerCase()).map((game) => (
            <TailwindListItem onClick={() => onSelectGame(game)} key={game.id}>
              <TailwindListItemIcon>
                <img
                  alt={game.name}
                  src={game.icon}
                  className="mx-auto object-cover rounded-full h-10 w-10"
                />
              </TailwindListItemIcon>
              <TailwindListItemText title={game.name} />
            </TailwindListItem>
          ))}
        </TailwindList>
      </TailwindCard>
    </div>
  );
};
