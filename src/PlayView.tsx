import { RouteComponentProps } from "react-router";
import React, { useState } from "react";
import { Play, MiscDataDTO } from "./domain/play";
import { useGames } from "./common/hooks/useGames";
import { GameMiscFieldDefinition, Game } from "./domain/game";
import { usePlays } from "./common/hooks/usePlays";
import { firestore } from "./common/firebase";
import { sortBy } from "lodash";
import { Link } from "react-router-dom";
import {
  TailwindCard,
  TailwindContainerTitle,
  TailwindCardContent,
} from "./common/components/Container";
import {
  TailwindTableHead,
  TailwindTableHeadCell,
  TailwindTableCell,
  TailwindTableRow,
  TailwindTableFooter,
  TailwindTableBody,
  TailwindTable,
} from "./common/components/Table";
import {
  TailwindBackButton,
  TailwindButton,
  TailwindButtonDanger,
  TailwindButtonPrimary,
  TailwindCardButtonRow,
} from "./common/components/Button";
import { LoadingSpinner } from "./common/components/LoadingSpinner";

export const PlayView = (props: RouteComponentProps<any>) => {
  const games = useGames();
  const playId = props.match.params["playId"];

  const [plays, loading, error] = usePlays();

  const [fullScreenImageSrc, setFullScreenImageSrc] = useState("");

  if (error) return <>Error: {error}</>;

  const onBack = () => props.history.push("/");

  if (loading) {
    return (
      <div className="p-2">
        <div className="p-2">
          <TailwindBackButton onClick={onBack} />
        </div>
        <TailwindCard className="h-screen">
          <LoadingSpinner />
        </TailwindCard>
      </div>
    );
  }

  const play = plays.find((d) => d.id === playId);

  if (!play) {
    return <>Play not found!</>;
  }
  const game = games?.find((g) => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onEditPlay = () => props.history.push("/edit/" + play.id);

  const onReplay = () => props.history.push(`/replay/${playId}`);

  const onDelete = async () => {
    const reallyDelete = await window.confirm(
      `Do you really want to delete play ${play.getName()}?`
    );
    if (!reallyDelete) return;
    const db = firestore();
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

  const images = play.getImageUrls();
  const PlayImages = () =>
    images.length > 0 ? (
      <>
        {fullScreenImageSrc ? (
          <div
            className="backdrop-blur-lg top-0 left-0 fixed w-full h-full z-10 flex justify-center"
            onClick={() => setFullScreenImageSrc("")}
          >
            <img
              src={fullScreenImageSrc}
              className="object-contain"
              alt={fullScreenImageSrc}
            />
          </div>
        ) : (
          <></>
        )}

        <TailwindContainerTitle>Images</TailwindContainerTitle>
        {images.map((src) => (
          <div
            key={src}
            className="flex justify-center"
            onClick={() =>
              fullScreenImageSrc
                ? setFullScreenImageSrc("")
                : setFullScreenImageSrc(src)
            }
          >
            <img src={src} alt={src} className="max-h-80" />
          </div>
        ))}
      </>
    ) : (
      <></>
    );

  return (
    <>
      <div className="p-2">
        <div className="p-2">
          <TailwindBackButton onClick={onBack} />
        </div>

        <TailwindCard className="text-center text-sm p-0">
          <div className="p-2">
            <div className="overflow-visible m-10 relative mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6 ml-4 md:ml-6">
              <img
                className="object-cover object-top absolute -left-4 md:-left-6 w-24 h-24 md:w-28 md:h-28 rounded-full shadow-lg"
                alt={game.name}
                src={game.icon}
              />
              <div className="flex flex-col py-5 pl-24">
                <strong className="text-gray-900 text-xl font-medium text-left">
                  Play: {game.name}
                </strong>
                <div className="text-gray-500 font-medium text-sm sm:text-base leading-tight truncate text-left">
                  {play.getName()}
                </div>
              </div>
            </div>

            <TailwindCardContent className="p-2">
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
              {play.misc
                .filter((x) => x.fieldId !== "images")
                .map((misc, idx) => (
                  <div key={idx}>
                    {getFieldName(misc)}: {misc.data}
                  </div>
                ))}
            </TailwindCardContent>

            <TailwindContainerTitle>Scores</TailwindContainerTitle>
            <PlayTable game={game} play={play} {...props} />

            <PlayImages />
          </div>
          <div className="hidden md:flex">
            <TailwindCardButtonRow className="hidden md:flex">
              <TailwindButtonPrimary onClick={onEditPlay}>
                Edit
              </TailwindButtonPrimary>
              <TailwindButtonDanger onClick={onDelete}>
                Delete
              </TailwindButtonDanger>
              <TailwindButton onClick={onReplay}>
                Play&nbsp;again
              </TailwindButton>
              <TailwindButton
                onClick={() => props.history.push(`/games/${game.id}`)}
              >
                Show&nbsp;reports
              </TailwindButton>
            </TailwindCardButtonRow>
          </div>
        </TailwindCard>
      </div>

      <div className="w-full p-4 bg-white mt-8 flex flex-row gap-4 flex-wrap justify-center sticky bottom-0 border-t-2 md:hidden">
        <TailwindButtonPrimary onClick={onEditPlay}>Edit</TailwindButtonPrimary>
        <TailwindButtonDanger onClick={onDelete}>Delete</TailwindButtonDanger>
        <TailwindButton onClick={onReplay}>Again</TailwindButton>
        <TailwindButton onClick={() => props.history.push(`/games/${game.id}`)}>
          Reports
        </TailwindButton>
      </div>
    </>
  );
};

const PlayTable = (
  props: { game: Game; play: Play } & RouteComponentProps<{}>
) => {
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
    <TailwindCardContent>
      <TailwindTable>
        <TailwindTableHead>
          <TailwindTableRow key='1'>
            <TailwindTableHeadCell key='category'>Category</TailwindTableHeadCell>
            {players.map((p, idx) => (
              <TailwindTableCell key={p.id}>
                {`${play.getPosition(p.id)}.`}
                <Link to={"/players/" + p.id}>{`${formatName(p.name)}`}</Link>
              </TailwindTableCell>
            ))}
          </TailwindTableRow>
        </TailwindTableHead>
        <TailwindTableBody>
          <TailwindTableRow key='2'>
            <TailwindTableCell className="text-left" key='starting-order'>
              Starting order
            </TailwindTableCell>
            {players.map((f, idx) => (
              <TailwindTableCell
                key={f.id}
                className={idx % 2 === 0 ? "bg-gray-50" : ""}
              >
                {play.players.lastIndexOf(f) + 1}.
              </TailwindTableCell>
            ))}
          </TailwindTableRow>
          {scoreFields.map((f) => (
            <TailwindTableRow key={f.id}>
              <TailwindTableCell className="text-left" key='name'>
                {f.name}
              </TailwindTableCell>
              {players.map((p, idx) => (
                <TailwindTableCell
                  key={p.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : ""}
                >
                  {
                    (
                      play.scores.find(
                        (s) => s.fieldId === f.id && s.playerId === p.id
                      ) || ({} as any)
                    ).score
                  }
                </TailwindTableCell>
              ))}
            </TailwindTableRow>
          ))}
        </TailwindTableBody>

        <TailwindTableFooter>
          <TailwindTableRow key='footer'>
            <TailwindTableCell key='total'>Total</TailwindTableCell>
            {players.map((f, idx) => (
              <TailwindTableCell key={f.id}>
                {play.getTotal(f.id)}
              </TailwindTableCell>
            ))}
          </TailwindTableRow>
        </TailwindTableFooter>
      </TailwindTable>
    </TailwindCardContent>
  );
};
