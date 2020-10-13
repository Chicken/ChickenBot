// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message) => {
    await message.channel.send("Stopping the bot. Rebooting if under process manager.");
    await client.handleClose();
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