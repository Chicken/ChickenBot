const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);

module.exports = async client => {
    // BOT FUNCTIONS

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

    client.emojiText = (str) => {
        return str
            .split("")
            .map(c => (/[a-z]/i).test(c) ? `:regional_indicator_${c.toLowerCase()}:` : (legend[c] ? legend[c] : null))
            .filter(Boolean)
            .join(String.fromCharCode(8203));
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

    // TIME AND DATE FUNCTIONS
    
    let multiples = {
        MILLISECOND: 1,
        SECOND: 1000,
        MINUTE: 1000 * 60,
        HOUR: 1000 * 60 * 60,
        DAY: 1000 * 60 * 60 * 24,
        WEEK: 1000 * 60 * 60 * 24 * 7,
        MONTH: 1000 * 60 * 60 * 24 * 30,
        YEAR: 1000 * 60 * 60 * 24 * 365
    };

    let shorts = {
        seconds: "secs",
        minutes: "mins",
        hours: "hrs",
        days: "d ",
        months: "m ",
        years: "y "
    };

    client.formatDate = (date) => {
        return `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")} UTC`;
    };

    client.parseTime = (str) => {
        if(typeof str !== "string") throw new TypeError("Str needs to be a string.");

        let match = str.match(/([0-9.,_]+)(\w+)?/);
        if(!match) return null;
        let [ , value, unit ] = match;
        if(!value) return null;

        value = parseFloat(value.replace(/_/g, "").replace(/,/g, "."));
        unit = unit?.toLowerCase();

        let multiple = null;
        switch(unit) {
            case "ms":
            case "millisecond":
            case "milliseconds":
            case undefined:
                multiple = multiples.MILLISECOND;
                break;
            case "s":
            case "sec":
            case "secs":
            case "second":
            case "seconds":
                multiple = multiples.SECOND;
                break;
            case "m":
            case "min":
            case "mins":
            case "minute":
            case "minutes":
                multiple = multiples.MINUTE;
                break;
            case "h":
            case "hr":
            case "hrs":
            case "hour":
            case "hours":
                multiple = multiples.HOUR;
                break;
            case "d":
            case "day":
            case "days":
                multiple = multiples.DAY;
                break;
            case "w":
            case "wk":
            case "wks":
            case "week":
            case "weeks":
                multiple = multiples.WEEK;
                break;
            case "mo":
            case "mos":
            case "mon":
            case "mons":
            case "month":
            case "months":
                multiple = multiples.MONTH;
                break;
            case "y":
            case "ys":
            case "yer":
            case "year":
            case "years":
                multiple = multiples.YEAR;
                break;
            default:
                return null;
        }

        return Math.round(value * multiple);
    };

    client.formatLength = (ms) => {
        if(typeof ms !== "number") throw new TypeError("Ms needs to be a number.");

        ms = Math.floor(ms / 1000) * 1000;

        let hours = Math.floor(ms / multiples.HOUR);
        ms -= hours * multiples.HOUR;

        let minutes = Math.floor(ms / multiples.MINUTE);
        ms -= minutes * multiples.MINUTE;

        let seconds = Math.floor(ms / multiples.SECOND);
    
        return `${hours ? `${hours}:` : ""}${minutes ? minutes.toString().padStart(2, "0") : "0"}:${seconds.toString().padStart(2, "0")}`;
    };

    client.formatDuration = (ms, options = {}) => {
        if(typeof ms !== "number") throw new TypeError("Ms needs to be a number.");
        if(typeof options !== "object") throw new TypeError("Options needs to be an object.");

        let short = options.short ?? false;
        let amount = options.amount ?? 3;
        let raw = options.raw ?? false;
        if(typeof short !== "boolean") throw new TypeError("Options.short needs to be a boolean.");
        if(typeof amount !== "number") throw new TypeError("Options.amount needs to be an number.");
        if(typeof raw !== "boolean") throw new TypeError("Options.raw needs to be an boolean.");

        ms = Math.floor(ms / 1000) * 1000;

        let years = Math.floor(ms / multiples.YEAR);
        ms -= years * multiples.YEAR;
        
        let months = Math.floor(ms / multiples.MONTH);
        ms -= months * multiples.MONTH;

        let days = Math.floor(ms / multiples.DAY);
        ms -= days * multiples.DAY;

        let hours = Math.floor(ms / multiples.HOUR);
        ms -= hours * multiples.HOUR;

        let minutes = Math.floor(ms / multiples.MINUTE);
        ms -= minutes * multiples.MINUTE;

        let seconds = Math.floor(ms / multiples.SECOND);

        if(raw) return {
            years,
            months,
            days,
            hours,
            minutes,
            seconds
        };

        return Object.entries({
            years,
            months,
            days,
            hours,
            minutes,
            seconds
        })
            .filter(t => Boolean(t[1]))
            .slice(0, amount)
            .map(([u, v]) => `${v}${
                short ? 
                    ( v > 1 ? shorts[u].trim() : shorts[u].substring(0, shorts[u].length - 1) ) :
                    ( " " + ( v > 1 ? u : u.substring(0, u.length - 1) ))
            }`)
            .join(", ");
    };

    // SYSTEM AND OTHER FUNCTIONS

    client.logger = require("./logger");

    client.arrayRandom = (arr) => {
        if (!arr || arr.length == 0) return null;
        return arr[Math.floor(Math.random()*arr.length)];
    };

    let deleteOldDownloads = async () => {
        let audios = await readdir("./ytdl/audio");
        let videos = await readdir("./ytdl/video");
        audios.forEach(f=>{
            if (f === ".gitignore") return;
            fs.stat("./ytdl/audio/" + f, (err, stats)=>{
                if (err) throw err;
                if((Date.now() - stats.birthtime) > 1000 * 60 * 60 * 24 * 7) {
                    fs.unlink("./ytdl/audio/" + f, (err)=>{
                        if (err) throw err;
                        client.logger.info(`Deleted downloaded file ${f} for being too old.`);
                    });
                }
            });
        });
        videos.forEach(f=>{
            fs.stat("./ytdl/video/" + f, (err, stats)=>{
                if (f === ".gitignore") return;
                if (err) throw err;
                if((Date.now() - stats.birthtime) > 1000 * 60 * 60 * 24 * 7) {
                    fs.unlink("./ytdl/video/" + f, (err)=>{
                        if (err) throw err;
                        client.logger.info(`Deleted downloaded file ${f} for being too old.`);
                    });
                }
            });
        });
    };
    deleteOldDownloads();
    setInterval(deleteOldDownloads, 1000 * 60 * 60 * 12);

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
