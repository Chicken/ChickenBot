const readdir = require("fs").readdirSync;

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(!args[0]) {
        return message.channel.send("Give me a command name");
    }

    let command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0])) || args[0];
    let commandName = typeof command == "object" ? command.data.name : command;

    console.log(commandName);

    message.channel.send(`Attemping to reload command \`${commandName}\``);

    if(typeof command == "object") {
        delete require.cache[require.resolve(`../${command.data.category}/${commandName}.js`)];
        command.data.aliases.forEach(a => {
            client.aliases.delete(a);
        });
        client.commands.delete(commandName);
        client.logger.error(`Unloaded command ${commandName}`);
    }
    
    client.logger.info(`Loading command ${commandName}`);

    let found = false;

    try {
        let categories = readdir("./src/commands");
        categories.forEach(cat=>{
            let cmdFiles = readdir(`./src/commands/${cat}`);
            cmdFiles.forEach(f => {
                if (!f.endsWith(".js")) return;
                let props = require(`../${cat}/${f}`);
                if(props.data.name !== commandName) return;
                found = true;
                props.data.category = cat;
                if(props.data.disabled) client.logger.error("Command is disabled");
                client.commands.set(props.data.name, props);
                props.data.aliases.forEach(a=>{
                    client.aliases.set(a, props.data.name);
                });

            });
        });

    } catch (e) {
        message.channel.send("Failed");
        client.logger.error(`Failed to load command ${commandName}\n${e}`);
        return;
    }
    if(found) {
        message.channel.send("Reloaded");
        client.logger.success(`Reloaded command ${commandName}`);
    } else {
        message.channel.send("Didn't find such a command");
        client.logger.success(`Didn't find command ${commandName}`);
    }
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: [],
    name: "reload",
    desc: "Reloads a command",
    usage: "reload <command>",
    perm: 4
};