const bent = require("bent");
const ytdl = require("ytdl-core")
const fs = require("fs")
const ffmpeg = require('fluent-ffmpeg');
exports.execute = async (client, message, args) => {
    let audioOnly = false, info;
    if(args[0]=="-a") {
        audioOnly = true;
        args.shift();
    }

    if(!args[0]) return message.channel.send("Give me a link")
    try {
        info = await ytdl.getInfo(args[0])
    } catch(e) {
        return message.channel.send("Couldn't find that video.")
    }

    if(info.player_response.videoDetails.lengthSeconds>1200) {
        return message.channel.send("Max length is 20 minutes.")
    }

    await message.channel.send("Downloading... I'll ping you when ready!")

    if(fs.existsSync("/home/antti/ChickenBot/ytdl/" + (audioOnly?"audio":"video") + "/" + info.player_response.videoDetails.videoId + (audioOnly?".mp3":".mp4"))) {
        return message.reply("Done! Here's a link you can download from! (expires someday in the future) <http://antti.codes:8080/ytdl/" + (audioOnly?"audio":"video") + "/" + info.player_response.videoDetails.videoId + ">")
    }

    if(audioOnly) {
        let stream = ytdl.downloadFromInfo(info, { filter: "audioonly", quality: "highestaudio", highWaterMark: 8388608 })
        ffmpeg(stream)
        .audioBitrate(128)
        .save("/home/antti/ChickenBot/ytdl/audio/" + info.player_response.videoDetails.videoId + ".mp3")
        .on("end", ()=>{
            return message.reply("Done! Here's a link you can download from! (expires someday in the future) <http://antti.codes:8080/ytdl/audio/" + info.player_response.videoDetails.videoId + ">")
        })
    } else {
        ytdl.downloadFromInfo(info, { filter: format => format.container === "mp4", quality: "highest", highWaterMark: 8388608 }).pipe(fs.createWriteStream("/home/antti/ChickenBot/ytdl/video/" + info.player_response.videoDetails.videoId + ".mp4")).on("close", ()=>{
            return message.reply("Done! Here's a link you can download from! (expires someday in the future) <http://antti.codes:8080/ytdl/video/" + info.player_response.videoDetails.videoId + ">")
        })
    }
}


exports.data = {
    guildOnly: false,
    aliases: ["download", "youtube-dl", "youtubedownloader"],
    category: "fun",
    name: "ytdl",
    desc: "Download a youtube video. Maximum of 20 minutes. Audio only works fine but video download resolution is questionable. Audio is mp3 and video is mp4.",
    usage: "ytdl [-a (audio only)] <url>",
    perm: 0
};