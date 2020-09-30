const chalk = require("chalk");

const timeGen = () => {
    let date = new Date();
    return chalk.magenta(`[${date.getHours().toString().padStart(2, "0")}`
                       + `:${date.getMinutes().toString().padStart(2, "0")}`
                       + `:${date.getSeconds().toString().padStart(2, "0")}] `);
};

module.exports = {
    success: msg => {
        console.log(timeGen() + chalk.greenBright(msg));
    },
    info: msg => {
        console.log(timeGen() + chalk.blueBright(msg));
    },
    infoHeader: msg => {
        console.log(timeGen() + chalk.bold.underline.blueBright(msg));
    },
    debug: msg => {
        console.log(timeGen() + chalk.yellowBright(msg));
    },
    error: msg => {
        console.log(timeGen() + chalk.redBright(msg));
    }
};
