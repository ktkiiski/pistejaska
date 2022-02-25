import { User } from "firebase/auth";

export type UserDTO = {
  id: string;
  photoURL?: string | null;
  displayName: string;
  // TODO PANU: add playerId
};

export const toUserDTO = (user: User) => ({
  id: user.uid,
  photoURL: user.photoURL,
  displayName: user.displayName,
});
