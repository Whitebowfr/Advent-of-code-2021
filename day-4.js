var ogData = require("./data").days.four
var data = {}

function parseData() {
    let pickedNumbers = ogData.split("\n\n")[0].split(",").map(x => Number(x))
    let tables = ogData.split("\n\n")
    tables.shift()

    // [REGEX EXPLANATION] /[0-9]+/gm : matches any positive number of consecutives characters between 0 and 9
    tables = tables.map(x => x.split("\n").map(y => y.match(/[0-9]+/gm).map(z => Number(z))))
    /**
     * @type {Object}
     * @property {Number[]} picked The array of numbers picked by the bingo system (ints)
     * @property {Number[][][]} tables An array of 2D arrays (of all the bingo tables) (ints)
     * @property {Boolean[][][]} alreadyPicked An array of 2D arrays containing which number has been picked in each table (same size as tables)
     * @property {Boolean[]} hasWon An array with the win state of each bingo table
     */
    data = {
        picked: pickedNumbers,
        tables: tables,
        alreadyPicked: Array(tables.length).fill(0).map(x => Array(tables[1].length).fill(0).map(y => Array(tables[1][1].length).fill(false))),
        hasWon: Array(tables.length).fill(false)
    }
}
parseData()

function part1() {
    let finalResult = 0
    // Using a try/catch to be able to break the loop easily
    try {

        // Parse all the tables as strings to be able to use .includes on them
        let dataBis = ogData.split("\n\n")
        dataBis.shift()

        // Loops trough each picked number
        data.picked.forEach(number => {

            // Check every bingo table
            dataBis.forEach((table, index) => {

                // Checks if the table includes the number, that's why I left dataBis as a string
                if (table.includes(number)) {

                    data.tables[index].forEach((row, rowIndex) => {
                        if (row.indexOf(number) > -1) {

                            // Switch the status of the matrix
                            data.alreadyPicked[index][rowIndex][parseInt(row.indexOf(number))] = true

                            if (checkForWin(data.alreadyPicked[index])) {

                                // Assigning finalResult now because the table won't be accessible when the loop will break
                                finalResult = sumUnmarkedNumbers(data.alreadyPicked[index], data.tables[index], number)
                                throw BreakException
                            }
                        }
                    });
                }
            });
        });
    } catch(e) {
        return finalResult
    }
}
// Returns 58838 (final number was 73, sum of the board was 806)

function part2() {
    let finalResult = 0
    // Same as for part 1 except for a few lines
    try {
        data.picked.forEach(number => {
            let dataBis = ogData.split("\n\n")
            dataBis.shift()
            dataBis.forEach((table, index) => {
                if (table.includes(number)) {
                    data.tables[index].forEach((row, rowIndex) => {
                        if (row.indexOf(number) > -1) {
                            data.alreadyPicked[index][rowIndex][parseInt(row.indexOf(number))] = true
                            if (checkForWin(data.alreadyPicked[index])) {

                                // Changes the win state of the table in the win array
                                data.hasWon[index] = true

                                // Checks if the entire win array is true (which would mean every table has won)
                                if (data.hasWon.every(Boolean)) {
                                    finalResult = sumUnmarkedNumbers(data.alreadyPicked[index], data.tables[index], number)
                                    throw BreakException
                                }
                            }
                        }
                    });
                }
            });
        });
    } catch(e) {
        return finalResult
    }
}
// Returns 6256 (final number was 46, sum 136)

/**
 * @param {Boolean[][]} arr A matrix of which number has been picked or not
 * @returns {Boolean} If the arr has won or not
 */
function checkForWin(arr) {
    // Checking for rows is pretty easy in a simple array
    let rowCheck = arr.some(row => row.every(Boolean))
    
    // Checking for columns is a bit more complicated since every number is in a different array
    var columnCheck = false
    for (let index = 0; index < arr[0].length; index++) {
        columnCheck = arr.map(row => row[index]).every(Boolean) ? true : columnCheck
    }
    
    return rowCheck || columnCheck
}

/**
 * @param {Boolean[][]} matrix A matrix with if a number has been picked or not, same size as numbers
 * @param {Number[][]} numbers A bingo table, same size as the matrix (all numbers must be int)
 * @param {Number} finalPick The last number picked (int)
 * @returns {Number} The product of the sum of all numbers and the last number picked (int)
 */
function sumUnmarkedNumbers(matrix, numbers, finalPick) {
    // Exporting the final number now since only one variable can be assigned before the BreakException
    console.log("Final number : ", finalPick)

    let result = 0
    // Looping trough the entire matrix
    matrix.forEach((row, index) => {
        row.forEach((bool, i) => {
            if (!bool) {
                result += numbers[index][i]
            }
        });
    });

    return result * finalPick
}