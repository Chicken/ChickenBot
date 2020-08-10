const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);
module.exports = async (client) => {
    console.log(`${client.colors.Green}Starting to load events${client.colors.Reset}`)
    const evtFiles = await readdir("./src/events/");
    evtFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        try {
            console.log(`${client.colors.Yellow}Trying to load event ${f.split(" ")[0]}${client.colors.Reset}`)
            const eventName = f.split(".")[0];
            const event = require(`../events/${f}`);
            client.on(eventName, event.bind(null, client));
        } catch (e) {
            console.error(`${client.colors.Red}Failed to load event ${f.split(" ")[0]}\n${e}${client.colors.Reset}`)
        }
    });
    console.log(`${client.colors.Green}Done.${client.colors.Reset}`)
}