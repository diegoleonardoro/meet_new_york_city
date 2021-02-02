const express = require("express");
const bodyParser = require("body-parser");  // This is a MiddleWare. It lets us read and request bodies.
const connectDB = require("./config/db"); // function that connects to the server. 
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const path = require("path");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');



// Load env variables:
dotenv.config({ path: './config/config.env' });

// Connect to the database:
connectDB();

// Routes file:
const nyc_inputs = require("./routes/input_routes");
const real_estate_vars = require("./routes/realestatevars_routes");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express()

app.use(bodyParser.json()); // --->  This allows us to receive data from the user. 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/")); // --->  Here we are poiting to the path where all the static files are located. This allows us to use "index.html" as out root template. 


// Cookie parser
app.use(cookieParser());


// dev login middleware:
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


//File uploading 
app.use(fileupload())


// Set static folder 
app.use(express.static(path.join(__dirname, "public")));


// Sanitize data
app.use(mongoSanitize());


// Set security headers
app.use(helmet());


// Prevent XSS attaches
app.use(xss());


// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // Max requests per time specified in windoMs
})
app.use(limiter);


// Prevent http param pollution
app.use(hpp());


// Enable CORS
app.use(cors());



// Mount routers
app.use("/inputs", nyc_inputs); // --->  "/inputs" will be the base route for all the nyc_inputs routes
app.use("/realEstateVars", real_estate_vars); // ---> "/realEstateVars" will be the base route for all the  real_estate_vars routes 
app.use("/auth", auth);
app.use("/users", users);
app.use("/reviews", reviews);



// Error handler
app.use(errorHandler);





/* 
app.get("/", function (req, res) {
    res.render("index.html") //<== here, we are rendering "index.html" every time we get a "get" request for the base route. 
    res.end();
});
*/



const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode in ${PORT}`.yellow.bold)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => { process.exit(1) });
})

















