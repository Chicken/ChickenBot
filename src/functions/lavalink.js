const { Manager } = require("@lavacord/discord.js");
require("dotenv").config();

module.exports = async client => {
    if (!process.env.lavalink_host || !process.env.lavalink_port) {
        client.logger.info("Lavalink is missing required info to start. Music commands are now disabled.");
        return false;
    } try {
        client.lavalink = new Manager(client, [
            { id: "1", host: process.env.lavalink_host, port: process.env.lavalink_port, password: process.env.lavalink_pass }],
        { user: client.user.id, shards: 1 }
        );

        await client.lavalink.connect();
        client.logger.success("Lavalink successfully loaded!");
        return true;
    } catch (e) {
        client.lavalink = undefined;
        client.logger.error(`Error loading Lavalink: ${e}.`);
        client.logger.info("Music commands are now disabled.");
        return false;
    }
};