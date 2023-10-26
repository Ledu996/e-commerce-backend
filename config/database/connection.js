require('dotenv').config();
const connectionString = () => {
    console.log('procces', process.env.MONGO_DB);
    return process.env.MONGO_DB
}
module.exports = connectionString;