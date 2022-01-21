import { usePlays } from "./common/hooks/usePlays";
import { SkeletonLoader } from "./common/components/SkeletonLoader";
import ViewContentLayout from "./common/components/ViewContentLayout";
import PlayList from "./PlayList";
import { useGames } from "./common/hooks/useGames";
import Heading1 from "./common/components/typography/Heading1";

export const PlayListView = () => {
  const [plays, loadingPlays, errorPlays] = usePlays();
  const [games, loadingGames, errorGames] = useGames();

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
      {loadingPlays || loadingGames ? (
        <SkeletonLoader />
      ) : (
        <PlayList plays={plays} games={games} />
      )}
    </ViewContentLayout>
  );
};
