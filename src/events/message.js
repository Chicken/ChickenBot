module.exports = async (client, message) => {
    if (message.author.bot) return;

    let settings;
    if(message.guild) {
        client.db.ensure(message.guild.id, client.config.defaultSettings);
        settings = client.db.get(message.guild.id).settings;

        if(settings.xp) {
            client.db.ensure(message.guild.id, {xp: 0, level: 0}, `users.${message.author.id}`);
            if(!client.cooldown.has(message.author.id)) {
                client.cooldown.add(message.author.id);
                setTimeout(() => { client.cooldown.delete(message.author.id); }, 1000 * 15);
                client.db.math(message.guild.id, "+", Math.floor(Math.random()*15+15), `users.${message.author.id}.xp`);
                let level = Math.floor(0.1 * Math.sqrt(client.db.get(message.guild.id, `users.${message.author.id}.xp`)));
                let oldlevel = client.db.get(message.guild.id, `users.${message.author.id}.level`);
                if(oldlevel < level) {
                    client.db.inc(message.guild.id, `users.${message.author.id}.level`);
                    message.channel.send(`${message.author.tag} you leveled up to level ${level}`);
                }
            }
        }
    } else {
        settings = client.config.defaultSettings.settings;
    }

    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    let perm = client.perm(message);
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return; 
    if (cmd.data.disabled) return message.channel.send("Hey! Sorry but that command is currently disabled (Probably broken!) Spam ping the dev lmao! :D");

    if (!message.guild && cmd.data.guildOnly) {
        return message.channel.send("This is a server only command. Please use it in a server.");
    }
    
    if(perm < cmd.data.perm && cmd.data.name !== "eval") {
        return message.channel.send("You do not have the required permission for this command.");
    }

    if(message.guild && !message.channel.permissionsFor(message.guild.me).has(cmd.data.permissions, true)){
        let txt = "Hey! I am missing some permissions to run this command!\nMissing permissions listed below!\n";
        message.channel.permissionsFor(message.guild.me).missing(cmd.data.permissions, true).forEach(p=>{
            txt += p.toLowerCase().replace(/_/g, " ") + ", ";
        });
        txt = `${txt.substring(0, txt.length - 2)}.`;
        return message.channel.send(txt);
    }

    cmd.execute(client, message, args);
};