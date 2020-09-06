const fs = require("fs");
const utils = require("./utils");

const PLAYS = "plays-v1";

const db = utils.getDatabase();
db.collection(PLAYS)
  .where("gameId", "==", "terraforming-mars")
  .get()
  .then((querySnapshots) => {
    const originalPlays = querySnapshots.docs.map((doc) => doc.data());
    const updatedPlays = originalPlays.map(migratePlay).filter(Boolean);
    if (!process.argv.includes("--prod")) {
      // Write original and updated data to files for testing purposes
      fs.writeFileSync(
        "V02_original.json",
        JSON.stringify(originalPlays, null, 2)
      );
      fs.writeFileSync(
        "V02_updated.json",
        JSON.stringify(updatedPlays, null, 2)
      );
      console.log("Wrote debugging files");
    } else {
      const batch = db.batch();
      updatedPlays.forEach((play) =>
        batch.update(db.collection("plays-v1").doc(play.id), play)
      );
      batch
        .commit()
        .then(() =>
          console.log(`Updated ${updatedPlays.length} plays successfully`)
        )
        .catch((e) => console.log("Failed to execute update batch", e));
    }
  })
  .catch((e) => console.log("Failed to migrate data", e));

function migratePlay(play) {
  if (!play || !play.misc || play.misc.length < 1) {
    return null;
  }

  let updated = {
    ...play,
    expansions: play.expansions || [],
    misc: play.misc.filter(
      (entry) =>
        ![
          "variant-venus-next",
          "variant-colonies",
          "variant-prelude",
          "variant-turmoil",
          "variant-map",
        ].includes(entry.fieldId)
    ),
  };
  delete updated.rankings;
  if (
    play.misc.some(
      (entry) => entry.fieldId === "variant-venus-next" && entry.data === "Yes"
    )
  ) {
    updated.expansions.push("venus-next");
  }
  if (
    play.misc.some(
      (entry) =>
        entry.fieldId === "variant-advanced-cards" && entry.data === "Yes"
    )
  ) {
    updated.expansions.push("advanced-cards");
  }
  if (
    play.misc.some(
      (entry) => entry.fieldId === "variant-colonies" && entry.data === "Yes"
    )
  ) {
    updated.expansions.push("colonies");
  }
  if (
    play.misc.some(
      (entry) => entry.fieldId === "variant-prelude" && entry.data === "Yes"
    )
  ) {
    updated.expansions.push("prelude");
  }
  if (
    play.misc.some(
      (entry) => entry.fieldId === "variant-turmoil" && entry.data === "Yes"
    )
  ) {
    updated.expansions.push("turmoil");
  }
  if (
    play.misc.some(
      (entry) => entry.fieldId === "variant-map" && entry.data === "Hellas"
    )
  ) {
    updated.expansions.push("map-hellas");
  }
  if (
    play.misc.some(
      (entry) => entry.fieldId === "variant-map" && entry.data === "Elysium"
    )
  ) {
    updated.expansions.push("map-elysium");
  }

  return updated;
}
