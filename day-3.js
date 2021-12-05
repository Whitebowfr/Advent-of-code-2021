var data = require("./data").days.three

function firstPart() {
    let gammaRate = ""
    let epsilon = ""
    for (let index = 0; index < 12; index++) {
        var regex = `(?:[0-1]){${index}}([0-1])(?:[0-1])*`
        var reg = new RegExp(regex, "gm")
        var datab = [...data.matchAll(reg)].map(x => x[1])
        let common = getOccurences(datab)
        gammaRate += common
        epsilon += Math.abs(common - 1)
    }
    return parseBinary(gammaRate) * parseBinary(epsilon)
}
//Returns 693486

function part2() {
    var dataBis = data
    for (let index = 0; index < 12; index++) {
        var regex = `(?:[0-1]){${index}}([0-1])(?:[0-1])*`
        var reg = new RegExp(regex, "gm")
        var datab = [...dataBis.matchAll(reg)].map(x => x[1])
        let leastCommon = Math.abs(getOccurences(datab) - 1)
        var datac = [...data.matchAll(reg)].map(x => x[1])
        let common = getOccurences(datac)
        let filteringRegexScrub = new RegExp(`[0-1]*(?<=^${".".repeat(index)})${leastCommon}[0-1]*`, "gm")
        let filteringRegexOxGen = new RegExp(`[0-1]*(?<=^${".".repeat(index)})${common}[0-1]*`, "gm")

        if (data.length != 12) {
            data = [...data.matchAll(filteringRegexOxGen)].map(x => x[0]).join("\n")
        }
        if (dataBis.length != 12) {
            dataBis = [...dataBis.matchAll(filteringRegexScrub)].map(x => x[0]).join("\n")
        }
    }

    return [dataBis, data, parseBinary(dataBis) * parseBinary(data)]
}
//Returns [ '111000100110', '001110100101', 3379326 ]

/**
 * @param {string} bin A binary number in the form of a string (eg. "1110010")
 * @returns {Number} The bin number in base 10 (int)
 */
function parseBinary(bin) {
    let result = 0
    bin.split("").reverse().forEach((bit, pow) => {
        result += parseInt(bit) * Math.pow(2, pow)
    });
    return result
}

/**
 * @param {String[]|Number[]} arr An array of 1 or 0
 * @returns {Number} 1 or 0, depending on the most common number in the array
 */
function getOccurences(arr) {
    //This function was quite unoptimized, it took 125ms each time, the new one only takes .3ms
    //let array = arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length)
    let sum = arr.reduce((partial_sum, a) => parseInt(partial_sum) + parseInt(a), 0)
    return sum >= arr.length / 2 ? 1 : 0
}