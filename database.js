const Database = require("better-sqlite3");

// Database for user (id, username, password, name, age, wake_up_time, bedtime)
const user_db = new Database("user.db");

const stmt = user_db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='userinfo';
`);

let row = stmt.get();

if (row == undefined) {
    const sqlInit = `
        CREATE TABLE userinfo (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        name TEXT,
        age NUMBER,
        meal_start_time NUMBER,
        meal_end_time NUMBER,
        wake_up_time NUMBER,
        bedtime NUMBER
    );
    `;
    user_db.exec(sqlInit)
}

module.exports = {user_db};
