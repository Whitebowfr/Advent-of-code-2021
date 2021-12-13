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

function getNearestOctopuses(coords, matrix) {
    let x = coords[0], y = coords[1]

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
    let allOctopuses = []
    let totalFlashes = 0
    data.map(x => x.map(y => allOctopuses.push(y)))
    for (let step = 0; step < 100; step++) {
        allOctopuses.forEach(doFlash)

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

function part2() {
    let allOctopuses = []
    let day = 0
    data.map(x => x.map(y => allOctopuses.push(y)))
        while(true) {
            allOctopuses.forEach(doFlash)

            let totalFlashes = allOctopuses.reduce((t, oct) => {
                if (oct.isFlashing) {
                    oct.isFlashing = false;
                    oct.currentLevel = 0;
    
                    return t + 1
                } else {
                    return t
                }
            }, 0)
    
            if (totalFlashes == allOctopuses.length) {
                return day + 1
            }
            day++
        }

}

console.log(part2())