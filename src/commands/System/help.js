const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let categories = [...new Set(client.commands.map(c => c.data.category))];

    if(!args[0]) {
        try{
            for (let cat of categories) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(cat, client.user.displayAvatarURL())
                    .setColor("LUMINOUS_VIVID_PINK");
                let txt = "";
                client.commands.filter(c=>c.data.category.toLowerCase()===cat.toLowerCase()).forEach(cmd=>{
                    if(cmd.data.name === "eval") return;
                    txt += `**${cmd.data.name}**\n${cmd.data.desc}\nUsage: \`${cmd.data.usage}\`` + "\n\n";
                });
                embed.setDescription(txt);
                message.author.send(embed);
            }
            if (message.channel.type !== "dm") message.channel.send("Commands sent in your dms!");
        }catch(e){
            message.channel.send("Something went wrong! Maybe you have dms disabled?");
        }
    } else {
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if(!cmd || cmd.data.name === "eval") {
            return message.channel.send("No command found!");
        }
        let embed = new Discord.MessageEmbed()
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
    usage: "help [command]",
    perm: 0
};