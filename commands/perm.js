exports.execute = async (client, message, args) => {
    message.channel.send("Your level is " + client.perm(message) + " | " + client.config.perms.find(p=>p.level===client.perm(message)).name)
};
  
exports.data = {
    guildOnly: false,
    aliases: [],
    category: "misc",
    name: "perm",
    desc: "What is your permission level",
    usage: "perm",
    perm: 0
};