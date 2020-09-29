const { Message } = require('discord.js')
const fetch = require('node-fetch')

module.exports = async client => {
    /**
     * Search for data on lavalink.
     * @param {string} query - The item you want to search on lavalink.
     */
    client.getVideoData = async (query) => {
        if (!client.lavalink) throw new Error("Lavalink failed to initialize.")
        let data
        try {
            data = await (await fetch(`http://${process.env.lavalink_host}:${process.env.lavalink_port}/loadtracks?identifier=${encodeURIComponent(query)}`, { headers: { Authorization: process.env.lavalink_pass } })).json()
            if (data.error) data = {
                "loadType": "LOAD_FAILED",
                "playlistInfo": {},
                "tracks": [],
                "exception": {
                    "message": data.message,
                    "severity": data.error
                }
            }
        } catch (e) {
            client.logger.error(`Error querying lavalink. 
Error: ${e}
Query: ${query}`)
            data = {
                "loadType": "LOAD_FAILED",
                "playlistInfo": {},
                "tracks": [],
                "exception": {
                    "message": "Error contacting the server.",
                    "severity": "FATAL"
                }
            }
        } finally {
            return data;
        }
    }

    /**
     * Add a song to the queue.
     * @param {object|object[]} tracks - The track(s) you want to add to the queue.
     * @param {Message} message - The message that initiated the queue request.
     */
    client.addToQueue = (tracks, message, channel) => {
        if (!client.lavalink) throw new Error("Lavalink failed to initialize.")
        if (!Array.isArray(tracks)) tracks = [tracks]
        const guild = message?.guild.id
        if (!guild) throw new Error("No guild found!?")
        let music = client.music.ensure(guild, {
            np: null,
            queue: [],
            textChannel: message.channel.id,
            volume: 1,
            loop: false
        })
        if (!music.textChannel) {
            music.textChannel = message.channel.id
            client.music.set(guild, music.textChannel, 'textChannel')
        }
        channel = channel || message?.guild.me?.voice?.channel?.id || message?.member?.voice?.channel?.id
        queue = music.queue
        tracks.forEach(t => {
            if (!t) return
            const { track, info } = t
            let queueData = {
                track,
                name: info.title,
                url: info.uri,
                length: info.length,
                user: message.author.id,
                image: `https://img.youtube.com/vi/${info.identifier}/hqdefault.jpg`
            }
            queue.push(queueData)
        })
        client.music.set(guild, queue, 'queue')
        if (!client.lavalink.players.get(message.guild.id)) {
            if (!channel) throw new Error("No channel found, when required.")
            if (!queue[0]) return;
            let np = queue.shift()
            client.music.set(guild, np, 'np')
            client.play(np.track, { guild, channel })
        }
    }

    client.play = async (query, options = {}) => {
        if (!client.lavalink) throw new Error("Lavalink failed to initialize.")
        const manager = client.lavalink
        let guild = options.guild;
        if (!guild) throw new Error("Missing guild.")
        let channel = options.channel;
        if (!channel) throw new Error("Missing channel.")
        if (options.parse) query = (await client.getVideoData(query))?.tracks?.[0]?.track
        const player = await manager.join({
            guild,
            channel,
            node: "1"
        });
        await player.play(query);

        //TODO: Handel errors
        // know errors:
        // `WebSocketClosedEvent` Manually disconnecting the bot.
        // `TrackExceptionEvent` Youtube messed up
        player.on("error", error => {
            console.error(error)
            const goodErrors = ['WebSocketClosedEvent']
            if (!goodErrors.includes(error.type)) return;


        });
        player.on("end", async data => {
            if (data.reason === "REPLACED") return;
            if (data.reason === "CLEANUP")
                return await manager.leave(guild);
            const queue = client.music.get(guild, 'queue')
            if (!queue || !queue[0]) return await manager.leave(guild);
            queue.shift()
            if (!queue[0]) return await manager.leave(guild);
            let song = queue[0]
            client.music.set(guild, queue, 'queue')
            client.music.set(guild, song, 'np')
            await player.play(song.track);
        });


    }
}