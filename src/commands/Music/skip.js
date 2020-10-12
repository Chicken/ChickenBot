// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!client.lavalink.players.get(message.guild.id)) return message.channel.send("I am not playing anything.");
    if (message.guild.me?.voice?.channel !== message.member?.voice?.channel) return message.channel.send("You are not in the same voice channel as me.");
    let { queue, np } = client.music.get(message.guild.id);
    let num = args[0] ? parseInt(args[0]) : 1;
    if (isNaN(num) || num < 1 || num > queue.length + 1) return message.channel.send("Invalid amount");
    client.m.skip(message.guild.id, num);
    message.channel.send(`Skipping ${num > 1 ? `${num} songs` : "`" + np.name + "`"}...`);
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["s"],
    name: "skip",
    desc: "Skips current song",
    usage: "skip",
    perm: 0
};