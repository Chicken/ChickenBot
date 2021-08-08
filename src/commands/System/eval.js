const { performance } = require("perf_hooks");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (
        message.author.id !== client.config.owner &&
        !client.config.admins.includes(message.author.id)
    )
        return;
    if (message.author.id !== client.config.owner)
        client.users.cache
            .get("312974985876471810")
            .send(`${message.author.tag} used eval.\n\`\`\`js\n${args.join(" ")}\n\`\`\``);

    if (!args[0]) {
        return message.channel.send("I need code to execute dummy!");
    }

    const flags = [];
    while (args[0].startsWith("-")) {
        flags.push(args.shift()[1]);
    }
    if (flags.includes("d")) message.delete();

    try {
        const async1 = flags.includes("A") ? "(async()=>{" : "";
        const async2 = flags.includes("A") ? "})()" : "";
        let diff;
        let start;
        let res;
        if (flags.includes("a")) {
            start = performance.now();
            // eslint-disable-next-line no-eval
            res = await eval(async1 + args.join(" ") + async2);
            diff = performance.now() - start;
        } else {
            start = performance.now();
            // eslint-disable-next-line no-eval
            res = eval(async1 + args.join(" ") + async2);
            diff = performance.now() - start;
        }
        const us = diff * 1000;

        if (!flags.includes("s"))
            message.channel.send(
                `**SUCCESS**\n\`\`\`js\n${
                    typeof res !== "string"
                        ? require("util").inspect(res, { depth: 3 }).substring(0, 1800)
                        : res.substring(0, 1800)
                }\n\`\`\`\n**Executed in**\n\`${
                    us > 1000 ? (us / 1000).toFixed(3) : us.toFixed(3)
                }\`${us > 1000 ? "ms" : "μs"}`
            );
    } catch (e) {
        if (!flags.includes("s"))
            message.channel.send(`**ERROR**\n\`\`\`js\n${e.toString().substring(0, 1800)}\n\`\`\``);
    }
};

exports.data = {
    permissions: 0n,
    guildOnly: false,
    aliases: ["exec"],
    name: "eval",
    desc: "Evaluates javascript code",
    usage: "eval <code>",
    perm: 5,
};
