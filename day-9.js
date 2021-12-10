var data = require("./data").days.nine

data = data.split("\n").map(x => x.split("").map(y => Number(y)))

function part1() {
    let result = 0
    data.forEach((line, lineIndex) => {
        line.forEach((char, index) => {
            //Gets every surrounding number
            let above = 99
            let below = 99
            if (data[lineIndex - 1] != undefined) {
                above = data[lineIndex - 1][index]
            }
            if (data[lineIndex + 1] != undefined) {
                below = data[lineIndex + 1][index]
            }
            let right = line[index - 1] ?? 99
            let left = line[index + 1] ?? 99

            //Checks if the current number is inferior to every surrounding number
            if (char < right && char < left && char < above && char < below) {
                result += (1 + char)
            }
        });
    });
    return result
}
//Returns 417

// /!\ SOME OF THE MOST OBFUSCATED AND UNOPTIMIZED CODE I HAVE EVER WRITTEN, I'M TOO TIRED TO FIX THIS
function part2() {
    let bassins = []
    let lastBassin = 1


    data.forEach((line, lineIndex) => {
        line.forEach((char, index) => {
            //Checking every surrounding number (except the one to the right, since it executes from left to right)
            if (char != 9) {
                if (bassins[index - 1 + lineIndex * data[0].length] != undefined && bassins[index - 1 + lineIndex * data[0].length].bassinNo != 0 && index != 0) {
                    bassins.push({
                        value: char,
                        bassinNo: bassins[index - 1 + lineIndex * data[0].length].bassinNo,
                        coords: [index, lineIndex]
                    })
                } else if (bassins[index + (lineIndex - 1) * data[0].length] != undefined && bassins[index + (lineIndex - 1) * data[0].length].bassinNo != 0) {
                    bassins.push({
                        value: char,
                        bassinNo :bassins[index + (lineIndex - 1) * data[0].length].bassinNo,
                        coords: [index, lineIndex]
                    })
                } else if (bassins[index + (lineIndex + 1) * data[0].length] != undefined && bassins[index + (lineIndex + 1) * data[0].length].bassinNo != 0) {
                    bassins.push({
                        value: char,
                        bassinNo: bassins[index + (lineIndex + 1) * data[0].length].bassinNo,
                        coords: [index, lineIndex]
                    })
                //This means none of the surrounding number is in a bassin, so it creates a new one
                } else {
                    lastBassin = lastBassin + 1
                    bassins.push({
                        value: char,
                        bassinNo: lastBassin,
                        coords: [index, lineIndex]
                    })
                }
            //This means it's a 9, so they are stored in a bassin named 0
            } else {
                bassins.push({
                    value: char,
                    bassinNo: 0,
                    coords: [index, lineIndex]
                })
            }
        });
    });

    //Grouping bassins that missed each other
    bassins.forEach(element => {
        if (bassins[(element.coords[1] - 1) * data[0].length] != undefined) {
            let bassinToChange = {...bassins[(element.coords[1] - 1) * data[0].length + element.coords[0]]}
            if (bassinToChange.bassinNo != element.bassinNo && element.bassinNo != 0 && bassinToChange.bassinNo != 0) {
                bassins.forEach(temp => {
                    if (temp.bassinNo == bassinToChange.bassinNo) {
                        temp.bassinNo = element.bassinNo
                    }
                });
            }
        }
    });

    //Grouping the numbers by bassins
    let count = []
    for (let index = 1; index <= lastBassin; index++) {
        let nmbr = bassins.reduce((counter, obj) => obj.bassinNo === index ? counter += 1 : counter, 0)
        if (nmbr > 0) {
            count.push(nmbr)
        }
    }

    //Sorting the bassins
    count.sort((a, b) => {
        return b - a
    })

    return count[0] * count[1] * count[2]
}
//Returns 1148965