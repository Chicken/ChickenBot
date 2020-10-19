const { exec } = require("child_process");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let repo = args[0] ?? "origin";
    let gitReg = /^https?:\/\/github.com\/(?:[a-z0-9-_.]+)\/(?:[a-z0-9-_.]+)\/?(?:\/tree\/(?:[a-z0-9-_.]+)\/?)?$/im;
    if(repo != "origin") {
        let result = repo.match(gitReg);
        if(result == null) {
            await message.channel.send("Invalid github repo link!");
            return;
        }
    }
    exec(`git pull ${repo} master`, async (err, stdout) => {
        if(err != null) {
            await message.channel.send(`**ERROR**\n\`\`\`js\n${err}\n\`\`\``);
            return;
        }
        if (stdout.startsWith("Already up to date.")) {
            await message.channel.send(":white_check_mark: Up to date!");
            return;
        }
        await message.channel.send(":white_check_mark: Changes pulled! Rebooting bot to apply!");
        await client.handleClose();
    });
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: ["upgrade", "pull"],
    name: "update",
    desc: "pull changes from main repo or specified link and restarting the bot",
    usage: "update [github link]",
    perm: 5
};