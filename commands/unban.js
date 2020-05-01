exports.execute = async (client, message, args) => {
    let banned = await message.guild.fetchBans()
    let dbBan = client.db.get(message.guild.id, "banned")
    let member;
    if(args[0]) {
        member = args[0].match(/^<@!?(\d+)>/)
                || client.users.cache.find(u => u.username.match(new RegExp(args[0], 'ui')))
                || client.users.cache.find(u => u.id.match(new RegExp(args[0], 'ui')))
                || args[0];
        if(Array.isArray(member)) {
            member = member[1]
        } else if(member !== undefined) {
            member = member.id
        } else if(typeof(member)=="number") {

        }else {
            return message.channel.send('No user found.');
        }
        args.shift()
    } else {
        return message.channel.send("You must supply a user to unban!")
    }

    if(!banned.has(member)) {
        return message.channel.send("That user isn't even banned!")
    }

    let reason = args.join(" ") || "None"

    message.guild.members.unban(member, reason)
    if(dbBan.hasOwnProperty(member)) {
        client.clearTimeout(client.bantimers[`${message.guild.id}-${member}`])
        delete client.bantimers[`${message.guild.id}-${member}`]
        client.db.deleteProp(message.guild.id, `banned.${member}`)
    }
    message.channel.send(`Unbanned user \`${banned.get(member).user.tag}\` for reason \`${reason}\``)
};
  
exports.data = {
    guildOnly: true,
    aliases: [],
    category: "mod",
    name: "unban",
    desc: "Unbans a user",
    usage: "unban <user>",
    perm: 1
};