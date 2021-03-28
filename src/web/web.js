const express = require("express");
const app = new express();
const bent = require("bent");
const formurlencoded = require("form-urlencoded").default;
const postApi = bent("https://discord.com/api/v6", "POST", "json", 200);
const getApi = bent("https://discord.com/api/v6", "GET", "json", 200);
const fs = require("fs");

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
        try {
            let token = await postApi("/oauth2/token", formurlencoded(data), headers);
            user = await getApi("/users/@me", null, {"Authorization": `Bearer ${token.access_token}`});
        } catch(e) {
            client.logger.error(e);
            res.sendStatus(500);
        }
        res.send(`${user.username}#${user.discriminator}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"));
    });
    
    app.get("/ytdl/audio/:id", async (req, res) => {
        let id = req.params.id.replace(/[^0-9A-Za-z\-_]/g, "");
        let path = __dirname + "/../../ytdl/audio/" + id + ".mp3";
        fs.access(path, err => {
            if(err) {
                res.sendStatus(404);
            } else {
                res.download(path);
            }
        });
    });
    
    app.get("/ytdl/video/:id", async (req, res)=>{
        let id = req.params.id.replace(/[^0-9A-Za-z\-_]/g, "");
        let path = __dirname + "/../../ytdl/video/" + id + ".mp4";
        fs.access(path, err => {
            if(err) {
                res.sendStatus(404);
            } else {
                res.download(path);
            }
        });
    });
};
