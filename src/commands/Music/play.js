const ytdlDiscord = require("ytdl-core-discord");
const ytdl = require("ytdl-core");
const bent = require("bent");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let flags = [];
    while(args[0] && args[0].startsWith("-")) {
        flags.push(args.shift()[1]);
    }
    if(!client.queues[message.guild.id]) {
        client.queues[message.guild.id] = [];
    }
    if (!message.member.voice.channel) return message.channel.send("You must be in a voice channel to play music!");
    if (message.guild.me.voice.channel && message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("I am already in a different voice channel!");
    if (!args[0]) return message.channel.send("What song should I play?");
    let querry = args.join(" ");
    let meta, msg;
    
    if(ytdl.validateURL(querry)){
        msg = await message.channel.send("Loading video...");
        meta = await ytdl.getBasicInfo(querry);
    } else if(/^.*(youtu.be\/|list=)([^#&?]*).*/.test(querry)) {

        msg = await message.channel.send("Loading videos from playlist...");

        let url = querry.match(/^.*(youtu.be\/|list=)([^#&?]*).*/)[0];
        let result = await bent(url, "string", "GET")();
        let videos = result.match(/watch\?v=([a-zA-Z0-9-_]{11})/g);
        if(videos.length<0){
            return message.channel.send("No playlist found!");
        }
        videos = [...new Set(videos)];
        for (let i = 0; i < videos.length; i++) {
            let v = videos[i];
            await (async()=>{
                try{
                    let vurl = "https://www.youtube.com/" + v;
                    if(!ytdl.validateURL(vurl)) return;
                    meta = await ytdl.getBasicInfo(vurl);
                    if(!meta) return;
                    client.queues[message.guild.id].push({ name: meta.player_response.videoDetails.title, url: vurl, length: meta.player_response.videoDetails.lengthSeconds, user: message.author.id, image: meta.player_response.videoDetails.thumbnail.thumbnails[meta.player_response.videoDetails.thumbnail.thumbnails.length - 1] });
                } catch (e) { return; }
            })();
        }
        let connection;
        if(!message.guild.me.voice.channel) {
            connection = await message.member.voice.channel.join();
        } else {
            return;
        }
        await msg.edit(`Added \`${videos.length}\` songs from ´${result.match(/<title>(.*)<\/title>/)[1].split(" - ")[0]}\` to the queue`);
        playNext(connection);
        return;

    } else {
        msg = await message.channel.send("Loading video...");
        let result = await bent(`https://www.youtube.com/results?search_query=${args.join("+")}&sp=EgIQAQ%253D%253D`, "string", "GET")();
        let first = "https://www.youtube.com/" + result.match(/watch\?v=([a-zA-Z0-9-_]{11})/g)[0];
        meta = await ytdl.getBasicInfo(first);
    }

    let url = "https://www.youtube.com/watch?v=" + meta.player_response.videoDetails.videoId;

    if (!meta) return message.channel.send("No song found with that name!");

    if(flags.includes("s")) {
        let q = client.queues[message.guild.id];
        let cur = q.shift();
        q.unshift({name: meta.player_response.videoDetails.title, url:url, length: meta.player_response.videoDetails.lengthSeconds, user: message.author.id, image: meta.player_response.videoDetails.thumbnail.thumbnails[meta.player_response.videoDetails.thumbnail.thumbnails.length-1]});
        q.unshift(cur);
        client.queues[message.guild.id] = q;
    } else {
        client.queues[message.guild.id].push({ name: meta.player_response.videoDetails.title, url: url, length: meta.player_response.videoDetails.lengthSeconds, user: message.author.id, image: meta.player_response.videoDetails.thumbnail.thumbnails[meta.player_response.videoDetails.thumbnail.thumbnails.length - 1] });
    }
    
    msg.edit(`Added \`${meta.player_response.videoDetails.title}\` to the queue.`);


    let connection;
    if(!message.guild.me.voice.channel) {
        connection = await message.member.voice.channel.join();
    } else {
        return;
    }


    async function playNext(connection) {
        let songs = client.queues[message.guild.id];
        let current = songs[0];
        if (!current) return message.guild.me.voice.channel.leave();
        let dispatcher = connection.play(await ytdlDiscord(current.url, { begin: (current.time ? current.time : "0"), filter: "audioonly", quality: "highestaudio", highWaterMark: 1 << 25 }), { type: "opus", highWaterMark: 25, volume: client.db.get(message.guild.id, "settings.volume") });
        dispatcher.on("finish", ()=>{
            let songs = client.queues[message.guild.id];
            if(client.db.get(message.guild.id, "settings.loop")){
                songs.push(songs.shift());
            } else {
                songs.shift();
            }
            client.queues[message.guild.id] = songs;
            playNext(connection);
        });
        dispatcher.on("close", ()=>{
            let songs = client.queues[message.guild.id];
            if(client.db.get(message.guild.id, "settings.loop")){
                songs.push(songs.shift());
            } else {
                songs.shift();
            }
            client.queues[message.guild.id] = songs;
            playNext(connection);
        });
    }

    playNext(connection);
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["p", "song"],
    name: "play",
    desc: "Plays a song from youtube",
    usage: "play [-s (adds to start of queue)] <search querry>",
    perm: 0
};