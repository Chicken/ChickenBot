module.exports = async (client, error) => {
    client.logger.error(`${error}\n${error.stack}`);
};