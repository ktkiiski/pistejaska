import { usePlays } from "./common/hooks/usePlays";
import { TailwindContainerTitle } from "./common/components/Container";
import { SkeletonLoader } from "./common/components/SkeletonLoader";
import ViewContentLayout from "./common/components/ViewContentLayout";
import PlayList from "./PlayList";

export const PlayListView = () => {
  const [plays, loading, error] = usePlays();

  if (error) {
    return (
      <ViewContentLayout>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </ViewContentLayout>
    );
  }

  return (
    <ViewContentLayout>
      <TailwindContainerTitle>Plays</TailwindContainerTitle>
      {loading ? <SkeletonLoader /> : <PlayList plays={plays} />}
    </ViewContentLayout>
  );
};
