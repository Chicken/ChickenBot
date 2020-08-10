const express = require("express")
module.exports = (client) => {
    const app = new express();
    app.listen(8080);
    const bent = require('bent');
    const formurlencoded = require('form-urlencoded').default;
    const postApi = bent('https://discord.com/api/v6', 'POST', 'json', 200);
    const getApi = bent('https://discord.com/api/v6', 'GET', 'json', 200);

    app.get("/", async (req, res)=>{
        res.sendFile(__dirname + "/index.html")
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
        let user;
        try {
        let token = await postApi("/oauth2/token", formurlencoded(data), headers)
        user = await getApi("/users/@me", null, {"Authorization": `Bearer ${token.access_token}`})
        } catch(e) {
            console.error(e)
            res.sendStatus(500)
        }
        res.send(`${user.username}#${user.discriminator}`)
    })
    
    app.get("/ytdl/audio/:id", async (req, res)=>{
        res.download(__dirname + "../../../ytdl/audio/"+req.params.id+".mp3")
    })
    
    app.get("/ytdl/video/:id", async (req, res)=>{
        res.download(__dirname + "../../../ytdl/video/"+req.params.id+".mp4")
    })
}