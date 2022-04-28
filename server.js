const sleepScore = require("./sleepscore.js");

var express = require("express")
//const db = require('./database.js')
const user_log = require('./user_log.js')
const port = 5000

const db = require('./database.js').user_db;
const cors = require('cors');
const app = express()
var bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// const path = require('path');
app.use(express.static('./public'));

// Temporary adding function
app.post('/sleep/', function (req, res) {
    //res.send('Add sleep page.');
    //res.sendFile(__dirname + './html/add_sleep.html');
    const stmt = db.prepare('INSERT INTO userinfo (id, username, password, name, age, meal_start_time, meal_end_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(null, "username1", "password1", "jakeTest", 20, req.body.meal_start_time, req.body.meal_end_time, req.body.wake_up_time, req.body.bedtime);
    res.status(200).json({"status":"working"})
})

// This will change to '/sleep' when properly implemented to update meal and sleep times.
app.patch('/sleep/add/', function (req, res) {
    // db.prepare incorrect? is stmt.run necessary?
    const stmt = db.prepare(`UPDATE userinfo SET meal_start_time = ${req.body.meal_start_time}, meal_end_time = ${req.body.meal_end_time}, wake_up_time = ${req.body.wake_up_time}, bedtime = ${req.body.bedtime} WHERE username LIKE '${req.body.userName}' AND password LIKE '${req.body.passWord}'`);
    const info = stmt.run();
    res.status(200);
})

app.post('/view/', function (req, res) {
    const stmt = db.prepare("SELECT * FROM userinfo").all();
    console.log(stmt);
    res.status(200).json({"status":"working"}); 
})

app.post('/nameandage/', function (req, res) {
    const stmt = db.prepare("SELECT name, age FROM userinfo WHERE username LIKE '" + req.body.userName + "' AND password LIKE '" + req.body.passWord + "'").all();
    console.log(stmt.name);
    console.log(stmt.age);
    res.status(200).json({"name":stmt.name, "age":stmt.age});
})

// app.use('/create', create_profile);
// app.use('/view', view_profile);
// app.use('/edit', edit_profile);

app.post('/profile/create/', function (req, res) {
    const stmt = db.prepare('INSERT INTO userinfo (id, username, password, name, age, meal_start_time, meal_end_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(null, req.body.userName, req.body.passWord, req.body.name, req.body.age, null, null, null, null);
    res.status(200).json({"status":"working"})
})

app.post('/sleep/score/', function (req, res) {
    const stmt = db.prepare("SELECT age, meal_start_time, meal_end_time, wake_up_time, bedtime FROM userinfo WHERE username LIKE '" + req.body.userName + "' AND password LIKE '" + req.body.passWord + "'").all();
    const score = sleepScore(stmt.age, stmt.bedtime, stmt.wake_up_time, stmt.meal_start_time, stmt.meal_end_time);
    res.status(200).json({"score":score});
})
// app.get('/', (req, res) => {
//     res.statusCode = 200;
//     //res.send("Homepage.");
// })

app.use(function(req, res){
    res.statusCode = 404;
    res.status(404).send("404 NOT FOUND")
});

const server = app.listen(port, () => {
    console.log("App listening on port 5000")
})