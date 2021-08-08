// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const { announcePlaying } = client.m.ensure(message.guild.id);
    client.music.set(message.guild.id, !announcePlaying, "announcePlaying");
    message.channel.send(`Announcing status is now ${!announcePlaying ? "**on**" : "**off**"}.`);
};

exports.data = {
    permissions: 36718592n,
    guildOnly: true,
    aliases: [],
    name: "announce",
    desc: "Toggles if to announce now playing songs",
    usage: "announce",
    perm: 0,
};
