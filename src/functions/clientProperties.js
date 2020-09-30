const Enmap = require("enmap");
require("dotenv").config();

module.exports = async client => {
    client.config = require("../config.js");
    client.db = new Enmap({
        name: "guilds",
        ensureProps: true
    });
    client.reminders = new Enmap({
        name: "reminders"
    });
    client.commands = new Enmap();
    client.aliases = new Enmap();
    client.cooldown = new Set();
    client.queues = {};
    client.bantimers = {};
    client.remindtimers = {};
};