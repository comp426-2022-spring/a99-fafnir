var express = require("express");
let fs = require('fs')
var router = express.Router();
const path = require('path');
const add_sleep_form = require("./html/add_sleep.php")
const fetch = require('node-fetch');

router.get('/', function (req, res) {
    //res.send('Add sleep page.');
    res.statusCode = 200;
    // res.sendFile(__dirname + '/html/add_sleep.html');
    fs.readFile('./html/add_sleep.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    })
    //res.next()
})

module.exports = router;

// function store_time() {
//     var start_hour = document.getElementById("start_hour").value;
// }