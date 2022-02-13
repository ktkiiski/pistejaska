import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Play, PlayDTO } from "./domain/play";
import { PlayForm } from "./PlayForm";
import { useGames } from "./common/hooks/useGames";
import { usePlay } from "./common/hooks/usePlay";
import { app } from "./common/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import Spinner from "./common/components/Spinner";
import useConfirmLeave from "./common/hooks/useConfirmLeave";

const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

async function updatePlay(playId: string, changes: Partial<PlayDTO>) {
  if (isEmpty(changes)) {
    // Nothing to actually save
    return;
  }
  // Update the play on Firestore
  const db = getFirestore(app);
  await updateDoc(doc(db, "plays-v1", playId), changes);
}

// Wait for 5 seconds until to save automatically
const autoSaveInterval = 5000;

export const PlayEdit = () => {
  const navigate = useNavigate();
  const playId = useParams().playId as string;
  const [games, isLoadingGames] = useGames();
  const [loadedPlay, isLoadingPlay] = usePlay(playId);
  const [unsavedChanges, setUnsavedChanges] = useState<Partial<PlayDTO>>({});
  const [changesBeingCurrentlySaved, setChangesBeingCurrentlySaved] =
    useState<null | Partial<PlayDTO>>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isSaveTriggered, setIsSaveTriggered] = useState<boolean>(false);
  const isSaving = changesBeingCurrentlySaved != null;
  const hasUnsavedChanges = !isEmpty(unsavedChanges);

  const play = useMemo(() => {
    if (!loadedPlay) return null;
    return new Play({
      ...loadedPlay.toDTO(),
      ...changesBeingCurrentlySaved,
      ...unsavedChanges,
    });
  }, [changesBeingCurrentlySaved, loadedPlay, unsavedChanges]);

  /**
   * Perform the save to Firestore whenever a save has
   * been triggered.
   */
  useEffect(() => {
    async function save(savedChanges: Partial<PlayDTO>) {
      setChangesBeingCurrentlySaved(savedChanges);
      setUnsavedChanges({});
      setIsSaveTriggered(false);
      try {
        await updatePlay(playId, savedChanges);
      } catch {
        // If fails to save, put saved changes back to unsaved changes
        setUnsavedChanges((changes) => ({ ...savedChanges, ...changes }));
        // Let's undo any click to "Done"
        setIsDone(false);
      } finally {
        // Not saving any more
        setChangesBeingCurrentlySaved(null);
      }
    }

    if (!isSaving && isSaveTriggered) {
      // If not saving but there are unsaved changes, start a save
      save(unsavedChanges);
    }
  }, [playId, unsavedChanges, isSaving, isSaveTriggered]);

  /**
   * Navigate to the play view after "done" and there is
   * nothing to save any more.
   */
  useEffect(() => {
    if (isDone && !isSaving && !isSaveTriggered && !hasUnsavedChanges) {
      // When done and everything saved, redirect to view the play
      navigate(`/view/${playId}`);
    }
  }, [navigate, isDone, isSaving, hasUnsavedChanges, playId, isSaveTriggered]);

  /**
   * Wait for a certain time whenever there is something to save
   * and then actually trigger the save.
   */
  useEffect(() => {
    if (hasUnsavedChanges && !isSaveTriggered && !isSaving) {
      // Trigger the save after the given interval
      const timeout = setTimeout(
        () => setIsSaveTriggered(true),
        autoSaveInterval
      );
      return () => clearTimeout(timeout);
    }
  }, [hasUnsavedChanges, isSaveTriggered, isSaving]);

  const shouldConfirmLeaving = hasUnsavedChanges || isSaveTriggered || isSaving;
  /**
   * If there are unsaved changes or a save is in progress, then
   * confirm any attempt to navigate away from the page.
   */
  useConfirmLeave(shouldConfirmLeaving);

  if (!play) {
    return isLoadingPlay ? (
      <LoadingSpinner />
    ) : (
      <ViewContentLayout>Play not found!</ViewContentLayout>
    );
  }
  const { gameId } = play;
  const game = games?.find((g) => g.id === gameId);
  if (!game) {
    if (isLoadingGames) {
      return <LoadingSpinner />;
    }
    return isLoadingGames ? (
      <LoadingSpinner />
    ) : (
      <ViewContentLayout>Game not found!</ViewContentLayout>
    );
  }

  const onImageUpload = async (fieldId: string, file: File) => {
    const storage = getStorage(app);
    const dateString = new Date().toISOString().substring(0, 10);
    const extension = getFileExtension(file.name);
    const filename = `${dateString}--${playId}--${uuid()}.${extension}`;
    const storageRef = ref(storage, "play-images/" + filename);
    await uploadBytes(storageRef, file);
    const oldValue = play.misc.find((x) => x.fieldId === fieldId);
    const oldMisc = play.misc.filter((x) => x.fieldId !== fieldId);
    const newMisc = oldMisc.concat({
      fieldId,
      data: ((oldValue?.data as string[]) || []).concat([filename]),
    });
    onEdit({ misc: newMisc });
    // Trigger save immediately after an image upload, without the delay
    setIsSaveTriggered(true);
  };

  const onDone = async () => {
    const currentDuration = play.getDurationInHours();
    const duration = play.getTimeInHoursSinceCreation();
    const tenMins = 10 / 60;
    const tenHours = 10;

    if (currentDuration == null && duration > tenMins && duration < tenHours) {
      const setDuration = window.confirm(
        `Looks like the play began ${duration}h ago.\n\nDo you want to set the play length to be ${duration} hours?`
      );
      if (setDuration) {
        // TODO: Should not dangerously mutate an existing instance!!!
        play.setDurationInHours(duration);
        onEdit({ misc: play.misc });
      }
    }

    // Marks everything as done. Will redirect after pending changes are saved.
    // See the useEffect hooks above.
    setIsDone(true);
    setIsSaveTriggered(true);
  };

  const onEdit = (changes: Partial<PlayDTO>) => {
    // Merge new changes to the unsaved changes
    setUnsavedChanges((oldChanges) => ({ ...oldChanges, ...changes }));
  };

  return (
    <>
      {isDone ? <LoadingSpinner /> : null}
      <PlayForm
        className={isDone ? "hidden" : undefined}
        game={game}
        play={play}
        onImageUpload={onImageUpload}
        onEdit={onEdit}
        onDone={onDone}
      />
      {isSaving ? (
        <Spinner className="fixed bottom-5 right-5 w-7 h-7 pointer-events-none mix-blend-difference text-white opacity-50" />
      ) : null}
    </>
  );
};
