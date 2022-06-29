const Express = require("express");

const app = new Express();
const rateLimit = require("express-rate-limit");
const bent = require("bent");
const formurlencoded = require("form-urlencoded");

const postApi = bent("https://discord.com/api/v9", "POST", "json", 200);
const getApi = bent("https://discord.com/api/v9", "GET", "json", 200);
const fs = require("fs").promises;

module.exports = async (client) => {
    app.listen(client.config.webport, () => {
        client.logger.success("Webserver online.");
    });

    app.use(Express.static(`${__dirname}/static`));

    app.get("/auth", async (req, res) => {
        const data = {
            client_id: client.user.id,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: `${client.config.hostname}/auth`,
            scope: "identify guilds",
        };
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        let user;
        let guilds;
        try {
            const token = await postApi("/oauth2/token", formurlencoded(data), headers);
            user = await getApi("/users/@me", null, {
                Authorization: `Bearer ${token.access_token}`,
            });
            guilds = await getApi("/users/@me/guilds", null, {
                Authorization: `Bearer ${token.access_token}`,
            });
        } catch (e) {
            client.logger.error(e);
            res.sendStatus(400);
            return;
        }
        const esc = (d) =>
            d.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        res.send(
            `Under development!\n<br>\nYour username is "${esc(user.username)}#${esc(
                user.discriminator
            )}" and you are in ${esc(guilds.length)} servers.`
        );
    });

    const downloadRatelimit = rateLimit({
        windowsMs: 1000 * 60 * 10,
        max: 5,
    });

    app.get("/ytdl/audio/:id", downloadRatelimit, async (req, res) => {
        const id = req.params.id.replace(/[^0-9A-Za-z\-_]/g, "");
        const path = `${__dirname}/../../ytdl/audio/${id}.mp3`;
        fs.access(path)
            .then(() => {
                res.download(path);
            })
            .catch(() => {
                res.sendStatus(404);
            });
    });

    app.get("/ytdl/video/:id", downloadRatelimit, async (req, res) => {
        const id = req.params.id.replace(/[^0-9A-Za-z\-_]/g, "");
        const path = `${__dirname}/../../ytdl/video/${id}.mp4`;
        fs.access(path)
            .then(() => {
                res.download(path);
            })
            .catch(() => {
                res.sendStatus(404);
            });
    });
};
