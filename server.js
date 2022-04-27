const sleepScore = require("./sleepscore.js");

var express = require("express")
// var sleep = require("./add_sleep.js")
const morgan = require('morgan')
// const create_profile = require("./create_profile.js")
// const view_profile = require("./view_profile.js")
// const edit_profile = require("./edit_profile.js")
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

app.post('/sleep', function (req, res) {
    //res.send('Add sleep page.');
    //res.sendFile(__dirname + './html/add_sleep.html');
    console.log(req.body)
    const stmt = db.prepare('INSERT INTO userinfo (id, username, password, name, age, meal_start_time, meal_end_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(null, "username1", "password1", "jakeTest", 20, req.body.meal_start_time, req.body.meal_end_time, req.body.wake_up_time, req.body.bedtime);
    res.status(200).json({"status":"working"})
})
// app.use('/create', create_profile);
// app.use('/view', view_profile);
// app.use('/edit', edit_profile);

    app.post('/sleep/score/', function (req, res) {
        console.log("hi");
        const stmt = db.prepare("SELECT age, meal_start_time, meal_end_time, wake_up_time, bedtime FROM userinfo WHERE username LIKE '" + req.body.userName + "' AND password LIKE '" + req.body.passWord + "' AND id = 1").all();
        const score = sleepScore(stmt.age, stmt.bedtime, stmt.wake_up_time, stmt.meal_start_time, stmt.meal_end_time);
        res.status(200).json({score});
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