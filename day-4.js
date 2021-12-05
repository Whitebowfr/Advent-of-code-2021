var ogData = require("./data").days.four
var data = {}

function parseData() {
    let pickedNumbers = ogData.split("\n\n")[0].split(",").map(x => Number(x))
    let tables = ogData.split("\n\n")
    tables.shift()
    tables = tables.map(x => x.split("\n").map(y => y.match(/[0-9]+/gm).map(z => Number(z))))
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
//Returns 58838 (final number was 73, sum of the board was 806)

function part2() {
    let finalResult = 0
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
                                data.hasWon[index] = true
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
//Returns 6256 (final number was 46, sum 136)

function checkForWin(arr) {
    let rowCheck = arr.some(row => row.every(Boolean))
    var columnCheck = false
    for (let index = 0; index < arr[0].length; index++) {
        columnCheck = arr.map(row => row[index]).every(Boolean) ? true : columnCheck
    }
    return rowCheck || columnCheck
}

function sumUnmarkedNumbers(matrix, numbers, finalPick) {
    console.log("Final number : ", finalPick)
    let result = 0
    matrix.forEach((row, index) => {
        row.forEach((bool, i) => {
            if (!bool) {
                result += numbers[index][i]
            }
        });
    });
    return result * finalPick
}