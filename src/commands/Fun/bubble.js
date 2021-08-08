const bent = require("bent");
const { MessageAttachment } = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const text = args.join(" ");
    if (text.length < 1) return message.channel.send("You need to supply text for the bubble!");
    const { image } = await bent(
        "POST",
        200,
        "json"
    )(
        `https://pixelspeechbubble.com/make-bubble?text=${encodeURIComponent(
            text
        )}&animated=true&orientation=left`
    );
    message.channel.send({ files: [new MessageAttachment(`https:${image}`, "bubble.gif")] });
};

exports.data = {
    permissions: 34816n,
    guildOnly: false,
    aliases: ["speech", "speechbubble"],
    name: "bubble",
    desc: "Pixel art speech bubble. Uses pixelspeechbubble.com.",
    usage: "bubble <text>",
    perm: 0,
};
