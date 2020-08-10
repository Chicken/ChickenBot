const Enmap = require('enmap')
require('dotenv').config();
module.exports = (client) => {
    client.yt = require("ytdl-core");
    client.config = require("../config.js");
    client.db = new Enmap({name: "settings", ensureProps: true})
    client.commands = new Enmap();
    client.aliases = new Enmap();
    client.cooldown = new Set();
    client.bantimers = {};
    client.remindtimers = {};
}