import { RouteComponentProps } from "react-router";
import { flatMap, groupBy, orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { Player } from "./domain/play";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Heading1 from "./common/components/typography/Heading1";
import ListItemDescription from "./common/components/lists/ListItemDescription";
import { pluralize } from "./common/stringUtils";
import List from "./common/components/lists/List";
import ListItem from "./common/components/lists/ListItem";
import ListItemText from "./common/components/lists/ListItemText";

export const ReportPlayerList = (props: RouteComponentProps<{}>) => {
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

  const onSelectPlayer = (player: Player) =>
    props.history.push("/players/" + player.id);

  const players = groupBy(
    orderBy(
      flatMap(plays, (p) => p.players),
      (p) => p.name
    ),
    (p) => p.id
  );

  return (
    <ViewContentLayout>
      <Heading1>Players</Heading1>
      <List>
        {Object.keys(players).map((playerId) => {
          const player = players[playerId][0];
          const playCount = players[playerId].length;
          return (
            <ListItem onClick={() => onSelectPlayer(player)} key={player.id}>
              <ListItemText title={player.name} />
              <ListItemDescription>
                {pluralize(playCount, "play", "plays")}
              </ListItemDescription>
            </ListItem>
          );
        })}
      </List>
    </ViewContentLayout>
  );
};
