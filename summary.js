function sleepSum(sleepTime, wakeTime) {
    if (sleepTime != null && wakeTime != null) {
        return Math.abs(sleepTime - wakeTime);
    } else {
        return null;
    }
}

module.exports = sleepSum