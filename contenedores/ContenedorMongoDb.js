const { moongose } = require('../config/databaseMongoDB');

class ContenedorMongoDb {

    constructor() {
        this.moongose = moongose;
    }




}

module.exports = { ContenedorMongoDb };