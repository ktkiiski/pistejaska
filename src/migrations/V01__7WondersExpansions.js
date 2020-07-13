const fs = require('fs');
const utils = require("./utils");

const PLAYS = "plays-v1";

const db = utils.getDatabase();
db.collection(PLAYS)
  .where("gameId", "==", "7-wonders")
  .get()
  .then((querySnapshots) => {
    const originalPlays = querySnapshots.docs.map(doc => doc.data());
    const updatedPlays = originalPlays.map(migratePlay).filter(Boolean);
    if (process.argv.includes('dry-run')) {
      // Write original and updated data to files for testing purposes
      fs.writeFileSync('V01_original.json', JSON.stringify(originalPlays, null, 2));
      fs.writeFileSync('V01_updated.json', JSON.stringify(updatedPlays, null, 2));
      console.log('Wrote debugging files');
    } else {
      const batch = db.batch();
      updatedPlays.forEach(play => batch.update(db.collection(PLAYS).doc(play.id), play));
      batch.commit()
        .then(() => console.log(`Updated ${updatedPlays.length} plays successfully`))
        .catch(e => console.log('Failed to execute update batch', e));
    }
  })
  .catch(e => console.log('Failed to migrate data', e));

function migratePlay(play) {
  if (!play || !play.misc || play.misc.length < 1) {
    return null;
  }

  const updated = {
    ...play,
    expansions: play.expansions || [],
    misc: play.misc.filter(entry => !['variant-leaders', 'variant-cities', 'variant-armada'].includes(entry.fieldId)),
  };
  if (play.misc.some(entry => entry.fieldId === 'variant-leaders' && entry.data === 'Yes')) {
    updated.expansions.push('leaders');
  }
  if (play.misc.some(entry => entry.fieldId === 'variant-cities' && entry.data === 'Yes')) {
    updated.expansions.push('cities');
  }
  if (play.misc.some(entry => entry.fieldId === 'variant-armada' && entry.data === 'Yes')) {
    updated.expansions.push('armada');
  }

  return updated;
}
