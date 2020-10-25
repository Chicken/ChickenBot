// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let { loop } = client.m.ensure(message.guild.id);
    client.music.set(message.guild.id, !loop, "loop");
    message.channel.send("Looping status is now " + ((!loop) ? "**on**" : "**off**") + ".");
};
  
exports.data = {
    permissions: 36702208,
    guildOnly: true,
    aliases: ["luup", "lööp"],
    name: "loop",
    desc: "Makes the queue loop",
    usage: "loop",
    perm: 0
};