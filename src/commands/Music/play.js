const { MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format")(moment);

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let flags = [];
    while (args[0]?.startsWith("-")) {
        flags.push(args.shift()[1]);
    }
    if (!message.member.voice.channel) return message.channel.send("You must be in a voice channel to play music!");
    if (message.guild.me.voice.channel && message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("I am already in a different voice channel!");
    if (!args[0]) return message.channel.send("What song should I play?");
    let query = args.join(" ");
    let msg = await message.channel.send("Loading...");
    let meta;
    const video = /(http(s)?:\/\/)?(www\.|music\.|gaming\.|m\.)?youtu(?:be\.com\/watch\?(.+=.+&)*v=|\.be\/)([\w\-_]*)(&(amp;)?‌[\w?‌=]*)?(&.+=.+)*/; // modified from https://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
    const list = /(http(s)?:\/\/)?(www\.|music\.|gaming\.|m\.)?youtube\.com\/playlist\?(.+=.+&)*list=([\w\-_]*)(&(amp;)?[\w?‌=]*)?(&.+=.+)*/;

    if (video.test(query) || list.test(query))
        meta = await client.m.getVideoData(query);
    else
        meta = await client.m.getVideoData(`ytsearch: ${query}`);
    if (!meta) return message.channel.send("A unexpected error occurred!");
    let track, playlist;
    switch (meta.loadType) {
    case "TRACK_LOADED":
    case "SEARCH_RESULT":
        track = meta.tracks[0];
        break;
    case "PLAYLIST_LOADED":
        track = meta.tracks;
        playlist = meta.playlistInfo.name;
        break;
    case "NO_MATCHES":
    case "LOAD_FAILED":
    default:
        if (meta.exception) return message.channel.send(`I'm sorry an error occurred!\`\`\`\n${meta.exception.message}\`\`\``);
        else return message.channel.send("A unexpected error occurred!");
    }

    if (!track) return message.channel.send("A unexpected error occurred!");
    const format = (time) => time >= 3600000 ? "h:mm:ss" : time < 60000 ? "[0:]ss" : "m:ss";
    const embed = new MessageEmbed();
    if (!playlist) {
        embed
            .setTitle("Added to queue")
            .setDescription(`[${track.info.title}](${track.info.uri}) has been added to the queue.
Requested by ${message.author}
${moment.duration(track.info.length).format(format(track.info.length), { trim: false })}`)
            .setThumbnail(`https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`)
            .setColor("GREEN");
    } else {
        let time = track.reduce((p, c) => p?.info?.length || p + c.info.length);
        embed
            .setTitle("Added to queue")
            .setDescription(`${track.length} songs from ${playlist} have been added to the queue.
Requested by ${message.author}
Total time: ${moment.duration(time).format(format(time), { trim: false })}`)
            .setThumbnail(`https://img.youtube.com/vi/${track[0].info.identifier}/hqdefault.jpg`)
            .setColor("GREEN");
    }
    msg.edit("", embed);
    await client.m.addToQueue(track, message, null, flags.includes("s"));
};

exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["p", "song"],
    name: "play",
    desc: "Plays a song from youtube",
    usage: "play [-s (adds to start of queue)] <search query>",
    perm: 0
};