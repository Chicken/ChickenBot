const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);

module.exports = async client => {
    client.logger = require("./logger");

    client.perm = message => {
        let permlvl = 0;
        let permOrder = client.config.perms.slice();
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (!message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message, client)) {
                permlvl = currentLevel.level;
                continue;
            }
        }
        return permlvl;
    };

    client.paginatedEmbed = async (message, pages, endpage = null, timeout = 150000) => {
        let page = 0;
        let controls = ["⬅️", "➡️", "❌"];
        let embedMsg = await message.channel.send(pages[page]);

        for (let e of controls) await embedMsg.react(e);

        let collector = embedMsg.createReactionCollector((reaction, user) => {
            return controls.includes(reaction.emoji.name) && user.id == message.author.id;
        }, {
            time: timeout,
            dispose: true
        });

        let changePage = reaction => {
            if(message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES")) reaction.users.remove(message.author);
            switch (reaction.emoji.name) {
            case controls[0]: {
                page = page > 0 ? page - 1 : pages.length - 1;
                embedMsg.edit(pages[page]);
                break;
            }
            case controls[1]: {
                page = page + 1 < pages.length ? page + 1 : 0;
                embedMsg.edit(pages[page]);
                break;
            }
            case controls[2]: {
                collector.stop();
                break;
            }
            }
        };

        collector.on("collect", changePage);
        if(!message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES")) collector.on("remove", changePage);

        collector.on("end", () => {
            if (!embedMsg.deleted) {
                if(message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES")) embedMsg.reactions.removeAll();
                if(endpage != null) {
                    embedMsg.edit(endpage);
                } else {
                    let modifiedPage = pages[page];
                    modifiedPage.setFooter(`${modifiedPage.footer.text} | This session has ended`, modifiedPage.footer.iconURL);
                    embedMsg.edit(modifiedPage);
                }
            }
        });

        return embedMsg;
    };
    
    client.formatDate = (date) => {
        return `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")} UTC`;
    };

    client.arrayRandom = (arr) => {
        if (!arr || arr.length == 0) return null;
        return arr[Math.floor(Math.random()*arr.length)];
    };

    client.emojiText = (str) => {
        let legend = {
            "1": ":one:",
            "2": ":two:",
            "3": ":three:",
            "4": ":four:",
            "5": ":five:",
            "6": ":six:",
            "7": ":seven:",
            "8": ":eight:",
            "9": ":nine:",
            "0": ":zero:",
            "!": ":exclamation:",
            "?": ":question:",
            " ": "  "
        };
        return str
            .split("")
            .map(c => (/[a-z]/i).test(c) ? `:regional_indicator_${c.toLowerCase()}:` : (legend[c] ? legend[c] : null))
            .filter(Boolean)
            .join(String.fromCharCode(8203));
    };

    let deleteOldDownloads = async () => {
        let audios = await readdir("./ytdl/audio");
        let videos = await readdir("./ytdl/video");
        audios.forEach(f=>{
            if (f === ".gitignore") return;
            fs.stat("./ytdl/audio/"+f, (err,stats)=>{
                if (err) throw err;
                if((Date.now()-stats.birthtime)>1000*60*60*24*7) {
                    fs.unlink("./ytdl/audio/"+f, (err)=>{
                        if (err) throw err;
                        client.logger.info(`Deleted downloaded file ${f} for being too old.`);
                    });
                }
            });
        });
        videos.forEach(f=>{
            fs.stat("./ytdl/video/"+f, (err,stats)=>{
                if (f === ".gitignore") return;
                if (err) throw err;
                if((Date.now()-stats.birthtime)>1000*60*60*24*7) {
                    fs.unlink("./ytdl/video/"+f, (err)=>{
                        if (err) throw err;
                        client.logger.info(`Deleted downloaded file ${f} for being too old.`);
                    });
                }
            });
        });
    };
    deleteOldDownloads();
    setInterval(deleteOldDownloads, 1000*60*60*12);

    process.on("uncaughtException", async (err, origin) => {
        client.logger.error(`${err}\n${origin}`);
    });
    
    client.handleClose = async () => {
        await client.db.close();
        await client.reminders.close();
        client.music.filter(v => v.np).forEach((v, id) => {
            const player = client?.lavalink?.players?.get(id);
            if (!player) return;
            if (player.paused) return;
            const time = player?.position;
            const channel = client?.lavalink?.voiceStates?.get(id)?.channel_id;
            if (!channel) return;
            client.music.set(id, time, "np.resume");
            client.music.set(id, channel, "np.channel");
        });
        await client.music.close();
        await client.destroy();
        process.exit(0);
    };

    process.on("SIGINT", client.handleClose);
    process.on("SIGTERM", client.handleClose);
    process.on("beforeExit", client.handleClose);

    process.on("exit", async code => {
        client.logger.error("Script exited with code " + code);
    });
};
