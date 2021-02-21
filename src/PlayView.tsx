import { RouteComponentProps } from "react-router";
import React from "react";
import { Play, MiscDataDTO } from "./domain/play";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { useGames } from "./domain/games";
import { GameMiscFieldDefinition, Game } from "./domain/game";
import { usePlays } from "./common/hooks/usePlays";
import firebase from "firebase";
import { sortBy } from "lodash";
import ButtonRow from "./ButtonRow";
import { Link } from "react-router-dom";

export const PlayView = (props: RouteComponentProps<any>) => {
  const games = useGames();
  const playId = props.match.params["playId"];

  const [plays, loading, error] = usePlays();

  if (error) return <>Error: {error}</>;

  if (loading) return <>Loading...</>;

  const play = plays.find((d) => d.id === playId);

  if (!play) {
    return <>Play not found!</>;
  }
  const game = games.find((g) => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onEditPlay = () => props.history.push("/edit/" + play.id);
  const onBack = () => props.history.push("/");
  const onReplay = () => props.history.push(`/replay/${playId}`);

  const onDelete = async () => {
    const reallyDelete = await window.confirm(
      `Do you really want to delete play ${play.getName()}?`
    );
    if (!reallyDelete) return;
    const db = firebase.firestore();
    await db.collection("plays-v1").doc(playId).delete();

    props.history.push("/");
  };

  const getFieldName = (misc: MiscDataDTO): string => {
    const field = game
      .getFields(play.expansions)
      .find((f) => f.field.id === misc.fieldId);
    if (!field) return "";
    if ((field.field as GameMiscFieldDefinition).valuePerPlayer === true) {
      const playerName = (
        play.players.find((p) => p.id === misc.playerId) || ({} as any)
      ).name;
      return `${field.field.name} (${playerName})`;
    }
    return field.field.name;
  };

  return (
    <div style={{ paddingBottom: "1em" }}>
      <h2>Play: {game.name}</h2>
      <div>Played on {play.getDate().toLocaleDateString()}</div>
      {game.hasExpansions() && (
        <div>
          Used expansions:{" "}
          {(game.expansions || [])
            .filter(({ id }) => play.expansions.includes(id))
            .map(({ name }) => name)
            .join(", ") || "None"}
        </div>
      )}
      {play.misc.map((misc, idx) => (
        <div key={idx}>
          {getFieldName(misc)}: {misc.data}
        </div>
      ))}
      <PlayTable game={game} play={play} {...props} />
      <ButtonRow>
        <Button variant="contained" color="default" onClick={onBack}>
          &lt;
        </Button>
        <Button variant="contained" color="primary" onClick={onEditPlay}>
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="contained" color="default" onClick={onReplay}>
          Play again
        </Button>
        <Button
          variant="contained"
          onClick={() => props.history.push(`/reports/game/${game.id}`)}
        >
          Show reports
        </Button>
      </ButtonRow>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    paddingLeft: "4px",
  },
  table: {
    maxWidth: "100%",
  },
  "@global": {
    ".MuiTableCell-root": {
      padding: "0",
      fontSize: "0.8em",
    },
  },
}));

const PlayTable = (
  props: { game: Game; play: Play } & RouteComponentProps<{}>
) => {
  const classes = useStyles();
  const highlightColor = "#f5f5f5";
  const { game, play } = props;
  const hasTieBreaker =
    play.scores.filter((x) => x.fieldId === "tie-breaker" && x.score).length >
    0;
  const hasMiscScores =
    play.scores.filter((x) => x.fieldId === "misc" && x.score).length > 0;

  const scoreFields = game
    .getScoreFields(play.expansions || [])
    .map((x) => x.field)
    .filter((x) => (x.id === "misc" ? hasMiscScores : true))
    .filter((x) => (x.id === "tie-breaker" ? hasTieBreaker : true));

  const players = sortBy(play.players, (x) => play.getPosition(x.id));

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              {players.map((p, idx) => (
                <TableCell
                  key={p.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? highlightColor : "",
                  }}
                >
                  {`${play.getPosition(p.id)}. `}
                  <Link
                    to={"/reports/player/" + p.id}
                  >
                    {`${p.name}`}
                  </Link>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Starting order</TableCell>
              {players.map((f, idx) => (
                <TableCell
                  key={f.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? highlightColor : "",
                  }}
                >
                  {play.players.lastIndexOf(f) + 1}.
                </TableCell>
              ))}
            </TableRow>
            {scoreFields.map((p) => (
              <TableRow key={p.id}>
                <TableCell scope="row">{p.name}</TableCell>
                {players.map((f, idx) => (
                  <TableCell
                    scope="row"
                    key={f.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? highlightColor : "",
                    }}
                  >
                    {
                      (
                        play.scores.find(
                          (s) => s.fieldId === p.id && s.playerId === f.id
                        ) || ({} as any)
                      ).score
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              {players.map((f, idx) => (
                <TableCell
                  key={f.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? highlightColor : "",
                  }}
                >
                  {play.getTotal(f.id)}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </div>
  );
};
