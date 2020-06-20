const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();
client.config = require("./config.js")
const DBL = require("dblapi.js");
const dbl = new DBL(client.config.topgg, client);
const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);
const Enmap = require('enmap')
const express = require("express")
const app = new express()
app.listen(8080);
const bent = require('bent')
const formurlencoded = require('form-urlencoded').default;
const postApi = bent('https://discord.com/api/v6', 'POST', 'json', 200);
const getApi = bent('https://discord.com/api/v6', 'GET', 'json', 200);
client.yt = require("ytdl-core")

client.db = new Enmap({name: "settings", ensureProps: true})
client.commands = new Enmap();
client.aliases = new Enmap();
client.cooldown = new Set();
client.bantimers = {};
client.remindtimers = {};

try {
    client.login(client.config.token);
} catch(e) {
    console.error(e);
    process.exit(1);
}

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

dbl.on('error', e => {
   console.error(`Dbl error\n${e}`);
})

app.get("/", async (req, res)=>{
    res.sendFile(__dirname + "/web/index.html")
})

app.get("/auth", async (req, res)=>{
    let data = {
        'client_id': "512663078819725313",
        'client_secret': process.env.client_secret,
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'redirect_uri': `${client.config.hostname}/auth`,
        'scope': 'identify guilds'
      }
    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    try {
    let token = await postApi("/oauth2/token", formurlencoded(data), headers)
    let user = await getApi("/users/@me", null, {"Authorization": `Bearer ${token.access_token}`})
    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
    res.send(`${user.username}#${user.discriminator}`)
})

app.get("/ytdl/audio/:id", async (req, res)=>{
    res.download(__dirname + "/ytdl/audio/"+req.params.id+".mp3")
})

app.get("/ytdl/video/:id", async (req, res)=>{
    res.download(__dirname + "/ytdl/video/"+req.params.id+".mp4")
})

async function deleteOldDownloads() {
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

deleteOldDownloads()
setInterval(deleteOldDownloads, 1000*60*60*12)

process.on('uncaughtException', async (err, origin) => {
    console.error(err, origin)
})

process.on('beforeExit', async (code) => {
    client.destroy()
    console.log(client.colors.Magenta + "Exiting script with code " + code);
});

async function init() {
    console.log(`${client.colors.Green}Starting to load commands${client.colors.Reset}`)
    const cmdFiles = await readdir("./commands/");
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        console.log(`${client.colors.Yellow}Trying to load command ${f.split(" ")[0]}${client.colors.Reset}`)
        try {
            let props = require(`./commands/${f}`);
            if(props.data.disabled) return console.log(`${client.colors.Red}Command not loaded because it's disabled.${client.colors.Reset}`);
            client.commands.set(props.data.name, props)
            props.data.aliases.forEach(a=>{
                client.aliases.set(a, props.data.name)
            })
        } catch (e) {
            console.error(`${client.colors.Red}Failed to load command ${f.split(" ")[0]}\n${e.stack}${client.colors.Reset}`)
        }
    });

    console.log(`${client.colors.Green}Starting to load events${client.colors.Reset}`)
    const evtFiles = await readdir("./events/");
    evtFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        try {
            console.log(`${client.colors.Yellow}Trying to load event ${f.split(" ")[0]}${client.colors.Reset}`)
            const eventName = f.split(".")[0];
            const event = require(`./events/${f}`);
            client.on(eventName, event.bind(null, client));
        } catch (e) {
            console.error(`${client.colors.Red}Failed to load event ${f.split(" ")[0]}\n${e}${client.colors.Reset}`)
        }
    });
    console.log(`${client.colors.Green}Done.${client.colors.Reset}`)
}

init();