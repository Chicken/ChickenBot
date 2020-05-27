const ms = require("ms")
const Discord = require("discord.js")
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

exports.execute = async (client, message, args) => {

    if (args[0]==="list") {

        let txt = Object.values(client.db.get("REMINDERS")).filter(r=>r.user === message.author.id).map(r=>`\`${client.formatDate(new Date(r.time))}\`  |  "${r.reason}"`).join("\n") || "You have no reminders!"

        let embed = new Discord.MessageEmbed()
        .setTitle("Reminders")
        .setColor("LUMINOUS_VIVID_PINK")
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`)
        .setDescription(txt)
        return message.channel.send(embed)
    }

    let time;
    if(!args[0]){
        return message.channel.send("You must supply a time!")
    }
    time = ms(args[0])
    if(time){
        args.shift()
        if(time < 0) {
            return message.channel.send("Time can't be negative bruh!")
        }
    } else {
        return message.channel.send("Invalid time!")
    }
    let reason = "No reason provided!";
    if(args[0]) {
        reason = args.join(" ")
    }

    let uuid = create_UUID();

    let timeout = client.setTimeout(()=>{
        client.db.deleteProp("REMINDERS", uuid)
        let embed = new Discord.MessageEmbed()
        .setTitle("Reminder")
        .setDescription(reason)
        .setColor("LUMINOUS_VIVID_PINK")
        .setTimestamp(message.createdTimestamp)
        .setFooter(`Set on `)
        message.channel.send(message.author.toString(), {embed})
    }, time)

    message.channel.send(`Set reminder on ${client.formatDate(new Date(Date.now()+time))} for "${reason}"`)

    client.remindtimers[uuid] = timeout;
    client.db.set("REMINDERS", {created: message.createdTimestamp, channel: message.channel.id, reason: reason, user: message.author.id, time: Date.now()+time}, uuid)
};
  
exports.data = {
    guildOnly: false,
    aliases: ["remind-me", "reminder", "notif", "notif-me"],
    category: "fun",
    name: "remind",
    desc: "Reminds you about something after some time",
    usage: "remind <time | list> [reminder]",
    perm: 0
};