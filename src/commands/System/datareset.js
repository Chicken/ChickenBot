// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send("Do you want to get your user data reseted or remove the guild from the database. Usage is `datareset <user | guild>`");
    }
    switch(args[0]) {
    case "user":
        message.channel.send("Removing your data... (this does not apply to leveling system xp, this data will be removed upon leaving the guilds using this system)");
        client.reminders.delete(message.author.id);
        break;
    case "guild":
        if(!message.guild) {
            message.channel.send("Must be used inside a guild.");
        }
        if(client.perm(message) < 3) {
            return message.channel.send("You don't have permission to do that.");
        }
        await message.channel.send("Removing guild from database and leaving the server...");
        await client.db.delete(message.guild.id);
        await message.guild.leave();
        break;
    default:
        break;
    }

};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: ["privacyreset"],
    name: "datareset",
    desc: "Removes either user data or guild from database. Also leaves the server if guild.",
    usage: "datareset <user | guild>",
    perm: 0
};