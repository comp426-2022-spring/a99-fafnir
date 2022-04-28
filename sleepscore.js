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

// ***** ISSUE: 60 mins in an hour, I don't think calculations account for that ******
function sleepScore(age, sleepTime, wakeTime, lastMeal, firstMeal) {
    if (age == undefined || sleepTime == undefined || wakeTime == undefined || lastMeal == undefined || firstMeal == undefined) {
        return 50;
    }
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
    var eatToSleep; // 3 hours is ideal (more important the longer, not the shorter) - Leesa
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
    var wakeToEat = firstMeal - wakeTime; // Best time within two hours of waking up (ASAP) - Forbes

    // COMPARE AGE TO ASLEEPTIME
    var ageAndAsleepTime;
    if (age <= 12) {
        // 9-12 hours
        ageAndAsleepTime = Math.abs(asleepTime / 100 - 10.5);
        ageAndAsleepTime = (10 - ageAndAsleepTime) / 10;
    } else {
        if (age >= 13 && age <= 18) {
            // 8-10 hours
            ageAndAsleepTime = Math.abs(asleepTime / 100 - 9);
            ageAndAsleepTime = (10 - ageAndAsleepTime) / 10;
        } else {
            // 7-9 hours
            ageAndAsleepTime = Math.abs(asleepTime / 100 - 8);
            ageAndAsleepTime = (10 - ageAndAsleepTime) / 10;
        }
    }

    // COMPARE eatToSleep with ideal
    var idealEatToSleep = Math.abs(eatToSleep / 100 - 3);
    idealEatToSleep = (10 - idealEatToSleep) / 10;

    // COMPARE wakeToEat with ideal
    var idealWakeToEat = Math.abs(wakeToEat / 100);
    idealWakeToEat = (10 - idealWakeToEat) / 10;

    // CREATE CALCULATION FOR SLEEP SCORE
    // 50% value for ageAndAsleepTime, 25% each for the other two
    var yourSleepScore = (2 * ageAndAsleepTime + idealEatToSleep + idealWakeToEat) / 4;

    // return yourSleepScore;
    return yourSleepScore; // Place holder. Test to see if this pops up before using actual calculation
}

/* Links to information:
*   https://www.forbes.com/sites/nomanazish/2018/10/25/this-is-the-best-time-to-eat-breakfast-according-to-a-dietitian/?sh=d34423f30035
*   https://www.leesa.com/article/eating-before-bed-pros-and-cons
*   https://www.cdc.gov/sleep/about_sleep/how_much_sleep.html
*/

//export { sleepScore };
module.exports = sleepScore;