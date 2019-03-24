import firebase from "firebase";
import React from "react";

import { useCollection } from "react-firebase-hooks/firestore";

export const DatabaseList = () => {
  const { error, loading, value } = useCollection(
    firebase.firestore().collection("list")
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Collection:{" "}
            {value.docs.map(doc => (
              <React.Fragment key={doc.id}>
                {JSON.stringify(doc.data())},{" "}
              </React.Fragment>
            ))}
          </span>
        )}
      </p>
    </div>
  );
};
