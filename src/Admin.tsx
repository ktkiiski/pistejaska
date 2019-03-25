import React from "react";
import { games } from "./domain/games";

export const Admin = () => {
  return (
    <div>
      <pre>{JSON.stringify(games, null, 2)}</pre>
    </div>
  );
};
