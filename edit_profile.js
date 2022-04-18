var express = require("express");
var router = express.Router();

router.get('/', function (req, res) {
    res.send('Edit profile page.');
    // res.statusCode = 200;
    // res.sendFile(path.join(html, '/add_sleep.html'));
    // res.next()
})

module.exports = router;