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
    
    client.formatDate = (date) => {
        return `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")} UTC`;
    };

    let deleteOldDownloads = async () => {
        let audios = await readdir("./ytdl/audio");
        let videos = await readdir("./ytdl/video");
        audios.forEach(f=>{
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
    
    let handleClose = async () => {
        await client.db.close();
        await client.destroy();
        process.exit(0);
    };

    process.on("SIGINT", handleClose);
    process.on("SIGTERM", handleClose);
    process.on("beforeExit", handleClose);

    process.on("exit", async code => {
        client.logger.error("Script exited with code " + code);
    });
};