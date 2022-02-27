import React, { FC, useMemo, VFC } from "react";
import { Play } from "./domain/play";
import { useGames } from "./common/hooks/useGames";
import { Game } from "./domain/game";
import { orderBy, sortBy } from "lodash";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import { app } from "./common/firebase";
import { usePlay } from "./common/hooks/usePlay";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { formatNthNumber, getPositionAsEmoji } from "./common/stringUtils";
import ButtonBack from "./common/components/buttons/ButtonBack";
import CardButtonRow from "./common/components/buttons/CardButtonRow";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import ButtonDanger from "./common/components/buttons/ButtonDanger";
import Button from "./common/components/buttons/Button";
import Heading2 from "./common/components/typography/Heading2";
import CardContent from "./common/components/CardContent";
import Table from "./common/components/tables/Table";
import TableHead from "./common/components/tables/TableHead";
import TableRow from "./common/components/tables/TableRow";
import TableHeadCell from "./common/components/tables/TableHeadCell";
import TableCell from "./common/components/tables/TableCell";
import TableBody from "./common/components/tables/TableBody";
import TableFooter from "./common/components/tables/TableFooter";
import ImageGalleryList from "./common/components/gallery/ImageGalleryList";
import { ImageGalleryItem } from "./common/components/gallery/ImageGallerySwipeView";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { isAdmin } from "./auth/auth";
import { CommentList } from "./CommentList";
import { CommentAdd } from "./CommentAdd";
import { convertToLocaleDateString } from "./common/dateUtils";

const hiddenMiscFields = ["images", "name", "date"];

const PlayMiscFields: VFC<{ game: Game; play: Play }> = ({ game, play }) => {
  const date = play.getDate();
  const expansionIds = play.expansions;
  const visibleFields = orderBy(
    game.getMiscFields(expansionIds),
    "order"
  ).filter(({ field }) => !hiddenMiscFields.includes(field.id));
  return (
    <>
      Played on {convertToLocaleDateString(date)}
      {game.hasExpansions() && (
        <div>
          <span className="text-slate-500">Used expansions: </span>
          {(game.expansions || [])
            .filter(({ id }) => play.expansions.includes(id))
            .map(({ name }) => name)
            .join(", ") || "None"}
        </div>
      )}
      {visibleFields.map(({ field }, idx) => {
        if (field.valuePerPlayer) {
          return (
            <React.Fragment key={field.id}>
              {play.players.map((player) => (
                <div key={player.id}>
                  <span className="text-slate-500">{`${field.name} (${player.name}): `}</span>
                  {play.getMiscFieldDisplayValue(field, player.id)}
                </div>
              ))}
            </React.Fragment>
          );
        }
        return (
          <div key={field.id}>
            <span className="text-slate-500">{`${field.name}: `}</span>
            {play.getMiscFieldDisplayValue(field)}
          </div>
        );
      })}
    </>
  );
};

export const PlayView: FC = () => {
  const [games] = useGames();
  const [user] = useAuthState(getAuth());
  const playId = useParams().playId!;
  const navigate = useNavigate();

  const [play, loading, error] = usePlay(playId);

  const images = useMemo((): ImageGalleryItem[] => {
    if (!play) return [];
    return play.getImageUrls().map((src) => ({
      src,
      title: play.getDisplayName(),
      date: play.getDate(),
      link: `/view/${play.id}`,
    }));
  }, [play]);

  if (error) return <>Error: {error}</>;

  const onBack = () => navigate("/");

  if (loading) {
    return (
      <ViewContentLayout header={<ButtonBack onClick={onBack} />}>
        <LoadingSpinner />
      </ViewContentLayout>
    );
  }

  if (!user) {
    return <></>;
  }
  if (!play) {
    return <>Play not found!</>;
  }
  const game = games?.find((g) => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onEditPlay = () => navigate("/edit/" + play.id);

  const onReplay = () => navigate(`/replay/${playId}`);

  const onDelete = async () => {
    const reallyDelete = await window.confirm(
      `Do you really want to delete play ${play.getName()}?`
    );
    if (!reallyDelete) return;
    const db = getFirestore(app);
    await deleteDoc(doc(db, "plays-v1", playId));

    navigate("/");
  };

  const MobileHeader = () => (
    <div className="block md:hidden">
      <div className="flex shadow-lg -mt-2 -ml-2 -mr-2 mb-4 rounded-t-xl p-2 bg-gradient-to-l from-slate-300 to-white">
        <img
          className="object-cover object-top  w-24 h-24 rounded-full shadow-lg"
          alt={game.name}
          src={game.icon}
        />
        <div className="flex flex-col py-5 pl-4">
          <strong className="text-slate-900 text-xl font-medium text-left">
            Play: {game.name}
          </strong>
          <div className="text-slate-500 font-medium text-sm sm:text-base leading-tight truncate text-left">
            {play.getName()}
          </div>
        </div>
      </div>

      <CardContent className="p-2">
        <PlayMiscFields play={play} game={game} />
      </CardContent>
    </div>
  );

  const DesktopHeader = () => (
    <div className="hidden md:block">
      <div className="flex bg-white rounded-xl -mt-2 -ml-2 -mr-2">
        <div>
          <img
            className="max-h-72 rounded-tl-xl"
            alt={game.name}
            src={game.icon}
          />
        </div>
        <div className="flex-auto p-6 shadow-xl">
          <strong className="text-gray-900 text-2xl font-medium text-left">
            Play: {game.name}
          </strong>
          <div className="text-gray-500 font-medium text-sm sm:text-base leading-tight truncate text-left">
            {play.getName()}
          </div>

          <div className="mt-8 opacity-60">
            <PlayMiscFields play={play} game={game} />
          </div>
        </div>
      </div>
    </div>
  );

  const showDelete = play.createdBy === user.uid || isAdmin(user);
  return (
    <ViewContentLayout
      header={<ButtonBack onClick={onBack} />}
      footer={
        <CardButtonRow>
          <ButtonPrimary onClick={onEditPlay}>Edit</ButtonPrimary>
          {showDelete && (
            <ButtonDanger onClick={onDelete}>Delete</ButtonDanger>
          )}{" "}
          <Button onClick={onReplay}>
            <span className="hidden md:inline">Play</span>
            {" again"}
          </Button>
          <Button onClick={() => navigate(`/games/${game.id}`)}>
            <span className="hidden md:inline">Show</span>
            {" reports"}
          </Button>
        </CardButtonRow>
      }
    >
      <MobileHeader />
      <DesktopHeader />
      <Heading2>Scores</Heading2>
      <PlayTable game={game} play={play} />

      {images.length > 0 && (
        <>
          <Heading2>Images</Heading2>
          <ImageGalleryList images={images} />
        </>
      )}

      <Heading2>Comments</Heading2>
      <CommentList playId={play.id}></CommentList>
      <CommentAdd playId={play.id} user={user}></CommentAdd>
    </ViewContentLayout>
  );
};

const PlayTable = (props: { game: Game; play: Play }) => {
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

  const formatName = (name: string) => {
    const parts = name.split(" ");
    const firstName = parts[0];
    const lastName =
      parts.length > 1 ? parts[1].substring(0, 1).toUpperCase() : "";

    return `${firstName}${lastName}`;
  };

  return (
    <>
      <Table className="text-center">
        <TableHead>
          <TableRow key="1">
            <TableHeadCell key="category">Category</TableHeadCell>
            {players.map((p) => (
              <TableCell key={p.id}>
                {`${getPositionAsEmoji(play.getPosition(p.id))} `}
                <Link to={"/players/" + p.id}>{`${formatName(p.name)}`}</Link>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {game.simultaneousTurns ? null : (
            <TableRow key="2">
              <TableCell className="text-left" key="starting-order">
                Starting order
              </TableCell>
              {players.map((f, idx) => (
                <TableCell
                  key={f.id}
                  className={idx % 2 === 0 ? "bg-slate-50" : ""}
                >
                  {formatNthNumber(play.players.lastIndexOf(f) + 1)}
                </TableCell>
              ))}
            </TableRow>
          )}
          {scoreFields.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="text-left" key="name">
                {f.name}
              </TableCell>
              {players.map((p, idx) => (
                <TableCell
                  key={p.id}
                  className={idx % 2 === 0 ? "bg-slate-50" : ""}
                >
                  {
                    (
                      play.scores.find(
                        (s) => s.fieldId === f.id && s.playerId === p.id
                      ) || ({} as any)
                    ).score
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow key="footer">
            <TableCell key="total" className="text-left">
              𝚺
            </TableCell>
            {players.map((f) => (
              <TableCell key={f.id}>{play.getTotal(f.id)}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};
