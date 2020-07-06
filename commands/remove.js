exports.execute = async (client, message, args) => {
    if(!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.")
    let songs = client.db.get(message.guild.id, "queue")
    let num = parseInt(args[0])
    if(isNaN(num) || num < 1 || num > songs.length-1) return message.channel.send("Invalid song index.")
    let removed = songs.splice(num, 1)
    client.db.set(message.guild.id, songs, "queue")
    message.channel.send(`Removed song  \`${removed[0].name}\``)
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["rem"],
    category: "music",
    name: "remove",
    desc: "Removes song from queue",
    usage: "remove",
    perm: 0
};