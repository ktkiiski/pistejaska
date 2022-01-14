import { useEffect } from "react";

const confirmMessage =
  "You have unsaved changes. Are you sure you want to leave this page?";

export default function useConfirmLeave(shouldConfirmLeaving: boolean): void {
  useEffect(() => {
    if (shouldConfirmLeaving) {
      const confirmLeave = (event: BeforeUnloadEvent) => {
        // NOTE: Chrome always shows its own message
        event.returnValue = confirmMessage;
        return confirmMessage;
      };
      window.addEventListener("beforeunload", confirmLeave);
      return () => window.removeEventListener("beforeunload", confirmLeave);
    }
  }, [shouldConfirmLeaving]);
}
