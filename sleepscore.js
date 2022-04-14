
/** Calculates sleep score
 * 
 * Function takes in age, sleep time, wake up time, 
 * time of last meal before bed, and time of first meal after waking
 * 
 * @param {number, number, number, number, number}
 * @returns {number} 
 * 
 * example: sleepScore(21, 100, 800, 2100, 830);
 * returns: 0-100 score
 * 
 */

function sleepScore(age, sleepTime, wakeTime, lastMeal, firstMeal) {
    // Calculates time asleep (using military time)
    var asleepTime;
    if (sleepTime >= 1200) {
        // Went to bed in the pm hours
        asleepTime = 2400 - sleepTime;
        asleepTime = asleepTime + wakeTime;
    } else {
        // Went to bed in the am hours
        asleepTime = wakeTime - sleepTime;
    }

    // Calculates time between last meal and sleep
    var eatToSleep;
    if (sleepTime >= 1200) {
        // Went to bed in the pm hours (assumption made that last meal was also in pm hours)
        eatToSleep = sleepTime - lastMeal;
    } else {
        // Went to bed in the am hours
        if (lastMeal >= 1200) {
            // Ate last meal in the pm hours
            eatToSleep = 2400 - lastMeal;
            eatToSleep = eatToSleep + sleepTime;
        } else {
            // Ate last meal in the am hours
            eatToSleep = sleepTime - lastMeal;
        }
    }

    // Calculate time between waking up and first meal (assumption of first meal eaten the same day that they wake up)
    var wakeToEat = firstMeal - wakeTime;

    // TODO: COMPARE AGE TO ASLEEPTIME

    // TODO: CREATE CALCULATION FOR SLEEP SCORE

    return 50; // Obviously not final, just a placeholder
}

export { sleepScore };