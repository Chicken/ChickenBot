const ms = require("ms")
exports.execute = async (client, message, args) => {
    let member;
    if(args[0]) {
        member = args[0].match(/^<@!?(\d+)>/)
                    || message.guild.members.cache.find(m => m.user.username.match(new RegExp(args[0], 'ui')))
                    || message.guild.members.cache.find(m => m.id.match(new RegExp(args[0], 'ui')))
                    || message.guild.members.cache.find(m => {if(m.nickname) {return m.nickname.match(new RegExp(args[0], 'ui'))}});
        if(Array.isArray(member)) member = message.guild.members.cache.get(member[1])
        if(!member) return message.channel.send('No user found.');
        args.shift()
    } else {
        return message.channel.send("You must supply a user to ban!")
    }

    let time;
    if(args[0]){
        time = ms(args[0])
        if(time){
            args.shift()
            if(time < 0) {
                return message.channel.send("Time can't be negative bruh!")
            }
        }
    } else {
        time = undefined;
    }
    
    let reason = args.join(" ") ? args.join(" ") : "None"
    
    message.guild.members.ban(member.id, {reason, days: 7})
    
    if(time){
        let timeout = client.setTimeout(()=>{
            client.db.deleteProp(message.guild.id, `banned.${member.id}`)
            if(!message.guild.available || message.guild.me.hasPermission("BAN_MEMBERS")) return;
            message.guild.members.unban(member.id, "Automated unban")
        }, time)
        client.bantimers[`${member.guild.id}-${member.id}`] = timeout;
        client.db.set(message.guild.id, {guild: message.guild.id, id: member.id, time: Date.now()+time}, `banned.${member.id}`)
    }

    message.channel.send(`Banned \`${member.user.tag}\` for reason \`${reason}\`${time?`\nLength of ban: ${ms(time, {long: true})}`:""}`)
};
  
exports.data = {
    guildOnly: true,
    aliases: [],
    category: "mod",
    name: "ban",
    desc: "Bans a user",
    usage: "ban <user> [time] [reason]",
    perm: 1
};