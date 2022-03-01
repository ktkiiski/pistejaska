import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useCurrentUser() {
  return useAuthState(getAuth());
}
