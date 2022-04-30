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
const sleepSum = require("./summary.js");
const sleepBefore = require("./summary.js");
const sleepAfter = require("./summary.js");
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
    const info = stmt.run(null, req.body.userName, req.body.passWord, req.body.name, req.body.age, req.body.first_meal_time, req.body.last_meal_time, req.body.wake_up_time, req.body.bedtime);
    res.status(200).json({"status":"working"})
})

app.post('/profile/create/', function (req, res) {
    const stmt = db.prepare('INSERT INTO userinfo (id, username, password, name, age, meal_start_time, meal_end_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(null, req.body.userName, req.body.passWord, req.body.name, req.body.age, null, null, null, null);
    res.status(200).json({"status":"working"})
})

// Endpoint that retrieves user data and returns a sleep score
app.post('/sleep/score/', function (req, res) {
    const stmt = db.prepare("SELECT age, meal_start_time, meal_end_time, wake_up_time, bedtime FROM userinfo WHERE username = '" + req.body.userName + "' AND password = '" + req.body.passWord + "' ORDER BY id DESC LIMIT 1");
    const user = stmt.get();
    console.log(user);
    const score = sleepScore(user.age, user.bedtime, user.wake_up_time, user.meal_start_time, user.meal_end_time);
    res.status(200).json({"score":score});
})

app.post('/sleep/summary/', function (req, res) {
    const stmt = db.prepare("SELECT meal_start_time, meal_end_time, wake_up_time, bedtime FROM userinfo WHERE username = '" + req.body.userName + "' AND password = '" + req.body.passWord + "' ORDER BY id DESC").all();
    var json = JSON.parse(JSON.stringify(stmt))
    var i = 0;
    console.log(json);
    var sum = 0;
    var before_sum = 0;
    var after_sum = 0;
    var length = Object.keys(json).length
    var before_length = Object.keys(json).length
    var after_length = Object.keys(json).length

    while (i < Object.keys(json).length) {
        const diff = sleepSum(stmt[i].bedtime, stmt[i].wake_up_time);
        const meal_before_session = sleepBefore(stmt[i].bedtime, stmt[i].meal_start_time)
        const meal_after_session = sleepAfter(stmt[i].wake_up_time, stmt[i].meal_end_time)
        if (diff != null) {
            sum += diff;
        } else {
            length--;
        }
        if (meal_before_session != null) {
            before_sum += meal_before_session;
        } else {
            before_length--;
        }
        if (meal_after_session != null) {
            after_sum += meal_after_session;
        } else {
            after_length--;
        }
        i++;
    }
    
    var avg = sum / length;
    var avg = avg / 100

    var before_avg = before_sum / before_length
    var before_avg = before_avg / 100

    var after_avg = after_sum / after_length
    var after_avg = after_avg / 100

    res.status(200).json({"average":avg, "before":before_avg, "after":after_avg});
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