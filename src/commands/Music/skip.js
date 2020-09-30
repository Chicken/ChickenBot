// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(!message.guild.me.voice?.connection?.dispatcher) return message.channel.send("I am not playing anything.");
    if(message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You are not in the same voice channel as me.");
    let songs = client.queues[message.guild.id];
    let num = parseInt(args[0]) || 1;
    if(isNaN(num) || num < 1 || num > songs.length) return message.channel.send("Invalid amount");
    let removed = songs.shift();
    client.queues[message.guild.id] = songs;
    message.guild.me.voice.connection.dispatcher.destroy();
    message.channel.send(`Skipping \`${removed.name}\`...`);
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