const { MessageEmbed } = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const flags = [];
    while (args[0]?.startsWith("-")) {
        flags.push(args.shift()[1]);
    }
    if (!message.member.voice.channel)
        return message.channel.send("You must be in a voice channel to play music!");
    if (
        message.guild.me.voice.channel &&
        message.guild.me.voice.channel !== message.member.voice.channel
    )
        return message.channel.send("I am already in a different voice channel!");
    if (!args[0]) return message.channel.send("What song should I play?");
    const query = args.join(" ");
    const msg = await message.channel.send("Loading...");
    let meta;
    const video =
        /^(?:https?:\/\/)?(?:www\.|music\.|gaming\.|m\.)?youtu(?:(?:\.be\/([a-z0-9\-_]{11})(?:&.*?)?)|(?:be\.com\/watch\?(?:[^=&]+=[^=&]+&)*?v=([a-z0-9\-_]{11})(?:&.*?)?))$/im;
    const list =
        /^(?:https?:\/\/)?(?:www\.|music\.|gaming\.|m\.)?youtube\.com\/playlist\?(?:[^=&]+=[^=&]+&)*?list=([a-z0-9\-_]{34})(?:&.*?)?$/im;

    if (video.test(query) || list.test(query)) meta = await client.m.getVideoData(query);
    else meta = await client.m.getVideoData(`ytsearch: ${query}`);
    if (!meta) return message.channel.send("A unexpected error occurred!");
    let track;
    let playlist;
    switch (meta.loadType) {
        case "TRACK_LOADED":
        case "SEARCH_RESULT":
            [track] = meta.tracks;
            break;
        case "PLAYLIST_LOADED":
            track = meta.tracks;
            playlist = meta.playlistInfo.name;
            break;
        case "NO_MATCHES":
            return message.channel.send("No matches found!");
        case "LOAD_FAILED":
        default:
            if (meta.exception)
                return message.channel.send(
                    `I'm sorry an error occurred!\`\`\`\n${meta.exception.message}\`\`\``
                );
            return message.channel.send("A unexpected error occurred!");
    }

    if (!track) return message.channel.send("A unexpected error occurred!");
    const embed = new MessageEmbed();
    if (!playlist) {
        embed
            .setTitle("Added to queue")
            .setDescription(
                `[${track.info.title}](${track.info.uri}) has been added to the queue.
Requested by ${message.author}
${client.formatLength(track.info.length)}`
            )
            .setThumbnail(`https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`)
            .setColor("GREEN");
    } else {
        const time = track.reduce((p, c) => p?.info?.length || p + c.info.length);
        embed
            .setTitle("Added to queue")
            .setDescription(
                `${track.length} songs from ${playlist} have been added to the queue.
Requested by ${message.author}
Total time: ${client.formatLength(time)}`
            )
            .setThumbnail(`https://img.youtube.com/vi/${track[0].info.identifier}/hqdefault.jpg`)
            .setColor("GREEN");
    }
    msg.edit({ embeds: [embed] });
    await client.m.addToQueue(track, message, null, flags.includes("s"));
};

exports.data = {
    permissions: 36718592n,
    guildOnly: true,
    aliases: ["p", "song"],
    name: "play",
    desc: "Plays a song from youtube",
    usage: "play [-s (adds to start of queue)] <search query>",
    perm: 0,
};
