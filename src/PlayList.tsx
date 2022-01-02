import { useState, useMemo, useCallback } from "react";
import { TablePagination } from "@material-ui/core";
import { useHistory } from "react-router";
import { Play } from "./domain/play";
import { orderBy } from "lodash";
import { useGames } from "./common/hooks/useGames";
import {
  TailwindList,
  TailwindListItem,
  TailwindListItemDescription,
  TailwindListItemIcon,
  TailwindListItemText,
} from "./common/components/List";

interface PlayListProps {
  plays: Play[];
}

const PlayList = (props: PlayListProps) => {
  const { plays } = props;
  const history = useHistory();
  const [games] = useGames();

  const data = useMemo(
    () =>
      orderBy(plays, [(play) => play.getDate(), "created"], ["desc", "desc"]),
    [plays]
  );

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const currentData = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return data.slice(offset, offset + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  const [showAll, setShowAll] = useState(false);

  const onSelectPlay = useCallback(
    (play: Play) => history.push("/view/" + play.id),
    [history]
  );
  return (
    <>
      <TailwindList onClickShowAll={() => setShowAll(!showAll)}>
        {(showAll ? data : currentData).map((play) => {
          const game = games?.find((g) => g.id === play.gameId);
          return (
            <TailwindListItem key={play.id} onClick={() => onSelectPlay(play)}>
              <TailwindListItemIcon>
                <img
                  alt="gamepic"
                  src={game?.icon}
                  className="mx-auto object-cover rounded-full h-14 w-14 "
                />
              </TailwindListItemIcon>
              <TailwindListItemText
                title={play.getName() ?? ""}
                description={game?.name}
              />
              <TailwindListItemDescription
                text={play.getDate().toLocaleDateString()}
              />
            </TailwindListItem>
          );
        })}
      </TailwindList>

      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={(e, page) => {
          setCurrentPage(page);
        }}
        onChangeRowsPerPage={(e) => {
          setCurrentPage(0);
          setItemsPerPage((e as any).target.value);
        }}
        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
      />
    </>
  );
};

export default PlayList;
