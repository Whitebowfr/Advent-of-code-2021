var data = require("./data").days.seven

data = data.split(",").map(x => Number(x))

function part1() {
    // Using this instead of .sort() because it doesn't sort correctly in JS
    data = data.sort((a, b) => a - b)

    let median = getMedian(data)

    console.log(median)

    let fuelConsumed = 0
    data.forEach(crab => {
        fuelConsumed += Math.abs(crab - median)
    });

    return fuelConsumed
}
// Returns 340052, the crabs were at position 329

function part2() {

    let avg = Math.floor(getAvg(data))

    let fuelConsumed = 0
    data.forEach(crab => {
        fuelConsumed += getPartition(Math.abs(crab - avg))
    });

    return fuelConsumed
}
// Returns 92948968, all the crabs grouped at the position 466

/**
 * @param {Number[]} arr An array containing the numbers we want to know the median of (int or float)
 * @returns {Number} The median of the array
 */
function getMedian(arr) {
    if (arr % 2 == 0) {
        return (arr[Math.ceil(arr.length / 2)] + arr[Math.floor(arr.length / 2)]) / 2
    } else {
        return arr[arr.length / 2]
    }
}

/**
 * @param {Number[]} arr An array of numbers to find the average of (int or float)
 * @returns {Number} The average of the array (int or float)
 */
function getAvg(arr) {
    let sum = arr.reduce((a, b) => a += b, 0)
    return sum / arr.length
}

/**
 * Returns the total sum of the partition of a number (eg. getPartition(5) will return 15 because 1 + 2 + 3 + 4 + 5 = 15)
 * @param {Number} num (int)
 * @returns {Number} (int)
 */
function getPartition(num) {
    // Little trick I found while testing, helps a lot with optimization
    // I would have gone for a loop and memoization if I didn't find this
    return num * (num / 2 + 0.5)
}