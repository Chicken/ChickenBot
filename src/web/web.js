const express = require("express");
const app = new express();
const rateLimit = require("express-rate-limit");
const bent = require("bent");
const formurlencoded = require("form-urlencoded");
const postApi = bent("https://discord.com/api/v6", "POST", "json", 200);
const getApi = bent("https://discord.com/api/v6", "GET", "json", 200);
const fs = require("fs").promises;

module.exports = async client => {
    app.listen(client.config.webport, () => {
        client.logger.success("Webserver online.");
    });

    app.use(express.static(__dirname + "/static"));
    
    app.get("/auth", async (req, res)=>{
        let data = {
            "client_id": "512663078819725313",
            "client_secret": process.env.client_secret,
            "grant_type": "authorization_code",
            "code": req.query.code,
            "redirect_uri": `${client.config.hostname}/auth`,
            "scope": "identify guilds"
        };
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        let user;
        let guilds;
        try {
            let token = await postApi("/oauth2/token", formurlencoded(data), headers);
            user = await getApi("/users/@me", null, {"Authorization": `Bearer ${token.access_token}`});
            guilds = await getApi("/users/@me/guilds", null, {"Authorization": `Bearer ${token.access_token}`});
        } catch(e) {
            client.logger.error(e);
            res.sendStatus(500);
        }
        let esc = d => d.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        res.send(`Under development!\n<br>\nYour username is "${esc(user.username)}#${esc(user.discriminator)}" and you are in ${esc(guilds.length)} servers.`);
    });
    
    let downloadRatelimit = rateLimit({
        windowsMs: 1000 * 60 * 10,
        max: 5
    });

    app.get("/ytdl/audio/:id", downloadRatelimit, async (req, res) => {
        let id = req.params.id.replace(/[^0-9A-Za-z\-_]/g, "");
        let path = __dirname + "/../../ytdl/audio/" + id + ".mp3";
        fs.access(path)
            .then(() => {
                res.download(path);
            })
            .catch(() => {
                res.sendStatus(404);
            });
    });
    
    app.get("/ytdl/video/:id", downloadRatelimit, async (req, res)=>{
        let id = req.params.id.replace(/[^0-9A-Za-z\-_]/g, "");
        let path = __dirname + "/../../ytdl/video/" + id + ".mp4";
        fs.access(path)
            .then(() => {
                res.download(path);
            })
            .catch(() => {
                res.sendStatus(404);
            });
    });
};
