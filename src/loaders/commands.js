const readdir = require("fs").readdirSync;

module.exports = async (client) => {
    client.logger.infoHeader("Starting to load commands");

    let categories = readdir("./src/commands/");
    categories.forEach(cat=>{
        client.logger.infoHeader(`Starting to load ${cat} commands`);

        let cmdFiles = readdir(`./src/commands/${cat}`);
        cmdFiles.forEach(f => {
            if (!f.endsWith(".js")) return;
            client.logger.info(`Loading command ${f.split(" ")[0]}`);
            try {
                let props = require(`../commands/${cat}/${f}`);
                props.data.category = cat;
                if(props.data.disabled) client.logger.error("Command is disabled");
                client.commands.set(props.data.name, props);
                props.data.aliases.forEach(a=>{
                    client.aliases.set(a, props.data.name);
                });
            } catch (e) {
                client.logger.error(`Failed to load command ${f.split(" ")[0]}\n${e.stack}`);
            }
        });
    });

    client.logger.success("Succesfully loaded commands");
};