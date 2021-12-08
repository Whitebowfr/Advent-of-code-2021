var data = require("./data").days.eight

function part1() {

    //[REGEX EXPLANATION] /\|.*/gm : matches any amount of any character following a |
    //[REGEX EXPLANATION] /\w+/gm : matches any positive number of words
    let parsedData = data.match(/\|.*/gm).map(x => {
        return x.match(/\w+/gm)
    })

    let result = 0
    let singlePatterns = [2, 3, 4, 7]

    //Simply checking each word if they have a length of 2, 3, 4 or 7
    parsedData.forEach(line => {
        line.forEach(word => {
            if (singlePatterns.indexOf(word.length) > -1) {
                result++
            }
        });
    });

    return result
}
//Returns 381

function part2() {
    let parsedData = data.split("\n")
    let totalResult = 0

    parsedData.forEach(line => {

        //Creating the object to hold all the numbers
        //Using [... new Set(arr)] so there isn't any duplicates, sorting by alphabetical order for the same reason

        //[REGEX EXPLANATION] /(?:(^| ))[a-g]{2}\b/gm : matches a space or the beginning of a line followed by two characters between a and g, followed by the end of the word.
        let modifiedLetters = {
            one: properlyFormatCableNumber(line.match(/(?:(^| ))[a-g]{2}\b/gm)[0]),
            four: properlyFormatCableNumber(line.match(/(?:(^| ))[a-g]{4}\b/gm)[0]),
            seven: properlyFormatCableNumber(line.match(/(?:(^| ))[a-g]{3}\b/gm)[0]),
            eight: properlyFormatCableNumber(line.match(/(?:(^| ))[a-g]{7}\b/gm)[0]),
            sixZeroNine: [...new Set(line.match(/(?:(^| ))[a-g]{6}\b/gm).map(x => properlyFormatCableNumber(x)))],
            twoThreeFive: [... new Set(line.match(/(?:(^| ))[a-g]{5}\b/gm).map(x => properlyFormatCableNumber(x)))]
        }

        //Gets the first cable using the 7 and the 1
        //[REGEX EXPLANATION] /(?!f|g).{1}/gm : matches something that's not a f nor a g, followed by any character once
        let oneFilter = new RegExp(`(?!${modifiedLetters.one.split("")[0]}|${modifiedLetters.one.split("")[1]}).{1}`, "gm")

        //Creates a dictionnary, the keys are the "real" cable name, the values are the scrambled ones
        let letterPositions = {
            a: [...modifiedLetters.seven.matchAll(oneFilter)].map(x => x[0])[0]
        }

        //Checking every 6, 0 and 9 possibilities to find the 6 using the 7 (the only one in the three that doesn't use cable C)
        //Finds the C and F cable with it, using the 1
        modifiedLetters.sixZeroNine.forEach(number => {
            if (!areAllLettersInString(number, modifiedLetters.seven.split(""))) {
                //Number is a 6
                modifiedLetters.six = number
                let c = getLetterNotInString(number)[0]
                letterPositions.c = c
                letterPositions.f = modifiedLetters.one.replace(letterPositions.c, "")
            }
        });

        //Checking every 2, 3 and 5 possibilities
        modifiedLetters.twoThreeFive.forEach(number => {

            //Rechecking the 6, 0 and 9
            modifiedLetters.sixZeroNine.forEach(numberBis => {

                //Checking if the number is a 3 with the 7 (the only one of the 2 3 and 5 that has all the cables of the 7)
                if (areAllLettersInString(number, modifiedLetters.seven.split(""))) {

                    modifiedLetters.three = number

                    //Checking if the number is a 9, because 9 is the only one of 6, 0 and 9 that has all the cables of the 3
                    if (areAllLettersInString(numberBis, number.split(""))) {
                        modifiedLetters.nine = numberBis
                    } else {
                        
                        //Since we already have the 6 and we are sure it isn't a 9, we can safely say it's a 0
                        if (numberBis != modifiedLetters.six) {
                            //Getting the middle cable (the only one the 0 doesn't have)
                            letterPositions.d = getLetterNotInString(numberBis)[0]
                            modifiedLetters.zero = numberBis
                        }
                        
                    }
                //Since we already have the C cable, we can check if it's a 5 (the only one of 2 3 and 5 without the C cable)
                } else if (getLetterNotInString(number, numberBis.split(""), letterPositions)[0] == letterPositions.c) {
                    modifiedLetters.five = number

                //Now we can check if the number has a top cable just to be sure
                } else if (getLetterNotInString(modifiedLetters.four, number.split(""), letterPositions)[2] == letterPositions.a) {
                    modifiedLetters.two = number
                }
            });
        })

        //Since we now have the value of the current cable combination, we can calculate the output value

        //Setting the result as a string so we can concatenate it with +=
        let result = ""

        //[REGEX EXPLANATION] /\|.*/gm : matches any amount of any character following a |
        //[REGEX EXPLANATION] /\w+/gm : matches any positive number of words
        let outputValues = line.match(/\|.*/gm).map(x => {
            return x.match(/\w+/gm).map(y  => properlyFormatCableNumber(y))
        })[0]

        outputValues.forEach(str => {
            let num = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

            let keys = Object.keys(modifiedLetters).find(key => modifiedLetters[key] === str)
            result += num.indexOf(keys)
        });

        //Parsing the result as an int to prevent it from concatenating as strings
        totalResult += parseInt(result)
    });

    return totalResult
}
//Returns 1023686

/**
 * @param {string} cable A cable number constitued of [a-g]
 * @returns {string} The same number, but sorted by order and sanitized (removed the spaces)
 */
function properlyFormatCableNumber(cable) {
    return cable.split("").sort().filter(x => x != " ").join("")
}

/**
 * @param {string} str The string we want to check
 * @param {string[]} arr All the letters we want to compare against the string
 * @returns {Boolean} If all the letters in the array are in the string
 */
function areAllLettersInString(str, arr) {
    let flag = true
    arr.forEach((letter) => {
        if (!str.includes(letter)) {
            flag = false
        }
    })
    getLetterNotInString("s", )
    return flag
}

/**
 * @param {string} str The string we want to compate against the array
 * @param {string[]} [letters] The array of letters
 * @param {Object} [customOrder] An object (the dictionnary) containing the "scrambled" name of a specific cable, so the output can be ordered in the "real" cable order
 * @returns {string[]} An array containing all the letters missing from the string
 */
function getLetterNotInString(str, letters = ["a", "b", "c", "d", "e", "f", "g"], customOrder) {
    if (customOrder != undefined) {
        letters.sort((a,b) => {
            return Object.values(customOrder).indexOf(a) > Object.values(customOrder).indexOf(b) ? 1 : -1
        })
    }
    let missingLetter = []
    letters.forEach(letter => {
        if (!str.includes(letter)) {
            missingLetter.push(letter)
        }
    });
    return missingLetter
}