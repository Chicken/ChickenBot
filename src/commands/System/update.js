const { exec } = require("child_process");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const repo = args[0] ?? "origin";
    const branch = args[1] ?? "master";
    exec(`git pull ${repo} ${branch}`, async (err, stdout) => {
        if (err != null) {
            await message.channel.send(`**ERROR**\n\`\`\`js\n${err}\n\`\`\``);
            return;
        }
        if (/Already up to date/i.test(stdout)) {
            await message.channel.send(":white_check_mark: Up to date!");
            return;
        }
        await message.channel.send(":white_check_mark: Changes pulled! Rebooting bot to apply!");
        await client.handleClose();
    });
};

exports.data = {
    permissions: 2048n,
    guildOnly: false,
    aliases: ["upgrade", "pull"],
    name: "update",
    desc: "pull changes from main repo or specified link and restart the bot",
    usage: "update [github link]",
    perm: 5,
};
