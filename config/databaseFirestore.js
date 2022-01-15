const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

class FirestoreDb {

    static instance;

    constructor() {

        if (FirestoreDb.instance) {
            return instance;
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        FirestoreDb.instance = admin.firestore(); 
        this.instance =  FirestoreDb.instance;

    }

}

module.exports = new FirestoreDb;