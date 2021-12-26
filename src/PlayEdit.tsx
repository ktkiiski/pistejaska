import { RouteComponentProps } from "react-router";
import React from "react";
import { Play } from "./domain/play";
import { PlayForm } from "./PlayForm";
import { useGames } from "./common/hooks/useGames";
import { usePlay } from "./common/hooks/usePlay";
import { app } from "./common/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, setDoc, doc } from "firebase/firestore";


export const PlayEdit = (props: RouteComponentProps<any>) => {
  const [games] = useGames();
  const playId = props.match.params["playId"];
  const [play, loading] = usePlay(playId);

  if (loading) return <>Loading...</>;

  if (!play) {
    return <>Play not found!</>;
  }
  const game = games?.find((g) => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onSave = async (play: Play) => {
    const currentDuration = play.getDurationInHours();
    const duration = play.getTimeInHoursSinceCreation();
    const tenMins = 10 / 60;
    const tenHours = 10;

    if (currentDuration == null && duration > tenMins && duration < tenHours) {
      const setDuration = window.confirm(
        "Looks like the play began " +
          duration +
          "h ago.\n\nDo you want to set the play length to be " +
          duration +
          " hours?"
      );
      if (setDuration) {
        play.setDurationInHours(duration);
      }
    }

    const storage = getStorage(app);

    await Promise.all(
      play.unsavedImages.map(async (file) => {
        const storageRef = ref(storage, 'play-images/' + file.filename)
        await uploadBytes(storageRef, file.file)
      })
    );

    const db = getFirestore(app)
    await setDoc(doc(db, "plays-v1", play.id), play.toDTO())

    props.history.push("/view/" + playId);
  };
  return <PlayForm game={game} play={play} onSave={(play) => onSave(play)} />;
};
