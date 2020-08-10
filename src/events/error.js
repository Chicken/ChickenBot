module.exports = async (client, error) => {
    console.error(error, error.stack)
    client.users.cache.get("312974985876471810").send(error)
}