// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("Define a command to toggle.");
    const cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    if (!cmd) return message.channel.send("Did not find that command.");

    let status = cmd.data.disabled ? cmd.data.disabled : false;

    client.commands.set(cmd.data.name, !status, "data.disabled");

    message.channel.send(`\`${cmd.data.name}\` is now \`${status ? "enabled" : "disabled"}\``);
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: ["togglecmd"],
    name: "toggle",
    desc: "toggles command's disabled status (current session only)",
    usage: "toggle <command>",
    perm: 5
};