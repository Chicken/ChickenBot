module.exports = async (client, oldState, newState) => {
    if(!oldState.channel && newState.channel) return;
    if(!oldState.channel.guild.me.voice.channel) return;
    if(oldState.channel.guild.me.voice.channel.members.size>1) return;

    oldState.channel.guild.me.voice.channel.leave()
    client.db.set(oldState.channel.guild.id, [], "queue")
}