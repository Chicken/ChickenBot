// eslint-disable-next-line no-unused-vars
const { Message, MessageEmbed } = require("discord.js");
const moment = require("moment");
const fetch = require("node-fetch");

module.exports = async client => {
    const m = client.m = {};

    /**
     * Search for data on lavalink.
     * @param {string} query - The item you want to search on lavalink.
     */
    m.getVideoData = async (query) => {
        if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
        if (!query) throw new Error("Please provide a query.");
        let data;
        try {
            data = await (await fetch(`http://${process.env.lavalink_host}:${process.env.lavalink_port}/loadtracks?identifier=${encodeURIComponent(query)}`, { headers: { Authorization: process.env.lavalink_pass } })).json();
            if (data.error) data = {
                "loadType": "LOAD_FAILED",
                "playlistInfo": {},
                "tracks": [],
                "exception": {
                    "message": data.message,
                    "severity": data.error
                }
            };
        } catch (e) {
            client.logger.error(`Error querying lavalink. 
Error: ${e}
Query: ${query}`);
            data = {
                "loadType": "LOAD_FAILED",
                "playlistInfo": {},
                "tracks": [],
                "exception": {
                    "message": "Error contacting the server.",
                    "severity": "FATAL"
                }
            };
        }
        return data;
    };

    /**
     * This is to keep ensuring the data for the music consistent.
     * @param {string} guild The id of the guild to ensure.
     * @param {string} textChannel Optional. The id of the default text channel.
     * @returns {Object} - The data.
     */
    m.ensure = (guild, textChannel) => {
        return client.music.ensure(guild, {
            np: null,
            queue: [],
            textChannel: textChannel || null,
            volume: 100,
            announcePlaying: true,
            loop: false
        });
    };

    /**
     * Add a song to the queue.
     * @param {Object|Object[]} tracks - The track(s) you want to add to the queue.
     * @param {Message} message - The message that initiated the queue request.
     * @param {string} [channel] - Optional. The id of the channel to join. If none is provided it will attempt to find the bot, and then players current vc to join from the message. Not needed if already playing.
     * @param {boolean} [front] - Optional. Wether you want to add the song to the front of the queue. Defaults to false.
     */
    m.addToQueue = (tracks, message, channel, front = false) => {
        if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
        if (!Array.isArray(tracks)) tracks = [tracks];
        const guild = message?.guild.id;
        if (!guild) throw new Error("No guild found!?");
        let music = m.ensure(guild, message.channel.id);
        if (!music.textChannel) {
            music.textChannel = message.channel.id;
            client.music.set(guild, music.textChannel, "textChannel");
        }
        channel = channel || message?.guild.me?.voice?.channel?.id || message?.member?.voice?.channel?.id;
        let queue = music.queue;
        tracks = tracks.filter(t => t).map(t => {
            const { track, info } = t;
            let queueData = {
                track,
                name: info.title,
                url: info.uri,
                length: info.length,
                user: message.author.id,
                image: `https://img.youtube.com/vi/${info.identifier}/hqdefault.jpg`
            };
            return queueData;
        });
        if (front) queue = tracks.concat(queue);
        else queue = queue.concat(tracks);
        client.music.set(guild, queue, "queue");
        if (!client.lavalink.players.get(message.guild.id)) {
            if (!channel) throw new Error("No channel found, when required.");
            if (!queue[0]) return;
            let np = queue.shift();
            client.music.set(guild, queue, "queue");
            client.music.set(guild, np, "np");
            m.play(np.track, { guild, channel, volume: music.volume });
        }
    };

    /**
     * Play music. This also handles the next song.
     * @param {string} query - The query to play.
     * @param {object} options - The options.
     * @param {string} options.guild - The id of the guild to play in.
     * @param {string} options.channel - The id of the channel to play in.
     * @param {boolean} [options.parse] - Optional. Whether to search for your query or not.
     * @param {number} [options.volume] - Optional. The volume to play at. Must be from 0 to 150.
     * @param {number} [options.startTime] - Optional. The time to start playing the video.
     */
    m.play = async (query, options = {}) => {
        if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
        const manager = client.lavalink;
        const { guild, channel, parse, startTime } = options;
        let { volume } = options;
        if (!guild) throw new Error("Missing guild.");
        if (!channel) throw new Error("Missing channel.");
        if (parse) query = (await m.getVideoData(query))?.tracks?.[0]?.track;
        const player = await manager.join({
            guild,
            channel,
            node: "1"
        }, {
            selfdeaf: true
        });
        try {
            await player.play(query, { volume, startTime });
        } catch (e) {
            let channel = client.channels.cache.get(client.music.get(guild, "textChannel"));
            if (channel) channel.send(`I'm sorry an error occurred.
${e.message}`);
            m.disconnect(guild);
        }

        let state = "ok";
        player.on("error", error => {
            console.error(error);
            let message = "I'm sorry an unexpected error occurred!";
            if (error.error)
                message = "I'm sorry an error occurred!\n" +
                    error.error;
            if (error.type === "WebSocketClosedEvent") {
                if (error.reason === "Disconnected.") return;
                state = "crashed";
                message = "There was a fatal error and I have to leave!\n" + error.reason;
                // This gracefully handles disconnects so the bot doesn't get stuck.
                // Clears the queue though so preferably shouldn't be used
                m.disconnect(guild);
            }
            let channel = client.channels.cache.get(client.music.get(guild, "textChannel"));
            if (channel) channel.send(message);

        });
        player.on("volume", v => {
            volume = v;
            client.music.set(guild, v, "volume");
        });
        player.on("end", async data => {
            if (state !== "ok") return await manager.leave(guild);
            if (data.reason === "REPLACED") return;
            if (data.reason === "CLEANUP")
                return await manager.leave(guild);
            if (data.reason === "ENDED")
                return await manager.leave(guild);
            if (data.reason === "SKIPPED")
                return await player.stop();
            const { queue, loop, np, textChannel } = client.music.get(guild);
            let channel = client.channels.cache.get(textChannel);
            if (!queue || !queue[0] && !loop) {
                manager.leave(guild);
                m.disconnect(guild);
                if (channel) channel.send("Look like thats the last song. Hope you had a good session.");
                return;
            }
            if (loop) queue.push(np);
            const song = queue.shift();
            client.music.set(guild, queue, "queue");
            client.music.set(guild, song, "np");
            const format = (time) => time >= 3600000 ? "h:mm:ss" : time < 60000 ? "[0:]ss" : "m:ss";
            await player.play(song.track, { volume });

            if (channel && client.music.get(guild, "announcePlaying"))
                channel.send(
                    new MessageEmbed()
                        .setTitle("Now Playing!")
                        .setDescription(`[${song.name}](${song.url}) is now playing.
Requested by <@${song.user}>.
${moment.duration(song.length).format(format(song.length), { trim: false })}`)
                        .setThumbnail(song.image)
                        .setColor("GREEN")
                );
        });

        /**
         * Skip a song.
         * @param {string} guild - The id of the guild.
         * @param {number} [amount] - Optional. The amount to skip. 
         */
        m.skip = (guild, amount = 1) => {
            if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
            if (!guild) throw new Error("Missing guild.");
            const player = client.lavalink.players.get(guild);
            if (!player) throw new Error("No player found.");
            const queue = client.music.get(guild, "queue");
            if (!queue) throw new Error("No queue found.");
            amount--;
            if (amount > 0) {
                client.music.set(guild, queue.slice(amount), "queue");
            }
            player.emit("end", { reason: "SKIPPED" });
        };

        /**
         * Disconnect from a guild and clear the queue. May be used anytime you want to destroy the music data and disconnect.
         * @param {string} guild - The id of the guild to disconnect in.
         * @returns {boolean} Whether or not it was able to disconnect.
         */
        m.disconnect = (guild) => {
            if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
            if (!guild) throw new Error("Missing guild.");
            const player = client.lavalink.players.get(guild);
            client.music.set(guild, [], "queue");
            client.music.set(guild, null, "np");
            client.music.set(guild, false, "loop");
            client.music.set(guild, null, "textChannel");
            if (!player) return false;
            player.emit("end", { reason: "ENDED" });
            return true;
        };
        /**
         * Change the volume of the player.
         * @param {string} guild - The id of the guild.
         * @param {number} [amount] - Optional. The amount to change to. 
         */
        m.volume = (guild, amount = 100) => {
            if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
            if (!guild) throw new Error("Missing guild.");
            const player = client.lavalink.players.get(guild);
            if (!player) throw new Error("No player found.");
            const queue = client.music.get(guild, "queue");
            if (!queue) throw new Error("No queue found.");
            if (amount < 0 || amount > 150)
                throw new Error("Please choose a value between 0 and 150.");
            player.volume(amount);
        };
        /**
         * Change the volume of the player.
         * @param {string} guild - The id of the guild.
         * @param {Boolean} [pause] - Optional. The wether to pause or resume. If none is specified it will toggle. 
         */
        m.pause = (guild, pause) => {
            if (!client.lavalink) throw new Error("Lavalink failed to initialize.");
            if (!guild) throw new Error("Missing guild.");
            const player = client.lavalink.players.get(guild);
            if (!player) throw new Error("No player found.");
            if (typeof pause != "boolean") pause = !player.paused;
            player.pause(pause);
        };
        /**
         * Shuffle the music in the queue.
         * @param {string} guild - The id of the guild.
         */
        m.shuffle = (guild) => {
            const queue = client.music.get(guild, "queue");
            const temp = [];
            for (; 0 < queue.length;) {
                temp.push(queue.splice(Math.floor(Math.random() * queue.length), 1)[0]);
            }
            client.music.set(guild, temp, "queue");
        };
    };
};
