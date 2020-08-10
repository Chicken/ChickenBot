const fs = require("fs");
const readdir = require("util").promisify(fs.readdir);
module.exports = async (client) => {
    console.log(`${client.colors.Green}Starting to load commands${client.colors.Reset}`)
    const cmdFiles = await readdir("./src/commands/");
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        console.log(`${client.colors.Yellow}Trying to load command ${f.split(" ")[0]}${client.colors.Reset}`)
        try {
            let props = require(`../commands/${f}`);
            if(props.data.disabled) console.log(`${client.colors.Red}Command is disabled.${client.colors.Reset}`);
            client.commands.set(props.data.name, props)
            props.data.aliases.forEach(a=>{
                client.aliases.set(a, props.data.name)
            })
        } catch (e) {
            console.error(`${client.colors.Red}Failed to load command ${f.split(" ")[0]}\n${e.stack}${client.colors.Reset}`)
        }
    });
}