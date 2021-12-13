var data = require('./data').days.thirteen

// [REGEX EXPLANATION] /[0-9]+,[0-9]+/gm : Matches every string containing a number, a comma, and then another number (for example "249,2094")
let points = data.match(/[0-9]+,[0-9]+/gm)

// Parsing the points as an array of array containing the x and y coordinates
points = points.map(x => 
    x.split(",")
        .map(y => Number(y))
)

// [REGEX EXPLANATION] /(?:fold along )(.*)/gm : Matches every character after "fold along " (for example "y=109")
let reg = new RegExp("(?:fold along )(.*)", "gm")

// Parsing the instructions as an array of arrays, containing the direction and the index
let instructions = [...data.matchAll(reg)]
                        .map(x => [
                                x[1].split("=")[0], 
                                Number(x[1].split("=")[1])
                              ])

function part1() {
    // Finds the right size for the array
    let maxX = Math.max(...points.map(x => x[0])) + 1
    let maxY = Math.max(...points.map(x => x[1])) + 1

    // Creates an array full of ⬜ (using emojis so it's easier to see for part 2)
    let matrix = new Array(maxY).fill(0).map(x => new Array(maxX).fill("⬜"))

    // Filling the array with the initial points
    points.forEach(coords => {
        matrix[coords[1]][coords[0]] = "⬛"
    });

    // Concatenating the folded array to a 1D array
    let newMatrix = [].concat(...fold(matrix, [instructions[0]]))

    // Counting the number of black squares in the folded array
    return newMatrix.reduce((t, x) => {
        if (x == "⬛") {
            return t + 1
        } else {
            return t
        }
    }, 0)
}
// Returns 795


function part2() {
    let maxX = Math.max(...points.map(x => x[0])) + 1
    let maxY = Math.max(...points.map(x => x[1])) + 1
    let matrix = new Array(maxY).fill(0).map(x => new Array(maxX).fill("⬜"))

    points.forEach(coords => {
        matrix[coords[1]][coords[0]] = "⬛"
    });

    // This time we pass all the instructions, not just the first one
    let newMatrix = fold(matrix, instructions)

    // Needs a human eye for that
    console.log(newMatrix.map(x => x.join("")).join("\n"))
}
/* Returns 
⬜⬛⬛⬜⬜⬛⬛⬛⬛⬜⬜⬜⬛⬛⬜⬛⬜⬜⬛⬜⬛⬜⬜⬜⬜⬛⬜⬜⬛⬜⬜⬛⬛⬜⬜⬜⬜⬛⬛⬜
⬛⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬛⬜⬜⬛⬜⬜⬜⬜⬛⬜⬜⬛⬜⬛⬜⬜⬛⬜⬜⬜⬜⬛⬜
⬛⬜⬜⬜⬜⬛⬛⬛⬜⬜⬜⬜⬜⬛⬜⬛⬛⬜⬜⬜⬛⬜⬜⬜⬜⬛⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜⬜⬛⬜
⬛⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬛⬜⬜⬛⬜⬜⬜⬜⬛⬜⬜⬛⬜⬛⬜⬛⬛⬜⬜⬜⬜⬛⬜
⬛⬜⬜⬛⬜⬛⬜⬜⬜⬜⬛⬜⬜⬛⬜⬛⬜⬛⬜⬜⬛⬜⬜⬜⬜⬛⬜⬜⬛⬜⬛⬜⬜⬛⬜⬛⬜⬜⬛⬜
⬜⬛⬛⬜⬜⬛⬛⬛⬛⬜⬜⬛⬛⬜⬜⬛⬜⬜⬛⬜⬛⬛⬛⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛⬛⬜⬜⬛⬛⬜⬜
So the answer is CEJKLUGJ
*/

/**
 * @param {string[]} arr A 2D array full of ⬛ or ⬜
 * @param {(string|number)[]} instr An array with the folding instructions ("x" or "y" for the first element of the instruction array, int for the index)
 * @returns {string[]} A smaller array, containing the original array folded with the instructions
 */
function fold(arr, instr) {

    instr.forEach(instruction => {
        let isYfold = instruction[0] == "y"

        // Using try catch to avoid calculating the whole array each time
        try {
            arr.forEach((line, lineIndex) => {

                // Skips the rest of the array if we went below the folding line
                if (lineIndex == instruction[1] && isYfold) {
                    throw BreakException
                }

                try {
                    line.forEach((point, index) => {
                        // Skips the rest of the line if we went after
                        if (index == instruction[1] && !isYfold) {
                            throw BreakException
                        }

                        // Using abs(index - foldIndex) * 2 + index to find the mirrored point index
                        let mirrorIndex = Math.abs((isYfold ? lineIndex : index) - instruction[1]) * 2 + (isYfold ? lineIndex : index)

                        // Get the mirrored point value
                        let mirroredPoint = (isYfold ? arr[mirrorIndex][index] : line[mirrorIndex])

                        // Overwrite the current point
                        if (mirroredPoint == "⬛") {
                            arr[lineIndex][index] = "⬛"
                        }

                    });
                } catch (er) {}
                
                // Splicing the array to the right size
                if (!isYfold) arr[lineIndex].splice(instruction[1], line.length - instruction[1] + 1)

            });
        } catch (e) {}

        if (isYfold) arr.splice(instruction[1], arr.length - instruction[1] + 1)
    });

    return arr
}