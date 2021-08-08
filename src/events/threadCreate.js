module.exports = async (_, thread) => {
    await thread.join();
};
