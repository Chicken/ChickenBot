const Discord = require("discord.js");

module.exports = async (client) => {
    let music = await require("../functions/lavalink.js")(client);
    client.reminders.keyArray().forEach(u => {
        Object.entries(client.reminders.get(u))
            .filter(e=>e[0]!=="num")
            .map(e=>e[1])
            .forEach(r => {
                let {user, time, num, created} = r;
                client.remindtimers[`${user}-${num}`] = client.setTimeout(async () => {
                    let reminder = client.reminders.get(user, num);
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
                }, (created+time)-Date.now());
            });
    });

    client.logger.success(`I am online as ${client.user.tag}`);
    client.user.setActivity(`people on ${client.guilds.cache.size} servers`, { type: "WATCHING" });
    const embed = new Discord.MessageEmbed()
        .setTitle("Bot started")
        .setColor("ffaa00")
        .setTimestamp();
    client.channels.cache.get(client.config.log).send(embed);
    if (music) {
        client.music.filter(v => v?.np?.channel).forEach((v, id) => {
            const { np, volume, textChannel } = v;
            client.m.play(np.track, {
                guild: id,
                channel: np.channel,
                volume,
                startTime: np.resume
            });
            client.music.delete(id, "np.resume");
            client.music.delete(id, "np.channel");
            let channel = client.channels.cache.get(textChannel);
            if (channel) channel.send("It looks like your session was interrupted. I've restarted where we left off.");
        });
    }
};