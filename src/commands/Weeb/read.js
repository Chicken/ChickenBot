const bent = require("bent");
const { MessageEmbed, Permissions, Util } = require("discord.js");

exports.execute = async (client, message, args) => {
    const choiceManga = args.join(" ");
    if (!choiceManga)
        return message.channel.send(
            "I can't guess what you want to read! Just ask me for something."
        );

    const { results: searchResults } = await bent(
        "GET",
        200,
        "json",
        `https://api.mangadex.org/manga?${
            message.channel.nsfw ? "" : "contentRating[]=safe&"
        }title=${encodeURIComponent(choiceManga)}`
    )();
    if (searchResults.length === 0) return message.channel.send("No manga found!");
    const mangas = searchResults
        .filter((r) => r.result === "ok")
        .map(({ data: manga }) => ({
            id: manga.id,
            title: manga.attributes.title.en ?? Object.values(manga.attributes.title)[0],
            description: (manga.attributes.description?.en ?? "").split("\n")[0],
        }));

    const selectionEmbed = new MessageEmbed()
        .setTitle("Search results")
        .setColor("#ff69b4")
        .setDescription(
            mangas.map((m, i) => `__${i + 1}__. **${m.title}**\n${m.description}`).join("\n")
        )
        .setFooter("Expires in a minute | Send number to choose or cancel to cancel");

    const response1 = await message.channel.send({ embeds: [selectionEmbed] });

    const res1 = await message.channel.awaitMessages({
        filter: (res) => res.author.id === message.author.id,
        time: 1000 * 60,
        max: 1,
    });

    response1.delete().catch(() => {});
    if (
        message.guild
            ? message.channel.permissionsFor(client.user).has(Permissions.FLAGS.MANAGE_MESSAGES)
            : false
    )
        res1.first()
            .delete()
            .catch(() => {});

    if (res1.size === 0) return message.channel.send("Oops! You forgot to choose!");
    const choiceNum = res1.first().content;
    if (choiceNum === "cancel") return message.channel.send("Cancelled.");
    if (!/^\d{1,2}$/m.test(choiceNum))
        return message.channel.send("Invalid choice! Try the command again.");
    const manga = mangas[parseInt(choiceNum, 10) - 1];
    if (!manga) return message.channel.send("Invalid choice! Try the command again.");

    let chapters = [];
    let total = null;

    while (total === null || chapters.length < total) {
        // eslint-disable-next-line no-await-in-loop
        const batch = await bent(
            "GET",
            200,
            "json",
            `https://api.mangadex.org/manga/${manga.id}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=500&offset=${chapters.length}`
        )();
        chapters = chapters.concat(
            batch.results.map(({ data: chap }) => ({
                id: chap.id,
                chapter: chap.attributes.chapter,
                title: chap.attributes.title || "No title.",
                hash: chap.attributes.hash,
                data: chap.attributes.data,
            }))
        );
        if (!total) total = batch.total;
    }

    if (chapters.length === 0) return message.channel.send("No chapters found for that manga!");

    const chapterPages = [];
    const lines = chapters.map(
        (chap) => `__${chap.chapter}__. **${Util.escapeMarkdown(chap.title.trim())}**`
    );
    const resultPerPage = 30;
    const totalPages = Math.ceil(lines.length / resultPerPage);
    for (let page = 0; page < totalPages; page += 1) {
        const txt = lines
            .slice(resultPerPage * page, resultPerPage * page + resultPerPage)
            .join("\n");
        const embed = new MessageEmbed()
            .setTitle(`Chapters | ${page + 1}/${totalPages}`)
            .setColor("#ff69b4")
            .setDescription(txt)
            .setFooter("Expires in 5 minutes | Send number to choose or cancel to cancel");
        chapterPages.push(embed);
    }

    const response2 = client.paginatedEmbed(message, chapterPages, null, 1000 * 60 * 5);

    const res2 = await message.channel.awaitMessages({
        filter: (res) => res.author.id === message.author.id,
        time: 1000 * 60 * 5,
        max: 1,
    });

    response2.then((r) => r.delete().catch(() => {}));
    if (
        message.guild
            ? message.channel.permissionsFor(client.user).has(Permissions.FLAGS.MANAGE_MESSAGES)
            : false
    )
        res2.first()
            .delete()
            .catch(() => {});

    if (res2.size === 0) return message.channel.send("Oops! You forgot to choose!");
    const choiceChap = res2.first().content;
    if (choiceChap === "cancel") return message.channel.send("Cancelled.");
    const chapter = chapters.find((c) => c.chapter === choiceChap);
    if (!chapter) return message.channel.send("Invalid chapter! Try the command again.");

    const { baseUrl } = await bent(
        "GET",
        200,
        "json",
        `https://api.mangadex.org/at-home/server/${chapter.id}`
    )();

    const imagePages = chapter.data.map((pageData, i) =>
        new MessageEmbed()
            .setTitle(`${manga.title} | Chapter ${chapter.chapter}`)
            .setColor("#ff69b4")
            .setImage(`${baseUrl}/data/${chapter.hash}/${pageData}`)
            .setFooter(`Page ${i + 1}/${chapter.data.length} | Expires in 30 minutes`)
    );

    client.paginatedEmbed(message, imagePages, null, 1000 * 60 * 30);
};

exports.data = {
    permissions: 126016,
    guildOnly: false,
    aliases: ["manga"],
    name: "read",
    desc: "Read manga from mangadex",
    usage: "read <manga>",
    perm: 0,
};
