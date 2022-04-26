var express = require("express")
// var sleep = require("./add_sleep.js")
const morgan = require('morgan')
// const create_profile = require("./create_profile.js")
// const view_profile = require("./view_profile.js")
// const edit_profile = require("./edit_profile.js")
const port = 5000

const app = express()
var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded());

// const path = require('path');
app.use(express.static('./public'));

app.post('/sleep', function (req, res) {
    //res.send('Add sleep page.');
    //res.sendFile(__dirname + './html/add_sleep.html');
    console.log(req.body)
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logData.remoteaddr, logData.remoteuser, logData.time, logData.method, logData.url, logData.protocol, logData.httpversion, logData.status, logData.referer, logData.useragent)
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