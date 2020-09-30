const ms = require("ms");
const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    client.reminders.ensure(message.author.id, { num: 1 });

    if(!args[0]) {
        return message.channel.send("Provide me some arguments.");
    } else if(args[0]=="list") {
        
        let txt = Object.entries(client.reminders.get(message.author.id))
            .filter(r=>r[0]!="num")
            .map(r=>`**${r[0]} | ${client.formatDate(new Date(r[1].time+r[1].created))}** - ${r[1].note}`)
            .join("\n")
                  || "You have no reminders!";

        let embed = new Discord.MessageEmbed()
            .setTitle("Reminders")
            .setColor("e36fed")
            .setTimestamp()
            .setDescription(txt);
        return message.channel.send(embed);
    } else if(["delete", "cancel", "remove"].includes(args[0])) {
        args.shift();
        let num = parseInt(args[0]);
        if(!num || !client.reminders.get(message.author.id, num)) {
            return message.channel.send("Not a valid id.");
        }
        client.reminders.delete(message.author.id, num);
        client.clearTimeout(client.remindtimers[`${message.author.id}-${num}`]);
        delete client.remindtimers[`${message.author.id}-${num}`];
        return message.channel.send(`Removed reminder with id of \`${num}\``);
    } else {
        let time = ms(args[0]);
        if(!time || time < 60000 || time > 1209600000) {
            return message.channel.send("Please give a time in range from 1 minute to 14 days.");
        }

        args.shift();
        let note = args.join(" ") || "No note provided.";

        let num = client.reminders.get(message.author.id, "num");
        client.reminders.inc(message.author.id, "num");

        client.reminders.set(message.author.id, { user: message.author.id, channel: message.channel.id, time, note, created: Date.now(), num }, num);

        client.remindtimers[`${message.author.id}-${num}`] = client.setTimeout(async () => {
            let reminder = client.reminders.get(message.author.id, num);
            delete client.remindtimers[`${reminder.user}-${reminder.num}`];

            const embed = new Discord.MessageEmbed()
                .setTitle("Reminder")
                .setDescription(reminder.note)
                .setColor("e36fed")
                .setTimestamp(reminder.created)
                .setFooter("Set on ");

            let ch = await client.channels.fetch(reminder.channel);
            let u = await client.users.fetch(reminder.user);

            try {
                if(ch) {
                    ch.send(u.toString(), { embed });
                } else {
                    u.send(embed);
                }
            } catch(e) {
                client.logger.error(e);
            }

            client.reminders.delete(reminder.user, reminder.num);
        }, time);

        message.channel.send(`Set reminder for \`${note}\` in \`${ms(time)}\`.`);
    }
};
  
exports.data = {
    permissions: 281600,
    guildOnly: false,
    aliases: ["remind-me", "reminder", "notif", "notif-me"],
    name: "remind",
    desc: "Reminds you about something after some time",
    usage: "remind <<time> | (delete/cancel/remove) | list> <reminder | id>",
    perm: 0
};