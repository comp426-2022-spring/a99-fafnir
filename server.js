var express = require("express")
var sleep = require("./add_sleep.js")
const create_profile = require("./create_profile.js")
const view_profile = require("./view_profile.js")
const edit_profile = require("./edit_profile.js")
const port = 5000

const app = express()

app.use('/sleep', sleep);
app.use('/create', create_profile);
app.use('/view', view_profile);
app.use('/edit', edit_profile);

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("Homepage.");
})

const server = app.listen(port, () => {
    console.log("App listening on port 5000")
})