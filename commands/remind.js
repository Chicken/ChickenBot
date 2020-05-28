const ms = require("ms")
const Discord = require("discord.js")

exports.execute = async (client, message, args) => {

    client.db.ensure("REMINDERS", {num:0}, message.author.id)

    if (args[0]==="list") {

        let txt = Object.entries(client.db.get("REMINDERS", message.author.id)).filter(r=>r[0]!="num").map(r=>`\`${r[0]}\` | \`${client.formatDate(new Date(r[1].time))}\`  |  \`${r[1].reason}\``).join("\n") || "You have no reminders!"

        let embed = new Discord.MessageEmbed()
        .setTitle("Reminders")
        .setColor("LUMINOUS_VIVID_PINK")
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`)
        .setDescription(txt)
        return message.channel.send(embed)
    }

    if(["remove", "delete", "cancel"].includes(args[0])) {
        args.shift()
        let num = parseInt(args[0])
        if(!num || !client.db.get("REMINDERS", `${message.author.id}.${num}`)) return message.channel.send("Not a valid reminder id");
        client.db.deleteProp("REMINDERS", `${message.author.id}.${num}`)
        client.clearTimeout(client.remindtimers[`${message.author.id}-${num}`])
        delete client.remindtimers[`${message.author.id}-${num}`]
        return message.channel.send(`Removed reminder with id of \`${num}\``)
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

    let num = client.db.get("REMINDERS", `${message.author.id}.num`);

    let timeout = client.setTimeout(()=>{
        client.db.deleteProp("REMINDERS", `${message.author.id}.${num}`)
        delete client.remindtimers[`${message.author.id}-${num}`]
        let embed = new Discord.MessageEmbed()
        .setTitle("Reminder")
        .setDescription(reason)
        .setColor("LUMINOUS_VIVID_PINK")
        .setTimestamp(message.createdTimestamp)
        .setFooter(`Set on `)
        message.channel.send(message.author.toString(), {embed})
    }, time)

    message.channel.send(`Set reminder on ${client.formatDate(new Date(Date.now()+time))} for "${reason}"`)

    client.remindtimers[`${message.author.id}-${num}`] = timeout;
    client.db.set("REMINDERS", {created: message.createdTimestamp, channel: message.channel.id, reason: reason, user: message.author.id, time: Date.now()+time}, `${message.author.id}.${num}`)
    client.db.inc("REMINDERS", `${message.author.id}.num`)
};
  
exports.data = {
    guildOnly: false,
    aliases: ["remind-me", "reminder", "notif", "notif-me"],
    category: "fun",
    name: "remind",
    desc: "Reminds you about something after some time",
    usage: "remind <<time> | list | delete> [reminder]",
    perm: 0
};