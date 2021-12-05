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
//Returns 5585 if isPartOne is true, else 17193
console.log(part(false))

function fillLine(start, end, one) {
    let returnResult = 0
    let x1 = start[0]
    let y1 = start[1]
    let x2 = end[0]
    let y2 = end[1]
    if ((x1 == x2 || y1 == y2) || !one) {
        while (x1 != x2 || y1 != y2) {
            map[y1][x1] += 1
            if (map[y1][x1] == 2) {
                returnResult++
            }
            x1 += clamp(x2 - x1, -1, 1)
            y1 += clamp(y2 - y1, -1, 1)
        }
        if (x1 == x2 && y1 == y2) {
            map[y1][x1] += 1
            if (map[y1][x1] == 2) {
                returnResult++
            }
        }
    }
    return returnResult
}
