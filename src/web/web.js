const express = require("express")
const app = new express();
const bent = require('bent');
const formurlencoded = require('form-urlencoded').default;
const postApi = bent('https://discord.com/api/v6', 'POST', 'json', 200);
const getApi = bent('https://discord.com/api/v6', 'GET', 'json', 200);
const fs = require("fs");

module.exports = async client => {
    app.listen(client.config.webport, () => {
        client.logger.success(`Webserver online.`)
    });

    app.use(express.static(__dirname + '/static'))
    
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
        let user;
        try {
            let token = await postApi("/oauth2/token", formurlencoded(data), headers);
            user = await getApi("/users/@me", null, {"Authorization": `Bearer ${token.access_token}`});
        } catch(e) {
            client.logger.error(e);
            res.sendStatus(500).end();
        }
        res.send(`${user.username}#${user.discriminator}`);
    })
    
    app.get("/ytdl/audio/:id", async (req, res)=>{
        let path = __dirname + "../../../ytdl/audio/"+req.params.id+".mp3";
        if(!fs.existsSync(path)) {
            res.status(404).end();
        } else {
            res.download(path);
        }
    })
    
    app.get("/ytdl/video/:id", async (req, res)=>{
        let path = __dirname + "../../../ytdl/video/"+req.params.id+".mp4";
        if(!fs.existsSync(path)) {
            res.status(404).end();
        } else {
            res.download(path);
        }
    })
}