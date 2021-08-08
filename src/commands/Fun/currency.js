const bent = require("bent");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (
        !fs.existsSync("./data/currency.json") ||
        fs.statSync("./data/currency.json").mtime < Date.now() - 1000 * 60 * 60
    ) {
        const data = await bent(
            "GET",
            200,
            "json",
            `http://data.fixer.io/api/latest?access_key=${client.config.fixerapi}`
        )();
        if (data?.success) {
            fs.writeFileSync("./data/currency.json", JSON.stringify(data.rates, null, 4));
        } else if (!fs.existsSync("data.json"))
            return message.channel.send(
                "Something went wrong fetching the latest data and no earlier data exists."
            );
    }

    const dataFile = await fs.promises.readFile("./data/currency.json", "utf-8");
    const data = JSON.parse(dataFile);

    let sum = "";
    while (!Number.isNaN(Number(args[0].replace(/,/g, ""))))
        sum += args.splice(0, 1)[0].replace(/,/g, "");
    sum = Number(sum);
    if (!args[0] || !args[1]) return message.channel.send("You're missing some arguments.");
    const from = args[0].toUpperCase();
    const to = args[1].toUpperCase();

    if (Number.isNaN(sum)) return message.channel.send("The sum you provided is not a number.");

    const valid = Object.keys(data);
    if (!valid.includes(from))
        return message.channel.send(
            `"${from}" is not a valid currency, make sure to use the 3 letter code.`
        );
    if (!valid.includes(to))
        return message.channel.send(
            `"${to}" is not a valid currency, make sure to use the 3 letter code.`
        );

    const ans = (sum * data[to]) / data[from];
    if (Number.isNaN(ans)) return message.channel.send("Something went really wrong.");

    const embed = new MessageEmbed()
        .setTitle("Currency Converter")
        .setColor("YELLOW")
        .setDescription(`${sum} ${from} in ${to} is ${Math.round(ans * 100) / 100} ${to}`)
        .setFooter("Data fetched from fixer.io")
        .setTimestamp(fs.statSync("./data/currency.json").mtime);

    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: ["convert", "curconv", "cur"],
    name: "currency",
    desc: "Convert different currencies. Uses ISO 4127 three letter codes.",
    usage: "currency <amount> <from> <to>",
    perm: 0,
};
