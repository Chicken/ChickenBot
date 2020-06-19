const ms = require("ms")
const Discord = require("discord.js")

exports.execute = async (client, message, args) => {

    client.db.ensure("REMINDERS", {num:1}, message.author.id)

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
        client.db.delete("REMINDERS", `${message.author.id}.${num}`)
        client.clearTimeout(client.remindtimers[`${message.author.id}-${num}`])
        delete client.remindtimers[`${message.author.id}-${num}`]
        return message.channel.send(`Removed reminder with id of \`${num}\``)
    }

    if (["modify","edit"].includes(args[0])) {
        args.shift()

        let num = parseInt(args[0])
        if(!num || !client.db.get("REMINDERS", `${message.author.id}.${num}`)) return message.channel.send("Not a valid reminder id");
        args.shift()

        if (args[0]==="time") {
            args.shift()

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
                if(time > 1209600000) {
                    return message.channel.send("Maximum reminder time is 14 days")
                }
            } else {
                return message.channel.send("Invalid time!")
            }

            client.db.set("REMINDERS", Date.now()+time, `${message.author.id}.${num}.time`)

            client.clearTimeout(client.remindtimers[`${message.author.id}-${num}`])
            delete client.remindtimers[`${message.author.id}-${num}`]

            let timeout = client.setTimeout(()=>{
                client.db.delete("REMINDERS", `${message.author.id}.${num}`)
                delete client.remindtimers[`${message.author.id}-${num}`]
                let embed = new Discord.MessageEmbed()
                .setTitle("Reminder")
                .setDescription(client.db.get("REMINDERS", `${message.author.id}.${num}.reason`))
                .setColor("LUMINOUS_VIVID_PINK")
                .setTimestamp(client.db.get("REMINDERS", `${message.author.id}.${num}.created`))
                .setFooter(`Set on `)
                message.channel.send(message.author.toString(), {embed})
            }, time)

            client.remindtimers[`${message.author.id}-${num}`] = timeout;

            return message.channel.send(`Edited reminder with id of \`${num}\` to trigger on \`${client.formatDate(new Date(Date.now()+time))}\``)

        } else if (["note", "reason"].includes(args[0])) {
            args.shift()

            let reason = "No reason provided!";
            if(args[0]) {
                reason = args.join(" ")
            }

            client.db.set("REMINDERS", reason, `${message.author.id}.${num}.reason`)

            client.clearTimeout(client.remindtimers[`${message.author.id}-${num}`])
            delete client.remindtimers[`${message.author.id}-${num}`]

            let timeout = client.setTimeout(()=>{
                client.db.delete("REMINDERS", `${message.author.id}.${num}`)
                delete client.remindtimers[`${message.author.id}-${num}`]
                let embed = new Discord.MessageEmbed()
                .setTitle("Reminder")
                .setDescription(reason)
                .setColor("LUMINOUS_VIVID_PINK")
                .setTimestamp(client.db.get("REMINDERS", `${message.author.id}.${num}.created`))
                .setFooter(`Set on `)
                message.channel.send(message.author.toString(), {embed})
            }, client.db.get("REMINDERS", `${message.author.id}.${num}.time`)-Date.now())

            client.remindtimers[`${message.author.id}-${num}`] = timeout;

            return message.channel.send(`Edited reminder with id of \`${num}\` to have note of \`"${reason}"\``)

        } else {
            return message.channel.send("Unidentified property to edit.")
        }
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
        if(time > 1209600000) {
            return message.channel.send("Maximum reminder time is 14 days")
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
        client.db.delete("REMINDERS", `${message.author.id}.${num}`)
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
    usage: "remind <<time> | delete | edit | list> <reminder | id> [time | note] [modified time | note]",
    perm: 0
};