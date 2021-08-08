const bent = require("bent");
const { MessageEmbed } = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (args[0] === "info") {
        const url = args[1];
        if (!url) return message.channel.send("Please provide antti.link url!");
        url.replace("http://", "https://");
        if (!/^https:\/\/antti\.link\/[a-z0-9]+\/?$/im.test(url))
            return message.channel.send("Please provide a valid antti.link url!");
        try {
            const {
                status,
                id,
                created,
                creator,
                url: full,
                clicks,
            } = await bent("GET", "json", 200, 404, `${url}+`)();
            if (status === 404) {
                const embed = new MessageEmbed()
                    .setTitle(url)
                    .setDescription("Not yet created.")
                    .setTimestamp();
                return message.channel.send({ embeds: [embed] });
            }
            const embed = new MessageEmbed()
                .setTitle(id)
                .setDescription(
                    `Created: ${created}\nTarget: ${full}\nClicks: ${clicks}\n${
                        creator !== undefined ? `Creator: ${creator}` : ""
                    }`
                )
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            return message.channel.send("Error occured! Please try again.");
        }
    } else {
        const full = encodeURI(args.join(" "));
        if (!full) return message.channel.send("Please provide a valid url!");

        let url;
        try {
            url = (
                await bent(
                    "POST",
                    200,
                    201,
                    "json",
                    "https://antti.link/new"
                )(null, {
                    url: full,
                })
            ).url;
        } catch (e) {
            return message.channel.send("Error occured! Please try again.");
        }
        message.channel.send(`Here's your shortened url <${url}>`);
    }
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: ["short", "shorten"],
    name: "shorturl",
    desc: "Shortens an url with antti.link",
    usage: "shorturl [-info] <url>",
    perm: 1,
};
