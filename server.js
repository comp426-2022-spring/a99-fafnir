// Required external modules
var express = require("express")
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const cors = require('cors');
var bodyParser = require('body-parser')
require("dotenv").config();
const { auth } = require('express-openid-connect'); //test

// Require additional files
const sleepScore = require("./sleepscore.js");
const user_log = require('./user_log.js')
const db = require('./database.js').user_db;
const authRouter = require("./auth");

// Set port
const port = 8000

// Initialize app
const app = express()

// Body-parser Configuration
app.use(express.json());
app.use(express.urlencoded());
//app.use(cors());
app.use(cors({origin: '*'}));

//Session Configuration
const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
  };

  if (app.get("env") === "production") {
    // Serve secure cookies, requires HTTPS
    session.cookie.secure = true;
  }


  // Passport Configuration
const strategy = new Auth0Strategy(
    {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        // Access token authorizes user, extraParams.id_token has JSON web token, profile has info from user
        return done(null, profile);
    }
  );

// App Configuration

// app.set("public", path.join(__dirname, "public"));
// app.set("view engine", "pug");
// app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Creating custom middleware with Express
app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

//Router mounting
app.use("/", authRouter);

app.post('/nameandage/', function (req, res) {
    const stmt = db.prepare("SELECT name, age FROM userinfo WHERE username = ?");
    console.log(stmt.get(req.body.userName));
    const user = stmt.get(req.body.userName)
    res.status(200).json({"name":user.name, "age":user.age});
})

// Serve static HTML page
app.use(express.static('./public'));

// Endpoint which adds add_sleep data into database and returns a JSON status message
app.post('/sleep', function (req, res, next) {
    //res.send('Add sleep page.');
    //res.sendFile(__dirname + './html/add_sleep.html');
    console.log(req.body)
    const stmt = db.prepare('INSERT INTO userinfo (id, username, password, name, age, meal_start_time, meal_end_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(null, "username1", "password1", "jakeTest", 20, req.body.meal_start_time, req.body.meal_end_time, req.body.wake_up_time, req.body.bedtime);
    res.status(200).json({"status":"working"})
})

app.post('/profile/create/', function (req, res) {
    const stmt = db.prepare('INSERT INTO userinfo (id, username, password, name, age, meal_start_time, meal_end_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    //const info = stmt.run(null, "username1", "password1", "jakeTest", 20, req.body.meal_start_time, req.body.meal_end_time, req.body.wake_up_time, req.body.bedtime);
    const info = stmt.run(null, req.body.userName, req.body.passWord, req.body.name, req.body.age, null, null, null, null);
    res.status(200).json({"status":"working"})
})

// Endpoint that retrieves user data and returns a sleep score
app.post('/sleep/score/', function (req, res) {
    const stmt = db.prepare("SELECT age, meal_start_time, meal_end_time, wake_up_time, bedtime FROM userinfo WHERE username LIKE '" + req.body.userName + "' AND password LIKE '" + req.body.passWord + "' AND id = 1").all();
    const score = sleepScore(stmt.age, stmt.bedtime, stmt.wake_up_time, stmt.meal_start_time, stmt.meal_end_time);
    res.status(200).json({"score":score});
})

// Endpoint that returns a 404 if endpoint does not exist
app.use(function(req, res){
    res.statusCode = 404;
    res.status(404).send("404 NOT FOUND")
});

// Serves app on selected port
const server = app.listen(port, () => {
    console.log("App listening on port " + port)
})