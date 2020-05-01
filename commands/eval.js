exports.execute = async (client, message, args) => {
    if(message.author.id !== client.config.owner && !client.config.admins.includes(message.author.id)) return;
    if(message.author.id !== client.config.owner) {
        client.users.cache.get("312974985876471810").send(message.author.tag + " used eval.\n```js\n" + args.join(" ") + "\n```")
    }

    let flags = []

    while(args[0].startsWith("-")) {
        flags.push(args.shift()[1])
    }

    try{
        let res
        if(flags.includes("a")) {
            if(flags.includes("A")) {
                res = await eval("(async()=>{"+args.join(" ")+"})()");
            } else {
                res = await eval(args.join(" "));
            }
        } else {
            if(flags.includes("A")) {
                res = eval("(async()=>{"+args.join(" ")+"})()");
            } else {
                res = eval(args.join(" "));
            }
        }

        if(!flags.includes("s")) message.channel.send(`**SUCCESS**\n\`\`\`js\n${require("util").inspect(res, {depth: 3}).substring(0, 1800)}\n\`\`\``)
    } catch(e) {
        if(!flags.includes("s")) message.channel.send(`**ERROR**\n\`\`\`js\n${e}\n\`\`\``)
    }

};
  
exports.data = {
    guildOnly: false,
    aliases: ["exec"],
    category: "system",
    name: "eval",
    desc: "Evaluates javascript code",
    usage: "eval <code>",
    perm: 5
};