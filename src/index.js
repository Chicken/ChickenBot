require("dotenv").config();
const { Client, Intents, Options, LimitedCollection } = require("discord.js");

const client = new Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        users: [],
        roles: [],
        repliedUser: true,
    },
    partials: ["CHANNEL"],
    makeCache: Options.cacheWithLimits({
        MessageManager: {
            sweepInterval: 1800,
            sweepFilter: LimitedCollection.filterByLifetime({
                lifetime: 43200,
            }),
        },
        ReactionManager: 0,
    }),
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

(async () => {
    try {
        await require("./functions/clientProperties.js")(client);
        await require("./functions/util.js")(client);
        await require("./functions/music.js")(client);
        await require("./loaders/events.js")(client);
        await require("./loaders/commands.js")(client);
        await require("./web/web.js")(client);
        client.login(client.config.token);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
