var data = require("./data").days.five

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
var map = Array(1000).fill(0).map(x => Array(1000).fill(0))

function part(isPartOne) {
    let finalResult = 0
    data.split("\n").forEach(line => {
        let coords = line.split(" -> ")
        let firstCoords = coords[0].split(",").map(x => Number(x))
        let finalCoords = coords[1].split(",").map(x => Number(x))
        finalResult += fillLine(firstCoords, finalCoords, isPartOne)
    });
    return finalResult
}
// Returns 5585 if isPartOne is true, else 17193

/**
 * Draws the line on the map
 * @param {Number[]} start The starting point of the line, in format [(int) x, (int) y]
 * @param {Number[]} end The end point of the line, [(int) x, (int) y]
 * @param {Boolean} one Only uses vertical or horizontal lines
 * @returns {Number} Quantity of points with 2 or more lines intersecting (int)
 */
function fillLine(start, end, one) {
    let returnResult = 0
    let x1 = start[0]
    let y1 = start[1]
    let x2 = end[0]
    let y2 = end[1]

    // Checks if the lines are only vertical, only horizontal or one is true
    if ((x1 == x2 || y1 == y2) || !one) {
       

        while (x1 != x2 || y1 != y2) {
            map[y1][x1] += 1
            if (map[y1][x1] == 2) {
                returnResult++
            }

            // Clamping the values so they only increase/decrease by one in the direction of the end point
            x1 += clamp(x2 - x1, -1, 1)
            y1 += clamp(y2 - y1, -1, 1)
        }

        // The start point isn't added by the while loop
        if (x1 == x2 && y1 == y2) {
            map[y1][x1] += 1
            if (map[y1][x1] == 2) {
                returnResult++
            }
        }
    }
    return returnResult
}
