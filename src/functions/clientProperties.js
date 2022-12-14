const { Collection } = require("discord.js");
const Enmap = require("enmap");
require("dotenv").config();

module.exports = async (client) => {
    client.config = require("../config.js");
    client.db = new Enmap("guilds");
    client.reminders = new Enmap("reminders");
    client.commands = new Collection();
    client.aliases = new Collection();
    client.cooldown = new Set();
    client.music = new Enmap("music");
    client.bantimers = {};
    client.remindtimers = {};
    client.gifs = require("../resources/gifs.json");
};
