// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(message.author.id !== client.config.owner && !client.config.admins.includes(message.author.id)) return;
    if(message.author.id !== client.config.owner) client.users.cache.get("312974985876471810").send(message.author.tag + " used eval.\n```js\n" + args.join(" ") + "\n```");

    if(!args[0]) {
        return message.channel.send("I need code to execute dummy!");
    }

    let flags = [], res, diff, start, us, async1, async2;
    while(args[0].startsWith("-")) {
        flags.push(args.shift()[1]);
    }
    if(flags.includes("S")) message.delete();

    try{
        async1 = (flags.includes("A") ? "(async()=>{" : "");
        async2 = (flags.includes("A") ? "})()" : "");
        if(flags.includes("a")) {
            start = process.hrtime();
            res = await eval(async1 + args.join(" ") + async2);
            diff = process.hrtime(start);
        } else {
            start = process.hrtime();
            res = eval(async1 + args.join(" ") + async2);
            diff = process.hrtime(start);
        }
        us = diff[0] * 1000000 + diff[1] / 1000;

        if (!flags.includes("s")) message.channel.send(`**SUCCESS**\n\`\`\`js\n${require("util").inspect(res, { depth: 3 }).substring(0, 1800)}\n\`\`\`\n**Executed in**\n\`${us > 1000 ? (us / 1000).toFixed(3) : us.toFixed(3)}\`${us > 1000 ? "ms" : "μs"}`);
    } catch(e) {
        if (!flags.includes("s")) message.channel.send(`**ERROR**\n\`\`\`js\n${e}\n\`\`\``);
    }

};
  
exports.data = {
    permissions: 0,
    guildOnly: false,
    aliases: ["exec"],
    name: "eval",
    desc: "Evaluates javascript code",
    usage: "eval <code>",
    perm: 5
};