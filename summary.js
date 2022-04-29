function sleepSum(sleepTime, wakeTime) {
    if (sleepTime != null && wakeTime != null) {
        var time = 0;
        if (sleepTime >= 1200) {
            time = 2400 - sleepTime;
            time = time + wakeTime;
        } else {
            time = wakeTime - sleepTime;
        }
        return time;
    } else {
        return null;
    }
}

module.exports = sleepSum