
const mongoose = require("mongoose");

const Grid = require("gridfs-stream");

const connectDB = async () => {

    const conn = await mongoose.createConnection(process.env.MONGO_URI, {
        //options that will stop some warnings from happening:
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,

    });

    //init gfs
    let gfs;
    conn.once("open", () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads');
    });


}

module.exports = connectDB;


