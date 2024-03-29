const Discord = require("discord.js");
const legend = require("../../resources/activities.json");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    try {
        const activity = args[0];
        let id = args[1];
        if (!id && message.member?.voice?.channel) id = message.member.voice.channel.id;

        let channel;
        try {
            channel = await client.channels.fetch(id);
        } catch {
            return message.channel.send("No valid voice channel id provided.");
        }

        if (!activity || !Object.keys(legend).includes(activity))
            return message.channel.send(
                `No valid activity provided.\nValid activities:\n${Object.keys(legend)
                    .map((name) => `\`${name}\``)
                    .join(", ")}`
            );
        if (channel.type !== "GUILD_VOICE")
            return message.channel.send("No valid voice channel id provided.");

        if (
            !channel
                .permissionsFor(message.member)
                .has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE)
        )
            return message.channel.send(
                "You don't have the create invite permission on that channel."
            );
        if (
            !channel
                .permissionsFor(message.guild.me)
                .has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE)
        )
            return message.channel.send(
                "I don't have the create invite permission on that channel."
            );

        const res = await client.api.channels(id).invites.post({
            data: {
                max_age: 604800,
                max_uses: 0,
                target_application_id: legend[activity].id,
                target_type: 2,
                temporary: false,
            },
        });
        const inv = new Discord.Invite(client, res);

        message.channel.send(`**${legend[activity].name}:** ${inv.url}`);
    } catch (e) {
        client.logger.error(e);
        message.channel.send("Something went wrong. Try again later and check permissions.");
    }
};

exports.data = {
    permissions: 18432n,
    guildOnly: true,
    aliases: ["voice", "activities"],
    name: "activity",
    desc: "Undocumented and unstable Discord voice party activities.\nMight break randomly.\nRequires invite permission.",
    usage: "activity <activity> [channelid]",
    perm: 0,
    reload: () => {
        delete require.cache[require.resolve("../../resources/activities.json")];
    },
};
