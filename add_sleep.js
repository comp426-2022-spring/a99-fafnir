var express = require("express");
var router = express.Router();
const path = require('path');
const add_sleep_form = require("./html/add_sleep.php")

router.get('/', function (req, res) {
    //res.send('Add sleep page.');
    res.statusCode = 200;
    res.sendFile(__dirname + '/html/add_sleep.html');
    //res.next()
})
router.get('/add_sleep.php', function (req, res) {
    res.statusCode(200);
    res.send('Sleep session logged successfully.');
})

module.exports = router;

// function store_time() {
//     var start_hour = document.getElementById("start_hour").value;
// }