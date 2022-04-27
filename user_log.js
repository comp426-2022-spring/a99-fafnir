const Database = require("better-sqlite3");

// Database for user logs based on their id (id, date, first_meal_time, last_meal_time)
const log_db = new Database("log.db");

stmt = log_db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='userlog';
`);

row = stmt.get();

if (row == undefined) {
    const sqlInit2 = `
        CREATE TABLE userlog(
        id INTEGER PRIMARY KEY,
        date NUMBER,
        first_meal_time NUMBER,
        last_meal_time NUMBER,
        wake_up_time NUMBER,
        bedtime NUMBER )
    `
    log_db.exec(sqlInit2);
}

module.exports = {log_db};