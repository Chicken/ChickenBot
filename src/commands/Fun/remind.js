const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    client.reminders.ensure(message.author.id, { num: 1 });

    if (!args[0]) {
        return message.channel.send("Provide me some arguments.");
    }
    if (args[0] === "list") {
        const txt =
            Object.entries(client.reminders.get(message.author.id))
                .filter((r) => r[0] !== "num")
                .map(
                    (r) =>
                        `**${r[0]}.** <t:${client.toUnix(
                            new Date(r[1].time + r[1].created)
                        )}> (<t:${client.toUnix(new Date(r[1].time + r[1].created))}:R>) - ${
                            r[1].note
                        }`
                )
                .join("\n") || "You have no reminders!";

        const embed = new Discord.MessageEmbed()
            .setTitle("Reminders")
            .setColor("e36fed")
            .setTimestamp()
            .setDescription(txt);
        return message.channel.send({ embeds: [embed] });
    }
    if (["delete", "cancel", "remove"].includes(args[0])) {
        args.shift();
        const num = parseInt(args[0], 10);
        if (!num || !client.reminders.get(message.author.id, num)) {
            return message.channel.send("Not a valid id.");
        }
        client.reminders.delete(message.author.id, num);
        client.clearTimeout(client.remindtimers[`${message.author.id}-${num}`]);
        delete client.remindtimers[`${message.author.id}-${num}`];
        return message.channel.send(`Removed reminder with id of \`${num}\``);
    }
    let repeat = false;
    if (args[0] === "repeat") {
        repeat = true;
        args.shift();
    }

    const time = client.parseTime(args[0]);
    if (!time || time < 15000 || time > 2073600000) {
        return message.channel.send(
            "Please give a time in range from 15 seconds to 24 days. Or use a valid subcommand."
        );
    }

    args.shift();
    const note = args.join(" ") || "No note provided.";

    const num = client.reminders.get(message.author.id, "num");
    client.reminders.inc(message.author.id, "num");

    client.reminders.set(
        message.author.id,
        {
            user: message.author.id,
            channel: message.channel.id,
            time,
            note,
            created: Date.now(),
            num,
            repeat,
        },
        num
    );

    client.remindtimers[`${message.author.id}-${num}`] = setTimeout(async () => {
        const reminder = client.reminders.get(message.author.id, num);
        delete client.remindtimers[`${reminder.user}-${reminder.num}`];

        const embed = new Discord.MessageEmbed()
            .setTitle("Reminder")
            .setDescription(reminder.note)
            .setColor("e36fed")
            .setTimestamp(reminder.created)
            .setFooter("Set on ");

        const ch = await client.channels.fetch(reminder.channel);
        const u = await client.users.fetch(reminder.user);

        try {
            if (ch) {
                ch.send({ content: u.toString(), embeds: [embed] });
            } else {
                u.send({ embeds: [embed] });
            }
        } catch (e) {
            client.logger.error(e);
        }

        client.reminders.delete(reminder.user, reminder.num);
    }, time);

    message.channel.send(`Set reminder for \`${note}\` <t:${client.toUnix(Date.now() + time)}:R>.`);
};

exports.data = {
    permissions: 281600n,
    guildOnly: false,
    aliases: ["remind-me", "reminder", "notif", "notif-me"],
    name: "remind",
    desc: "Reminds you about something after some time",
    usage: "remind <<time> | (delete/cancel/remove) | list> <reminder | id>",
    perm: 0,
};
