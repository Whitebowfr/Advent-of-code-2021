var data = require("./data").days.eleven

class octopus {
    currentLevel = 0;
    coords = [0, 0];
    isFlashing = false;

    constructor(lvl, x, y) {
        this.currentLevel = lvl
        this.coords = [x, y]
    }
}

/**
 * @param {Number[]} coords The coordinates of the octopus (int)
 * @param {octopus[][]} matrix The map of the octopuses
 * @returns {octopus[]} An array containing the nearest octopuses
 */
function getNearestOctopuses(coords, matrix) {
    let x = coords[0],
        y = coords[1]

    return [
        matrix[y]?.[x - 1],
        matrix[y]?.[x + 1],
        matrix[y + 1]?.[x],
        matrix[y + 1]?.[x - 1],
        matrix[y + 1]?.[x + 1],
        matrix[y - 1]?.[x],
        matrix[y - 1]?.[x - 1],
        matrix[y - 1]?.[x + 1]
    ]
}

/**
 * @param {octopus} oct The octopus we want to update next
 */
function doFlash(oct) {
    if (oct != undefined) {
        if (oct.isFlashing) return;

        oct.currentLevel += 1
        if (oct.currentLevel > 9) oct.isFlashing = true

        if (oct.isFlashing) {
            getNearestOctopuses(oct.coords, data).forEach(doFlash)
        }
    }

}

/**
 * @returns {octopus[][]} A 2D array filled with the octopuses
 */
function parseData() {
    let parsed = []
    data.split("\n").map((y, coY) => {
        y.split("").map((x, coX) => {
            let oct = new octopus(Number(x), coX, coY)
            if (parsed[coY] == undefined) {
                parsed[coY] = []
            }
            parsed[coY][coX] = oct
        })
    })

    return parsed
}

data = parseData()

function part1() {

    // Transforming the map to a 1D array instead of 2D for easier forEach loops
    let allOctopuses = [].concat(...data)
    let totalFlashes = 0

    for (let step = 0; step < 100; step++) {
        // Updating every octopus
        allOctopuses.forEach(doFlash)

        // Adding the current flashes to the total
        totalFlashes += allOctopuses.reduce((t, oct) => {
            if (oct.isFlashing) {
                oct.isFlashing = false;
                oct.currentLevel = 0;

                return t + 1
            } else {
                return t
            }
        }, 0)
    }

    return totalFlashes
}
// Returns 1702

function part2() {
    let allOctopuses = [].concat(...data)
    let day = 0

    // Since we don't have a limit, using a while instead of a for loop
    while (true) {
        // Update each octopus recursively
        allOctopuses.forEach(doFlash)

        // Count the number of flashes
        let totalFlashes = allOctopuses.reduce((t, oct) => {
            if (oct.isFlashing) {
                oct.isFlashing = false;
                oct.currentLevel = 0;

                return t + 1
            } else {
                return t
            }
        }, 0)

        // Checks if all the octopuses are flashing
        if (totalFlashes == allOctopuses.length) {
            return day + 1
        }

        // Fail-safe to prevent crashing
        if (day > 999) return -1

        day++
    }
}
// Returns 251