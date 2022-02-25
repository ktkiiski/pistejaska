import { User } from "firebase/auth";

const adminEmails = process.env.REACT_APP_ADMIN_EMAILS?.split(",") ?? [];

export const isAdmin = (user: User): boolean =>
  user.emailVerified && adminEmails.find((x) => x === user.email) !== undefined;
