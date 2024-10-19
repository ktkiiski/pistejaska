import { groupBy, last, mapValues, orderBy, sortBy } from "lodash-es";
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

type GameSortCriteriaId =
  | "recentlyPlayed"
  | "alphabetic"
  | "popular"
  | "shortest"
  | "longest";

interface GameSortCriteria {
  name: string;
  getSortKey: (game: Game) => number | string;
  direction: "asc" | "desc";
  getDetailLabel: (game: Game) => string | null;
}

const sortTabIds: GameSortCriteriaId[] = [
  "recentlyPlayed",
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
      latestPlayOn: null as null | undefined | string,
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

    stats.latestPlayOn = last(sortBy(plays, (x) => x.getDate().toString()))
      ?.getDate()
      .toString();

    return stats;
  });
}

export const ReportGameList = () => {
  const [games, loadingGames] = useGames();

  const gameStats = useGameStats();

  const sortCriterias: Record<GameSortCriteriaId, GameSortCriteria> = {
    recentlyPlayed: {
      name: "Last played",
      getSortKey: (game: Game) =>
        gameStats[game.id]?.latestPlayOn ?? "1900-01-01",
      direction: "desc" as const,
      getDetailLabel: () => null,
    },
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
    useState<GameSortCriteriaId>("recentlyPlayed");
  const currentSortCriteria = sortCriterias[sortCriteria];
  const sortedGameItems = orderBy(
    games,
    currentSortCriteria.getSortKey,
    currentSortCriteria.direction,
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
            <ListLinkItem
              to={`/games/${game.id}?from=${window.location.pathname}`}
              key={game.id}
            >
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
