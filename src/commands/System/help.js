const { MessageEmbed } = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let categories = [...new Set(client.commands.map(c => c.data.category))];

    if(!args[0]) {
        let embeds = [];
        for (let cat of categories) {
            let embed = new MessageEmbed()
                .setAuthor(cat, client.user.displayAvatarURL())
                .setColor("LUMINOUS_VIVID_PINK")
                .setFooter(`Page ${categories.indexOf(cat) + 1} of ${categories.length}`);
            let txt = "";
            client.commands.filter(c => c.data.category.toLowerCase() === cat.toLowerCase()).forEach(cmd=>{
                if(cmd.data.name === "eval") return;
                txt += `**${cmd.data.name}**\n${cmd.data.desc}\nUsage: \`${cmd.data.usage}\`` + "\n\n";
            });
            embed.setDescription(txt);
            embeds.push(embed);
        }
        let end = new MessageEmbed()
            .setTitle("Expired")
            .setColor("RED")
            .setDescription("This paginated help has expired!\n"
            + "To get more permanent version of the help\n"
            + "use `help dm` to get full version in your dms!")
            .setTimestamp();
        client.paginatedEmbed(message, embeds, end);
    } else if(args[0] == "dm") {
        try {
            for (let cat of categories) {
                let embed = new MessageEmbed()
                    .setAuthor(cat, client.user.displayAvatarURL())
                    .setColor("LUMINOUS_VIVID_PINK");
                let txt = "";
                client.commands.filter(c => c.data.category.toLowerCase() === cat.toLowerCase()).forEach(cmd=>{
                    if(cmd.data.name === "eval") return;
                    txt += `**${cmd.data.name}**\n${cmd.data.desc}\nUsage: \`${cmd.data.usage}\`` + "\n\n";
                });
                embed.setDescription(txt);
                message.author.send(embed);
            }
        } catch (e) {
            return message.channel.send("Error occured! You probably don't have dms enabled.");
        }
        if (message.channel.type !== "dm") message.channel.send("Commands sent into your dms!");
    } else {
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if(!cmd || cmd.data.name === "eval") {
            let category = categories.find(cat => cat.toLowerCase() == args[0]);
            if(category) {
                let embed = new MessageEmbed()
                    .setAuthor(category, client.user.displayAvatarURL())
                    .setColor("LUMINOUS_VIVID_PINK");
                let txt = "";
                client.commands.filter(c => c.data.category.toLowerCase() === category.toLowerCase()).forEach(cmd=>{
                    if(cmd.data.name === "eval") return;
                    txt += `**${cmd.data.name}**\n${cmd.data.desc}\nUsage: \`${cmd.data.usage}\`` + "\n\n";
                });
                embed.setDescription(txt);
                return message.channel.send(embed);
            } else {
                return message.channel.send("No command or category found!");
            }
        }
        let embed = new MessageEmbed()
            .setAuthor(cmd.data.name, client.user.displayAvatarURL())
            .setColor("LUMINOUS_VIVID_PINK")
            .setDescription(`**Category:**\n${cmd.data.category}\n\n**Description:**\n${cmd.data.desc}\n\n**Usage**:\n\`${cmd.data.usage}\`\n\n**Server only:**\n\`${cmd.data.guildOnly}\`\n\n**Aliases**:\n${"`" + cmd.data.aliases.join("`, `") + "`"}\n\n**Permission level:**\n${cmd.data.perm}`);
        message.channel.send(embed);
    }
};
  
exports.data = {
    permissions: 3072,
    guildOnly: false,
    aliases: ["commands"],
    name: "help",
    desc: "Help and list of commands.",
    usage: "help [dm | command | category]",
    perm: 0
};