import { Play, Player } from "./domain/play";
import Table from "./common/components/tables/Table";
import TableHead from "./common/components/tables/TableHead";
import TableHeadCell from "./common/components/tables/TableHeadCell";
import TableBody from "./common/components/tables/TableBody";
import TableRow from "./common/components/tables/TableRow";
import TableCell from "./common/components/tables/TableCell";
import { useReducer } from "react";
import { Link } from "react-router-dom";
import { orderBy } from "lodash-es";

interface Playmate {
  player: Player;
  plays: Play[];
}

function usePlaymates(playerId: string, playerPlays: Play[]): Playmate[] {
  const playmatesById: Record<string, Playmate> = {};
  playerPlays.forEach((play) => {
    play.players.forEach((other) => {
      const otherId = other.id;
      if (otherId !== playerId) {
        const playmate = playmatesById[otherId] ?? {
          player: other,
          plays: [],
        };
        playmatesById[otherId] = playmate;
        playmate.plays.push(play);
      }
    });
  });
  return orderBy(playmatesById, (playMate) => playMate.plays.length, "desc");
}

export default function ReportPlaymates(props: {
  player: Player;
  playerPlays: Play[];
}) {
  const { player, playerPlays } = props;
  const playmates = usePlaymates(player.id, playerPlays);
  const [isEveryPlaymateVisible, showAllPlaymates] = useReducer(
    () => true,
    false,
  );
  const visiblePlaymates = isEveryPlaymateVisible
    ? playmates
    : playmates.slice(0, 10);

  return !playmates.length ? (
    <></>
  ) : (
    <>
      <Table>
        <TableHead>
          <tr>
            <TableHeadCell>Playmate</TableHeadCell>
            <TableHeadCell>Play count</TableHeadCell>
          </tr>
        </TableHead>
        <TableBody>
          {visiblePlaymates.map((playMate) => (
            <TableRow key={playMate.player.id}>
              <TableCell>
                <Link
                  className="cursor-pointer hover:text-black"
                  to={`/players/${playMate.player.id}`}
                >
                  {playMate.player.name}
                </Link>
              </TableCell>
              <TableCell>{playMate.plays.length}</TableCell>
            </TableRow>
          ))}
          {isEveryPlaymateVisible ||
          visiblePlaymates.length >= playmates.length ? null : (
            <TableRow className="cursor-pointer" onClick={showAllPlaymates}>
              <TableCell colSpan={2}>Show all playmates…</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
