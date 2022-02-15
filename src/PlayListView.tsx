import { usePlays } from "./common/hooks/usePlays";
import { SkeletonLoader } from "./common/components/SkeletonLoader";
import ViewContentLayout from "./common/components/ViewContentLayout";
import PlayList from "./PlayList";
import { useGames } from "./common/hooks/useGames";
import Heading1 from "./common/components/typography/Heading1";
import { useMemo } from "react";
import { orderBy } from "lodash";
import GalleryStripe from "./common/components/gallery/GalleryStripe";

export const PlayListView = () => {
  const [plays, loadingPlays, errorPlays] = usePlays();
  const [games, loadingGames, errorGames] = useGames();

  const imageUrls = useMemo(() => {
    const srcs: string[] = [];
    orderBy(plays, (play) => play.getDate(), "desc").forEach((play) => {
      srcs.push(...play.getImageUrls());
    });
    return srcs;
  }, [plays]);

  if (errorPlays || errorGames) {
    return (
      <ViewContentLayout>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </ViewContentLayout>
    );
  }

  return (
    <ViewContentLayout>
      <Heading1>Plays</Heading1>
      <GalleryStripe className="mb-2" images={imageUrls} />
      {loadingPlays || loadingGames ? (
        <SkeletonLoader />
      ) : (
        <PlayList plays={plays} games={games} />
      )}
    </ViewContentLayout>
  );
};
