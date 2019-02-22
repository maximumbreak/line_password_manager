let Firestore = require('@google-cloud/firestore')
const { FIREBASE } = require('../constants')
let firestore = new Firestore({
  projectId: FIREBASE.PROJECT_ID,
  keyFilename: FIREBASE.KEY_PATH
})

module.exports = { firestore }
