// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    message.channel.send("Your level is " + client.perm(message) + " | " + client.config.perms.find(p => p.level === client.perm(message)).name);
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: [],
    name: "perm",
    desc: "What is your permission level",
    usage: "perm",
    perm: 0
};