const Discord = require("discord.js")
exports.execute = async (client, message, args) => {
    let fullname = args.join(" ")
    let info;
    if(args[0]) {
        info = args[0].match(/^<@!?(\d+)>/)
                    || message.guild.members.cache.find(m => {if(m.nickname) {return m.nickname.match(new RegExp(fullname, 'ui'))}})
                    || message.guild.members.cache.find(m => m.user.username.match(new RegExp(fullname, 'ui')))
                    || message.guild.members.cache.find(m => m.id.match(new RegExp(fullname, 'ui')));
        if(Array.isArray(info)) info = message.guild.members.cache.get(info[1])
        if(!info) return message.channel.send("No user found.");
        info = await client.users.cache.get(info.id) || await client.users.fetch(info.id)
    } else {
        info = message.author
    }
 
    let member = message.guild.members.cache.get(info.id)
    let roles = '‎';
    member.roles.cache.forEach(role => {if (role.name==='@everyone') return; roles += `<@&${role.id}> `});
    let nickname = member.nickname || "No nickname"
    let status = info.presence.status === "dnd" ? "do not disturb" : info.presence.status
    let embed = new Discord.MessageEmbed()
       .setTitle(info.tag)
       .setThumbnail(info.displayAvatarURL())
       .setColor('FF00FF')
       .setDescription(info.toString())
       .addField("Nickname", nickname, true)
       .addField("Id", info.id, true)
       .addField("Status", status, true)
       .addField("Bot", (info.bot?"Yes":"No"), true)
       .addField("Join Position", (message.guild.members.cache.array().sort((m,m2)=>{return m.joinedTimestamp-m2.joinedTimestamp}).map(m=>m.id).indexOf(info.id)+1)+"/"+ message.guild.memberCount, true)
       .addField("Created", client.formatDate(info.createdAt))
       .addField("Joined", client.formatDate(member.joinedAt))
       .addField("Roles", roles)
       .setFooter(`Requested by ${message.author.tag}`)
       .setTimestamp()
    message.channel.send(embed)
};
  
exports.data = {
    guildOnly: true,
    aliases: ["info"],
    category: "misc",
    name: "user",
    desc: "Gives you info about a user.",
    usage: "user [user]",
    perm: 0
};