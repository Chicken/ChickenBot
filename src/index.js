const { Client, Intents } = require("discord.js");
const client = new Client({
    disableMentions: "everyone",
    ws: {
        intents: Intents.ALL
    }
});

(async () => {
    await require("./functions/clientProperties.js")(client);
    await require("./functions/util.js")(client);
    await require("./functions/music.js")(client);
    await require("./loaders/events.js")(client);
    await require("./loaders/commands.js")(client);
    await require("./web/web.js")(client);
    client.login(client.config.token);
})();
