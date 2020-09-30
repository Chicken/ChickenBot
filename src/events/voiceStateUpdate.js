module.exports = async (client, _, newState) => {
    if(newState.member.id == client.user.id) {
        newState.setSelfDeaf(true);
    }
};