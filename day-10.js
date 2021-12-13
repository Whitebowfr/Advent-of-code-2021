var data = require("./data").days.ten


data = data.split("\n")

const closingChars = [")", "]", "}", ">"]
const openingChars = ["(", "[", "{", "<"]

function part1() {

    // Initialize the points for each closing character
    const points = [3, 57, 1197, 25137]
    
    let result = 0

    data.forEach(line => {
        let currentLineOrder = []

        // Try-catch to break the loop when an unexpected character appeared
        try {
            line.split("").forEach(char => {
                

                // Checks if the current character is a closing character
                if (closingChars.indexOf(char) > -1) {

                    // If the closing char isn't the one to close the current opened block, break the loop and add the points
                    if (currentLineOrder[currentLineOrder.length - 1] != openingChars[closingChars.indexOf(char)]) {
                        result += points[closingChars.indexOf(char)]
                        throw BreakException;
                    } else {
                        // If it closes the block, remove the block from the list
                        currentLineOrder.splice(currentLineOrder.length - 1, 1)
                    }

                } else if (openingChars.indexOf(char) > -1) {
                    // If it's an opening character, adding it to the list of current open blocks
                    currentLineOrder.push(char)
                }
            });
        } catch(e) {}
    });

    return result
}
// Returns 462693

function part2() {
    let results = []
    data.forEach(line => {
        // Same as part1, we're keeping track of the opened blocks
        let currentLineOrder = []

        try {

            line.split("").forEach(char => {
                
                if (closingChars.indexOf(char) > -1) {

                    if (currentLineOrder[currentLineOrder.length - 1] != openingChars[closingChars.indexOf(char)]) {
                        // This allows us to skip the corrupted lines
                        throw BreakException;
                    } else {
                        currentLineOrder.splice(currentLineOrder.length - 1, 1)
                    }

                } else if (openingChars.indexOf(char) > -1) {
                    currentLineOrder.push(char)
                }

            });
            // Adding the current result to the array
            results.push(getScore(currentLineOrder))
        } catch(e) {}
    });

    results = results.sort((a,b) => {
        return b - a
    })

    return getMedian(results)
}
// Returns 3094671161

/**
 * @param {Number[]} arr An array containing the numbers
 * @returns {Number} The middle number of this array
 */
function getMedian(arr) {
    // Since the arrays are always odd, we can take the middle one easily
    return arr[Math.floor(arr.length / 2)]
}

/**
 * @param {string[]} line An array containing the opened characters (must be either "(", "[", "{" or "<")
 * @returns {Number} The score of the line (int)
 */
function getScore(line) {
    // This is to get the score of each char by using their index
    const order = ["(", "[", "{", "<"]

    let result = 0

    // Since we keep track of the opened blocks, we know easily what we need to add to close them
    line.reverse().forEach(element => {
        result *= 5
        result += order.indexOf(element) + 1
    });

    return result
}