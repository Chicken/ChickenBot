const { Node } = require("@skyra/audio");
require("dotenv").config();

module.exports = async (client) => {
    if (!process.env.LAVALINK_HOST) {
        client.logger.info(
            "Lavalink is missing required info to start. Music commands are now disabled."
        );
        return false;
    }
    try {
        client.lavalink = new Node(
            {
                password: process.env.LAVALINK_PASS,
                userID: client.user.id,
                host: process.env.LAVALINK_HOST,
            },
            (guildID, packet) => {
                const guild = client.guilds.cache.get(guildID);
                if (guild) return guild.shard.send(packet);
            }
        );

        await client.lavalink.connect();
        client.ws.on("VOICE_STATE_UPDATE", async (data) => {
            try {
                await client.lavalink.voiceStateUpdate(data);
            } catch (error) {
                client.logger.error(error);
            }
        });

        client.ws.on("VOICE_SERVER_UPDATE", async (data) => {
            try {
                await client.lavalink.voiceServerUpdate(data);
            } catch (error) {
                client.logger.error(error);
            }
        });
        client.logger.success("Lavalink successfully loaded!");
        return true;
    } catch (e) {
        delete client.lavalink;
        client.logger.error(`Error loading Lavalink: ${e}.`);
        client.logger.info("Music commands are now disabled.");
        return false;
    }
};
