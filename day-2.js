data = require("./data").days.two.split("\n")

function part1() {
    var position = [0, 0]
    data.forEach(instruction => {
        let parsed = instruction.match(/[A-z]+|[0-9]+/gm)
        switch (parsed[0]) {
            case "forward":
                position[0] += parseInt(parsed[1])
                break;
            case "down":
                position[1] += parseInt(parsed[1])
                break;
            case "up":
                position[1] -= parseInt(parsed[1])
                break;
        }
    });
    return position
}
//Returns [ 2011, 738 ]

function part2() {
    var position = [0, 0]
    var aim = 0
    data.forEach(instr => {
        let parsed = instr.match(/[A-z]+|[0-9]+/gm)
        switch (parsed[0]) {
            case "forward":
                position[0] += parseInt(parsed[1])
                position[1] += aim * parseInt(parsed[1])
                break;
            case "down":
                aim += parseInt(parsed[1])
                break;
            case "up":
                aim -= parseInt(parsed[1])
                break;
        }
    });
    return [position, position.reduce((a, b)=> a*b, 1)]
}
//Returns [ [ 2011, 727910 ], 1463827010 ]