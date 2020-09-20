
module.exports.parse = (cmd) => {
    const parts = cmd.split(" ")
    return {
        command: parts[0],
        key: parts[1],
        value: parts[2]
    }
}