const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");



// Load env variables
dotenv.config({ path: './config/config.env' });

// Load models:
const Input = require('./models/User_input');
const RealEstateVars = require('./models/RealEstateVars');
const User = require("./models/User");
const Review = require("./models/Review");


// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    //options that will stop some warnings from happening:
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});



// read JSON files with  that we want to import 
const inputs = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/inputs.json`, 'utf-8')
);

const reatEstate = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/RealEstate.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);




// Import data into DB
const importData = async () => {
    try {
        await Input.create(inputs);// import all data from the inputs.json file
        await RealEstateVars.create(reatEstate);
        await User.create(users);
        await Review.create(reviews);
        console.log("Data imported");
        process.exit();
    } catch (err) {
        console.error(err);
    }
};


// Delete all data
const deleteData = async () => {
    try {
        await Input.deleteMany();
        await RealEstateVars.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data destroyed");
        process.exit();
    } catch (err) {
        console.error(err);
    }
};


if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}