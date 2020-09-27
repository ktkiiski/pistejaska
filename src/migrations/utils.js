const Firestore = require("@google-cloud/firestore");

module.exports = {
  /**
   * Initializes a Firestore client instance. Requires that the GOOGLE_APPLICATION_CREDENTIALS environment
   * variable is set and points to a JSON file which contains valid Google Cloud Service Account credentials
   * (see https://cloud.google.com/firestore/docs/quickstart-servers#set_up_authentication for details).
   */
  getDatabase() {
    return new Firestore({ projectId: "pistejaska-dev" });
  },
};
