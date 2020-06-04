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
        let res, diff, start, us, time, unit;

        if(flags.includes("a")) {
            if(flags.includes("A")) {
                start = process.hrtime();
                res = await eval("(async()=>{"+args.join(" ")+"})()");
                diff = process.hrtime(start);
            } else {
                start = process.hrtime();
                res = await eval(args.join(" "));
                diff = process.hrtime(start);
            }
        } else {
            if(flags.includes("A")) {
                start = process.hrtime();
                res = eval("(async()=>{"+args.join(" ")+"})()");
                diff = process.hrtime(start);
            } else {
                start = process.hrtime();
                res = eval(args.join(" "));
                diff = process.hrtime(start);
            }
        }

        us = diff[0] * 1000000 + diff[1] / 1000;


        if (us>1000) {
            unit = "ms";
            time = (us / 1000).toFixed(3); 
        } else {
            unit = "μs";
            time = us.toFixed(3);
        }

        if(!flags.includes("s")) message.channel.send(`**SUCCESS**\n\`\`\`js\n${require("util").inspect(res, {depth: 3}).substring(0, 1800)}\n\`\`\`\n**Executed in**\n\`${time}\`${unit}`)
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