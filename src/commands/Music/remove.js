// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    let songs = client.queues[message.guild.id];
    let num = parseInt(args[0]);
    if(isNaN(num) || num < 1 || num > songs.length-1) return message.channel.send("Invalid song index.");
    let removed = songs.splice(num, 1);
    client.queues[message.guild.id] = songs;
    message.channel.send(`Removed song  \`${removed[0].name}\``);
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["rem"],
    name: "remove",
    desc: "Removes song from queue",
    usage: "remove",
    perm: 0
};