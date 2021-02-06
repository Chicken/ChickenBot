const { createCanvas, loadImage } = require("canvas");
const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    try{

        let name1 = args[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let name2 = args[1]?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (!args[0]) return message.channel.send("Mention someone!");
        let user = args[0].match(/^<@!?(\d+)>/)
            || message.guild.members.cache.find(m => m.user.username.match(new RegExp(name1, "ui")))
            || message.guild.members.cache.find(m => m.id.match(new RegExp(name1, "ui")))
            || message.guild.members.cache.find(m => { if (m.nickname) { return m.nickname.match(new RegExp(name1, "ui")); } });
        if (Array.isArray(user)) user = message.guild.members.cache.get(user[1]);
        if(!user) return message.channel.send("No user found.");
        user = await client.users.fetch(user.id);

        let user2;
        if(args[1]){
            user2 = args[1].match(/^<@!?(\d+)>/)
                || message.guild.members.cache.find(m => m.user.username.match(new RegExp(name2, "ui")))
                || message.guild.members.cache.find(m => m.id.match(new RegExp(name2, "ui")))
                || message.guild.members.cache.find(m => { if (m.nickname) { return m.nickname.match(new RegExp(name2, "ui")); } });
            if (Array.isArray(user2)) user2 = message.guild.members.cache.get(user2[1]);
            if(!user2) return message.channel.send("No user found.");
            user2 = await client.users.fetch(user2.id);
        } else {
            user2 = message.author;
        }

        if(user2.id === message.author.id) {
            let temp = { ...user2 };
            user2 = { ...user };
            user = { ...temp };
            user = new Discord.User(client, { ...user });
            user2 = new Discord.User(client, { ...user2 }); 
        }

        let love = Math.floor(Math.random() * 101);

        let canvas = createCanvas(512, 256);
        let ctx = canvas.getContext("2d");

        let [ image, image2 ] = await Promise.all([
            loadImage(user.displayAvatarURL({ format: "png", size: 256 })),
            loadImage(user2.displayAvatarURL({ format: "png", size: 256 }))
        ]);

        ctx.drawImage(image, 28, 28, 200, 200);
        ctx.drawImage(image2, 284, 28, 200, 200);

        let x = 224,
            y = 96,
            size = Math.round(40 / 100 * love),
            heart = await loadImage(__dirname + "/../../resources/heart.png");

        ctx.drawImage(heart, x - size, y - size, 60 + (size * 2), 60 + (size * 2));
    
        ctx.font = "30px 'Segoe UI'";
        ctx.fillStyle = "black";
        ctx.fillText(love + "%", love > 10 ? 223 : 241, 126);
        message.channel.send(new Discord.MessageAttachment(canvas.toBuffer(), "ship.png"));
    
    } catch (e) {
        console.error(e);
        message.channel.send("Something went wrong!");
    }
};
  
exports.data = {
    permissions: 34816,
    guildOnly: false,
    aliases: [],
    name: "ship",
    desc: "Calculates love percentage.",
    usage: "ship <user> [user2]",
    perm: 0
};
