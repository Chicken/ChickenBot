// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.reply("Please choose a number of messages to purge.");
    let amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 1000) return message.reply("Please choose a number between 1 and 1000.");
    await message.delete();
    let total = 0;
    while(amount>0){
        if(amount>=100) {
            message.channel.bulkDelete(100, true);
            total += 100;
        } else {
            message.channel.bulkDelete(amount, true);
            total += amount;
        }
        amount -= 100;
    }
    message.channel.send(`Deleted ${total} messages...`).then(msg=>{
        setTimeout(() => { msg.delete(); }, 3000);
    });
};
  
exports.data = {
    permissions: 76800,
    guildOnly: true,
    aliases: [],
    name: "purge",
    desc: "Purges specific amount of messages.",
    usage: "purge <1-1000>",
    perm: 1
};