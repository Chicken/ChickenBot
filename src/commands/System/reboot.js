exports.execute = async (client, message) => {
    await message.channel.send("Stopping the bot. Rebooting if under process manager.");
    await client.db.close();
    await client.destroy();
    process.exit(0);
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: ["restart", "stop"],
    name: "reboot",
    desc: "Reboots the bot",
    usage: "reboot",
    perm: 5
};