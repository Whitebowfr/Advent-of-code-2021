var data = require("./data").days.six

data = data.split(",").map(x => Number(x))

function part1() {

    for (let day = 0; day < 80; day++) {

        data.forEach((fish, index) => {

            data[index] = fish - 1

            if (data[index] < 0) {
                data[index] = 6
                data.push(8)
            }
        });
    }

    return data.length
}
// Returns 386755 in 71.909ms

function part2() {

    let fishes = parseFishesAsObject()

    for (let day = 0; day < 256; day++) {

        for (const days in Object.keys(fishes)) {

            if (days - 1 != -1) {
                fishes[days - 1] = fishes[days]
            } else {

                // Since 6 and 8 are still in the loop, the new lanternfish will be moved 1 day too soon
                fishes['7'] += fishes[days]
                fishes['9'] = fishes[days]
            }
            
        }
        
    }

    // Removing the buffered lanternfish
    fishes[9] = 0

    return Object.values(fishes).reduce((a, b) => a + b, 0)
}
// Returns 1732731810807 in only 5.701ms, the method of part1 crashes after 10s because of the length of the array

/**
 * @returns {Object} The number of fishes by their number of days before the end of its cycle
 */
function parseFishesAsObject() {
    let obj = {}

    // We need to fill the object with zeros first
    for (let index = 0; index < 9; index++) obj[index] = 0
    
    data.forEach(fish => {
        obj[fish] += 1
    });

    return obj
}

console.log(part2())