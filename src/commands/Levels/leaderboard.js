const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(!client.db.get(message.guild.id, "settings.xp")) {
        return message.channel.send("Leveling is not enabled in your server!");
    }

    let users = client.db.get(message.guild.id, "users");
    let resultsPerPage = 10;
    if(!args[0]) args[0] = 1;
    args[0] = parseInt(args[0]);
    if (isNaN(args[0]) || Math.ceil((Object.keys(users).length ? Object.keys(users).length : 1) / resultsPerPage) < args[0] || parseInt(args[0]) < 1) return message.channel.send("Not valid page number");
    
    let leaderboard = "";
    users = Object.entries(users);
    users.sort((a, b) => b[1].xp - a[1].xp);
    
    let hoisted = users.slice(resultsPerPage * args[0] - resultsPerPage, resultsPerPage * args[0]);
    hoisted.forEach((v) => leaderboard += `${users.indexOf(v) + 1}. ${client.users.cache.get(v[0]).tag} \`${v[1].xp}\`\n`);

    let embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setDescription(leaderboard)
        .setColor("BLUE")
        .setTimestamp()
        .setFooter(`Page ${args[0]} out of ${Math.ceil(users.length / resultsPerPage)}`);
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: ["lb", "top"],
    name: "leaderboard",
    desc: "Top 10 active users in your server",
    usage: "leaderboard [page]",
    perm: 0
};