exports.execute = async (client, message, args) => {
    if(!args[0]) {
        return message.channel.send('Give me a command name')
    }

    let command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

    if(!command) {
        return message.channel.send("No such a command");
    }

    message.channel.send(`Attemping to reload command \`${command.data.name}\``)

    delete require.cache[require.resolve(`../${command.data.category}/${command.data.name}.js`)];
    command.data.aliases.forEach(a => {
        client.aliases.delete(a);
    })
    client.commands.delete(command.data.name)
    client.logger.error(`Unloaded command ${command.data.name}`)

    client.logger.info(`Loading command ${command.data.name}`)

    try {
        let props = require(`../${command.data.category}/${command.data.name}.js`);
        props.data.category = command.data.category;
        client.commands.set(props.data.name, props)
        props.data.aliases.forEach(a=>{
            client.aliases.set(a, props.data.name)
        })
    } catch (e) {
        message.channel.send("Failed")
        client.logger.error(`Failed to load command ${args[0]}\n${e}`)
        return;
    }
    message.channel.send("Reloaded")
    client.logger.success(`Reloaded command ${args[0]}`)
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