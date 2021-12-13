var data = require("./data").days.ten


data = data.split("\n")

function part1() {
    let points = [3, 57, 1197, 25137]
    let result = 0
    data.forEach(line => {
        let currentLineOrder = []
        try {
            line.split("").forEach(char => {
                let closingChars = [")", "]", "}", ">"]
                let openingChars = ["(", "[", "{", "<"]
                if (closingChars.indexOf(char) > -1) {
                    if (currentLineOrder[currentLineOrder.length - 1] != openingChars[closingChars.indexOf(char)]) {
                        result += points[closingChars.indexOf(char)]
                        throw BreakException;
                    } else {
                        currentLineOrder.splice(currentLineOrder.length - 1, 1)
                    }
                } else if (openingChars.indexOf(char) > -1) {
                    currentLineOrder.push(char)
                }
            });
        } catch(e) {
        }
        
    });

    return result
}

function part2() {
    let results = []
    data.forEach(line => {
        let currentLineOrder = []
        try {
            line.split("").forEach(char => {
                let closingChars = [")", "]", "}", ">"]
                let openingChars = ["(", "[", "{", "<"]
                if (closingChars.indexOf(char) > -1) {
                    if (currentLineOrder[currentLineOrder.length - 1] != openingChars[closingChars.indexOf(char)]) {
                        throw BreakException;
                    } else {
                        currentLineOrder.splice(currentLineOrder.length - 1, 1)
                    }
                } else if (openingChars.indexOf(char) > -1) {
                    currentLineOrder.push(char)
                }
            });
            results.push(getScore(currentLineOrder))
        } catch(e) {
        }
        
    });

    results = results.sort((a,b) => {
        return b - a
    })

    return getMedian(results)
}

function getMedian(arr) {
    return arr[Math.floor(arr.length / 2)]
}

function getScore(line) {
    let result = 0
    let order = ["(", "[", "{", "<"]
    line.reverse().forEach((element, index) => {
        result *= 5
        result += order.indexOf(element) + 1
    });
    return result
}

console.log(part2())
