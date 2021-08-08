const { Permissions } = require("discord.js");

const config = {
    owner: "YOUR ID HERE",
    admins: [],
    support: [],
    token: process.env.token,
    hostname: process.env.hostname,
    weatherapi: process.env.weatherapi,
    thecatapi: process.env.thecatapi,
    fixerapi: process.env.fixerapi,
    webport: process.env.port,
    log: "YOUR LOG CHANNEL ID HERE",
    defaultSettings: {
        settings: {
            prefix: "<",
            log: null,
            logs: {
                join: false,
                leave: false,
                delete: false,
                bulkdelete: false,
                edit: false,
            },
            mod: null,
            description: null,
            xp: false,
        },
        users: {},
        tags: {},
        banned: {},
    },
    perms: [
        {
            guildOnly: false,
            level: 0,
            name: "User",
            check: () => true,
        },
        {
            guildOnly: true,
            level: 1,
            name: "Server mod",
            check: async (message, client) =>
                (await message.guild.members.fetch(message.author)).roles.cache.some(
                    (r) => r.id === client.db.get(message.guild.id).settings.mod
                ),
        },
        {
            guildOnly: true,
            level: 2,
            name: "Server Admin",
            check: async (message) => {
                try {
                    return (await message.guild.members.fetch(message.author)).permissions.has(
                        Permissions.FLAGS.ADMINISTRATOR
                    );
                } catch (e) {
                    return false;
                }
            },
        },
        {
            guildOnly: true,
            level: 3,
            name: "Server Owner",
            check: (message) => message.author.id === message.guild.ownerId,
        },
        {
            guildOnly: false,
            level: 4,
            name: "Bot Support",
            check: (message) => config.support.includes(message.author.id),
        },
        {
            guildOnly: false,
            level: 5,
            name: "Bot Admin",
            check: (message) => config.admins.includes(message.author.id),
        },
        {
            guildOnly: false,
            level: 6,
            name: "Bot Owner",
            check: (message) => message.author.id === config.owner,
        },
    ],
};

module.exports = config;
