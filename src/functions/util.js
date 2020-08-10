const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);
module.exports = (client) => {
    client.perm = message => {
        let permlvl = 0;
        let permOrder = client.config.perms.slice()
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
        return `${date.getUTCDate()}.${date.getUTCMonth()+1}.${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2,'0')}:${date.getUTCMinutes().toString().padStart(2,'0')}:${date.getUTCSeconds().toString().padStart(2,'0')} UTC+0`
    }
    
    client.colors = {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
    };

    client.deleteOldDownloads = async () => {
        let audios = await readdir("./ytdl/audio");
        let videos = await readdir("./ytdl/video");
        audios.forEach(f=>{
            fs.stat("./ytdl/audio/"+f, (err,stats)=>{
                if (err) throw err;
                if((Date.now()-stats.birthtime)>1000*60*60*24*7) {
                    fs.unlink("./ytdl/audio/"+f, (err)=>{
                        if (err) throw err;
                        console.log(`${client.colors.Green}Deleted downloaded file ${f} for being too old.${client.colors.Reset}`)
                    })
                }
            })
        })
        videos.forEach(f=>{
            fs.stat("./ytdl/video/"+f, (err,stats)=>{
                if (err) throw err;
                if((Date.now()-stats.birthtime)>1000*60*60*24*7) {
                    fs.unlink("./ytdl/video/"+f, (err)=>{
                        if (err) throw err;
                        console.log(`${client.colors.Green}Deleted downloaded file ${f} for being too old.${client.colors.Reset}`)
                    })
                }
            })
        })
    }
    client.deleteOldDownloads();
    setInterval(client.deleteOldDownloads, 1000*60*60*12);

    process.on('uncaughtException', async (err, origin) => {
        console.error(err, origin)
    })
    
    process.on('beforeExit', async (code) => {
        client.destroy()
        console.log(client.colors.Magenta + "Exiting script with code " + code);
    });
    
}