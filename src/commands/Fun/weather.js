const bent = require("bent");
const { MessageEmbed } = require("discord.js");

function getDirectionText(dir) {
    if(dir>=337.5||dir<22.5){
        return "North";
    }
    if(dir>=22.5&&dir<67.5){
        return "North-East";
    }
    if(dir>=67.5&&dir<112.5){
        return "East";
    }
    if(dir>=112.5&&dir<157.5){
        return "South-East";
    }
    if(dir>=157.5&&dir<202.5){
        return "South";
    }
    if(dir>=202.5&&dir<247.5){
        return "South-West";
    }
    if(dir>=247.5&&dir<292.5){
        return "West";
    }
    if(dir>=292.5&&dir<337.5){
        return "North-West";
    }
    return "ERROR";
}

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(!args[0]) {
        message.channel.send("You need to give a location");
    } else {
        let apikey = client.config.weatherapi;
        let location = encodeURI(args.join(" "));
        let weather;
        try {
            weather = await bent(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}&units=metric`, "GET", "json")();
        } catch(e) {
            return message.channel.send("That city doesn't exist");
        }
        let weatherEmbed = new MessageEmbed()
            .setColor("#231f9c")
            .setTitle(`Weather in ${weather.name}`)
            .setDescription(weather.weather[0].description)
            .addField(":sunny: Weather:", `${weather.weather[0].main}`)
            .addField(":thermometer: Temperature:", `${weather.main.temp}°C`)
            .addField(`${
                weather.main.feels_like > 20 ?
                    ":hot_face:" :
                    weather.main.feels_like < -10 ?
                        ":cold_face:" :
                        ":smile:"
            } Feels like:`, `${weather.main.feels_like}°C`)
            .addField(":dash: Wind speed and direction:", `${weather.wind.speed}m/s, ${getDirectionText(weather.wind.deg)}`)
            .addField("Country:", `:flag_${weather.sys.country.toLowerCase()}: ${weather.sys.country}`)
            .setThumbnail(`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
            .setFooter("Powered by openweathermap.org")
            .setTimestamp();
        message.channel.send(weatherEmbed);
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