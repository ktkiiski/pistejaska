import React from "react";
import { games } from "./domain/games";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

export const Admin = () => {
  return (
    <div style={{ textAlign: "left" }}>
      <JSONInput id="lol" placeholder={games} locale={locale} height="550px" />
      Save coming...
    </div>
  );
};
