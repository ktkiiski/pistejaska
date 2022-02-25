import { User } from "firebase/auth";

const adminEmails = ["panu.vuorinen@gmail.com", "kimmo.kiiski@gmail.com"];
export const isAdmin = (user: User): boolean =>
  user.emailVerified && adminEmails.find((x) => x === user.email) !== undefined;
