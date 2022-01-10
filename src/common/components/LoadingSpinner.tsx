import React from "react";
import Spinner from "./Spinner";

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center w-full my-2 py-4">
    <Spinner className="-m1-1 mr-4 h-8 w-8 text-indigo-800" />
  </div>
);
