const bent = require("bent");
const { MessageEmbed } = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    try {
        if(!args[0]) {
            message.channel.send("You need to give a location");
        } else {
            let apikey = client.config.weatherapi;
            let location = encodeURI(args.join(" "));
            let locationdecoded = decodeURI(location);
            const getApi = bent("http://api.openweathermap.org/data/2.5/weather?q=", "GET", "json", 200);
            let weather = await getApi(`${location}&appid=${apikey}&units=metric`);
            const weatherEmbed = new MessageEmbed()
                .setColor("#ff69b4")
                .setTitle(`Weather in ${locationdecoded}`)
                .addField(":sunny: Weather:", `${weather.weather[0].main}`)
                .addField(":thermometer: Temperature:", `${weather.main.temp}°C`)
                .addField(":dash: Feels like:", `${weather.main.feels_like}°C`)
                .setTimestamp();
            message.channel.send(weatherEmbed);
        }
    } catch (e) {
        message.channel.send("That city doesn't exist");
    }
};


exports.data = {
    permissions: 280576,
    guildOnly: false,
    aliases: ["forecast"],
    name: "weather",
    desc: "Weather in a place",
    usage: "weather <place>",
    perm: 0
};