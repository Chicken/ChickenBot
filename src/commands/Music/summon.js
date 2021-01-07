// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (message.member?.voice?.channel == undefined) return message.channel.send("You are not in a voice channel.");
    const player = client.lavalink.players.get(message.guild.id);
    if (!player) return message.channel.send("I am not playing anything.");
    // player.switchChannel(message.member.voice.channel.id);
    client.music.set(message.guild.id, message.channel.id, "textChannel");
    message.channel.send(`Playing in ${message.member.voice.channel.toString()} and bound to ${message.channel.toString()}.`);
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["bind"],
    name: "summon",
    desc: "~~Summon and~~ bind the bot to ~~voice and~~ text channel.",
    usage: "summon",
    perm: 0
};
