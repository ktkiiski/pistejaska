import { groupBy, mapValues, orderBy } from "lodash";
import { Game } from "./domain/game";
import { useGames } from "./common/hooks/useGames";
import ViewContentLayout from "./common/components/ViewContentLayout";
import TabSet from "./common/components/tabs/TabSet";
import TabLink from "./common/components/tabs/TabLink";
import { useState } from "react";
import { usePlays } from "./common/hooks/usePlays";
import { formatDuration, pluralize } from "./common/stringUtils";
import { SkeletonLoader } from "./common/components/SkeletonLoader";
import Heading1 from "./common/components/typography/Heading1";
import List from "./common/components/lists/List";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import ListItemDescription from "./common/components/lists/ListItemDescription";
import ListLinkItem from "./common/components/lists/ListLinkItem";

type GameSortCriteriaId = "alphabetic" | "popular" | "shortest" | "longest";

interface GameSortCriteria {
  name: string;
  getSortKey: (game: Game) => number | string;
  direction: "asc" | "desc";
  getDetailLabel: (game: Game) => string | null;
}

const sortTabIds: GameSortCriteriaId[] = [
  "alphabetic",
  "popular",
  "shortest",
  "longest",
];

function useGameStats() {
  const [plays] = usePlays();
  const playsByGameId = groupBy(plays, (play) => play.gameId);
  return mapValues(playsByGameId, (plays) => {
    const stats = {
      count: 0,
      durationSum: 0,
      durationCount: 0,
      durationAverage: null as null | number,
    };
    plays.forEach((play) => {
      stats.count += 1;
      const duration = play.getDurationInHours();
      if (duration != null) {
        stats.durationSum += duration;
        stats.durationCount += 1;
        stats.durationAverage = stats.durationSum / stats.durationCount;
      }
    });
    return stats;
  });
}

export const ReportGameList = () => {
  const [games, loadingGames] = useGames();
  const gameStats = useGameStats();
  const sortCriterias: Record<GameSortCriteriaId, GameSortCriteria> = {
    alphabetic: {
      name: "By name",
      getSortKey: (game: Game) => game.name.toLowerCase(),
      direction: "asc" as const,
      getDetailLabel: () => null,
    },
    popular: {
      name: "Most played",
      getSortKey: (game: Game) => gameStats[game.id]?.count ?? 0,
      direction: "desc" as const,
      getDetailLabel: (game: Game) =>
        pluralize(gameStats[game.id]?.count ?? 0, "play", "plays"),
    },
    shortest: {
      name: "Shortest",
      getSortKey: (game: Game) =>
        gameStats[game.id]?.durationAverage ?? Infinity,
      direction: "asc" as const,
      getDetailLabel: (game: Game) =>
        formatDuration(gameStats[game.id]?.durationAverage ?? NaN),
    },
    longest: {
      name: "Longest",
      getSortKey: (game: Game) =>
        gameStats[game.id]?.durationAverage ?? -Infinity,
      direction: "desc" as const,
      getDetailLabel: (game: Game) =>
        formatDuration(gameStats[game.id]?.durationAverage ?? NaN),
    },
  };
  const [sortCriteria, setSortCriteria] =
    useState<GameSortCriteriaId>("alphabetic");
  const currentSortCriteria = sortCriterias[sortCriteria];
  const sortedGameItems = orderBy(
    games,
    currentSortCriteria.getSortKey,
    currentSortCriteria.direction
  );

  return (
    <ViewContentLayout>
      <Heading1>Games</Heading1>
      <div className="flex flex-col items-center my-2">
        <TabSet>
          {sortTabIds.map((id) => (
            <TabLink
              key={id}
              active={id === sortCriteria}
              onClick={() => setSortCriteria(id)}
            >
              {sortCriterias[id].name}
            </TabLink>
          ))}
        </TabSet>
      </div>
      {loadingGames ? (
        <SkeletonLoader />
      ) : (
        <List>
          {sortedGameItems.map((game) => (
            <ListLinkItem to={`/games/${game.id}`} key={game.id}>
              <ListItemIcon>
                <img
                  alt={game.name}
                  src={game.icon}
                  className="mx-auto object-cover rounded-full h-10 w-10"
                />
              </ListItemIcon>
              <ListItemText title={game.name} />
              <ListItemDescription>
                {currentSortCriteria.getDetailLabel(game)}
              </ListItemDescription>
            </ListLinkItem>
          ))}
        </List>
      )}
    </ViewContentLayout>
  );
};
