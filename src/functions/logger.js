const { bold, magenta, greenBright, blueBright, underline, yellowBright, redBright } = require("colorette");

const timeGen = () => {
    let date = new Date();
    return magenta(`[${date.getHours().toString().padStart(2, "0")}` + `:${date.getMinutes().toString().padStart(2, "0")}` + `:${date.getSeconds().toString().padStart(2, "0")}] `);
};

module.exports = {
    success: msg => {
        console.log(timeGen() + greenBright(msg));
    },
    info: msg => {
        console.log(timeGen() + blueBright(msg));
    },
    infoHeader: msg => {
        console.log(timeGen() + bold(underline(blueBright(msg))));
    },
    debug: msg => {
        console.log(timeGen() + yellowBright(msg));
    },
    error: msg => {
        console.log(timeGen() + redBright(msg));
    }
};
