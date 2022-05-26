const express = require("express");
const bodyParser = require("body-parser");  // This is a MiddleWare. It lets us read and request bodies.
const connectDB = require("./config/db"); // function that connects to the server. 
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const methodOverride = require('method-override');



// Load env variables:
dotenv.config({ path: './config/config.env' });

// Connect to the database:
connectDB();

// Create an Express instance
const app = express();

// Set ejs as the view engine 
app.set("view engine", "ejs");

// bodyParser is used to parse incoming request bodies 
app.use(bodyParser.urlencoded({ extended: true}));//, limit: '50mb' 
app.use(bodyParser.json());//{ limit: '50mb' }

app.use(methodOverride('_method'));

// cookieParser is used to parse cookie header and populate req.cookie
app.use(cookieParser());

app.use(cors({
    credentials:true, 
    origin:"http://localhost:3000"
}))

// define the directory where the static files are
app.use(express.static(path.join(__dirname, 'public')))

// get the route files
const nyc_inputs = require("./routes/input_routes");
const auth = require("./routes/auth");
const users = require("./routes/users");
const register = require('./routes/registration');
const about = require('./routes/about');

// middleware to handle erros:
app.use(errorHandler);

// create the base routes
app.use("/inputs", nyc_inputs);
app.use("/auth", auth);
app.use("/users", users);
app.use("/register", register);
app.use("/about", about);



const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode in ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => { process.exit(1) });
})

















