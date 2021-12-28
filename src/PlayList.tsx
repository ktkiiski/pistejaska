import { useState, useMemo } from "react";
import { TablePagination } from "@material-ui/core";

import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { useGames } from "./common/hooks/useGames";
import {
  TailwindList,
  TailwindListItem,
  TailwindListItemDescription,
  TailwindListItemIcon,
  TailwindListItemText,
} from "./common/components/List";
import { TailwindContainerTitle } from "./common/components/Container";
import { SkeletonLoader } from "./common/components/SkeletonLoader";
import ViewContentLayout from "./common/components/ViewContentLayout";

export const PlayList = (props: RouteComponentProps<{}>) => {
  const [games] = useGames();
  const [plays, loading, error] = usePlays();

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

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }

  const onSelectPlay = (play: Play) => props.history.push("/view/" + play.id);
  return (
    <ViewContentLayout>
      <TailwindContainerTitle>Plays</TailwindContainerTitle>

      {loading && <SkeletonLoader />}

      <TailwindList onClickShowAll={() => setShowAll(!showAll)}>
        {(showAll ? data : currentData).map((play) => {
          const game = games?.find((g) => g.id === play.gameId);
          return (
            <TailwindListItem key={play.id} onClick={() => onSelectPlay(play)}>
              {game && (
                <TailwindListItemIcon>
                  <img
                    alt="gamepic"
                    src={game.icon}
                    className="mx-auto object-cover rounded-full h-14 w-14 "
                  />
                </TailwindListItemIcon>
              )}
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
    </ViewContentLayout>
  );
};
