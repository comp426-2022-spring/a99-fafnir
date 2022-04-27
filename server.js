// Require Dependencies
var express = require("express")
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const cors = require('cors');
var bodyParser = require('body-parser')
require("dotenv").config();

// Require additional files
const sleepScore = require("./sleepscore.js");
const user_log = require('./user_log.js')
const db = require('./database.js').user_db;

// Set port
const port = 5000

// Initialize app
const app = express()

// Configure body-parser
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

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