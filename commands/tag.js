exports.execute = async (client, message, args) => {
    let perm = client.perm(message)
    let tags = client.db.get(message.guild.id, "tags")
    if(!args[0] || !["list", "add", "remove"].concat(Object.keys(tags)).includes(args[0])) {
        return message.channel.send("Valid options are tagname, list, add, remove and all tag names.")
    }
    if(["list", "add", "remove"].includes(args[0]) && perm<1) {
        return message.channel.send("You don't have permission for that!")
    }

    switch(args[0]) {
        case "list":
            let taglist = ""
            taglist = Object.keys(tags).join(", ")
            if(taglist=="") {
                return message.channel.send("There isn't any tags on this server.")
            }
            message.channel.send("Tags on this server: " + taglist)
            break;
        case "add":
            args.shift()
            let name = args.shift()
            if(["list", "add", "remove"].includes(name)){
                return message.channel.send("This tag name is reserved for the tag commands.")
            }
            if(Object.keys(tags).includes(name)){
                return message.channel.send("This tag already exist.")
            }
            if(!args[0] && !message.attachments) {
                return message.channel.send("Must supply content for tag.")
            }
            message.channel.send(`Set tag ${name}`)
            client.db.set(message.guild.id, {content: args.join(" "), attachments: message.attachments ? message.attachments.map(a=>a.url) : []}, `tags.${name}`)
            break;
        case "remove":
            if(!Object.keys(tags).includes(args[1])){
                return message.channel.send("This tag doesnt exist.")
            }
            message.channel.send(`Removed tag ${args[1]}`)
            client.db.deleteProp(message.guild.id, `tags.${args[1]}`)
            break;
        default:
            let tag = tags[args[0]]
            let opt = {
                content: tag.content,
                files: tag.attachments
            }
            message.channel.send(opt)
            break;
    }
};
  
exports.data = {
    guildOnly: true,
    aliases: ["tags", "t"],
    category: "misc",
    name: "tag",
    desc: "Shows, sets, deletes or lists tags.",
    usage: "tag <tagname / list / (add / remove [name] [tag content])> ",
    perm: 0
};