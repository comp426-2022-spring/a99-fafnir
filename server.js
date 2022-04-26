var express = require("express")
const db = require('./database.js')
const user_log = require('./user_log.js')
const port = 5000

const app = express()
var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded());

// const path = require('path');
app.use(express.static('./public'));

app.post('/sleep', function (req, res, next) {
    //res.send('Add sleep page.');
    //res.sendFile(__dirname + './html/add_sleep.html');
    console.log(req.body)
    const data = req.body;
    // const stmt = user_log.prepare('INSERT INTO userlog (date, first_meal_time, last_meal_time, wake_up_time, bedtime) VALUES (?, ?, ?, ?, ?)');
    // const info = stmt.run(data.date, data.first_meal_time, data.last_meal_time, data.wake_up_time, data.bedtime);
    // next();
    res.status(200).json({"status":"working"})
})
// app.use('/create', create_profile);
// app.use('/view', view_profile);
// app.use('/edit', edit_profile);

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