exports.execute = async (client, message, args) => {
    console.log(`${client.colors.Red}Stopping...${client.colors.Reset}`)
    await message.channel.send("Stopping the bot. Rebooting if under manager.")
    client.destroy()
    process.exit(0);
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: ["restart", "stop"],
    category: "system",
    name: "reboot",
    desc: "Reboots the bot",
    usage: "reboot",
    perm: 5
};