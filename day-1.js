let data = require("./data.js").days.one

data = data.split("\n").map((i) => Number(i))

function part1() {
    var result = 0
    data.forEach((a, b) => {
        if (b > 0) {
            if (a > data[b - 1]) {
                result++
            }
        }
        
    });
    return result
}
// Returns 1298

function part2() {
    var result = 0
    data.forEach((a, b) => {
        if (sum(b + 1) > sum(b)) {
            result++
        }
    });
    return result
}
// Returns 1248

/**
 * @param {Number} start The start depth (int)
 * @returns {Number|0} The sum of the two measurements after the start and the start value.
 */
function sum(start) {
    if (data[start + 2] != undefined) {
        return data[start] + data[start + 1] + data[start + 2]
    } else {
        return 0
    }
}