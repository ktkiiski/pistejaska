import { flatMap, groupBy, orderBy } from "lodash-es";
import { usePlays } from "./common/hooks/usePlays";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Heading1 from "./common/components/typography/Heading1";
import ListItemDescription from "./common/components/lists/ListItemDescription";
import { pluralize } from "./common/stringUtils";
import List from "./common/components/lists/List";
import ListItemText from "./common/components/lists/ListItemText";
import ListLinkItem from "./common/components/lists/ListLinkItem";

export const ReportPlayerList = () => {
  const [plays, loading, error] = usePlays();

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }
  if (loading) {
    return <LoadingSpinner />;
  }

  const players = groupBy(
    orderBy(
      flatMap(plays, (p) => p.players),
      (p) => p.name,
    ),
    (p) => p.id,
  );

  return (
    <ViewContentLayout>
      <Heading1>Players</Heading1>
      <List>
        {Object.keys(players).map((playerId) => {
          const player = players[playerId][0];
          const playCount = players[playerId].length;
          return (
            <ListLinkItem to={`/players/${player.id}`} key={player.id}>
              <ListItemText title={player.name} />
              <ListItemDescription>
                {pluralize(playCount, "play", "plays")}
              </ListItemDescription>
            </ListLinkItem>
          );
        })}
      </List>
    </ViewContentLayout>
  );
};
