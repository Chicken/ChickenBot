const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);

module.exports = async (client) => {
    client.logger.infoHeader("Starting to load events");

    let evtFiles = await readdir("./src/events/");
    evtFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        try {
            client.logger.info(`Loading event ${f.split(" ")[0]}`);
            let eventName = f.split(".")[0];
            let event = require(`../events/${f}`);
            client.on(eventName, event.bind(null, client));
        } catch (e) {
            client.logger.error(`Failed to load event ${f.split(" ")[0]}\n${e}`);
        }
    });

    client.logger.success("Succesfully loaded events");
};