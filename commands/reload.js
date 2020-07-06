exports.execute = async (client, message, args) => {
    if(!args[0]) {
        return message.channel.send('Give me a command name')
    }
    args[0] = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0])) || args[0]
    if(typeof(args[0])=="object") args[0] = args[0].data.name
    message.channel.send(`Attemping to reload command ${args[0]}`)
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    client.commands.delete(args[0])
    console.log(`${client.colors.Red}Unloaded command ${args[0]}${client.colors.Reset}`)
    console.log(`${client.colors.Yellow}Trying to load command ${args[0]}${client.colors.Reset}`)
    try {
        let props = require(`./${args[0]}.js`);
        client.commands.set(props.data.name, props)
        props.data.aliases.forEach(a=>{
            client.aliases.set(a, props.data.name)
        })
    } catch (e) {
        console.error(`${client.colors.Red}Failed to load command ${args[0]}\n${e}${client.colors.Reset}`)
    }
    console.log(`${client.colors.Green}Done.${client.colors.Reset}`)
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: [],
    category: "system",
    name: "reload",
    desc: "Reloads a command",
    usage: "reload <command>",
    perm: 4
};