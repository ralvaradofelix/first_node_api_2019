var myModule = require('./../credentials');

const name_database = myModule.name_database
module.exports = {
    db: `mongodb://localhost:27017/${ name_database }`
 };