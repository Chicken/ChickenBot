const config = {
    "owner": "312974985876471810",
    "admins": ["517371142508380170"],
    "support": [],
    "token": process.env.token,
    "hostname": process.env.hostname,
    "youtube": process.env.youtube,
    "weatherapi": process.env.weatherapi,
    "thecatapi": process.env.thecatapi,
    "log": "520602366240882697",
    "defaultSettings": {
        "settings": {
            "prefix": "<",
            "log": null,
            "mod": null,
            "description": null,
            "volume": 0.75,
            "loop": false,
            "xp": false
        },
        "users": {},
        "queue": [],
        "tags": {},
        "banned": {}
    },
    "perms": [
        {
            "guildOnly": false,
            "level": 0,
            "name": "User",
            "check": ()=>{return true;}
        },
        {
            "guildOnly": true,
            "level": 1,
            "name": "Server mod",
            "check": (message, client)=>{return (message.member.roles.cache.some(r=>r.id==client.db.get(message.guild.id).settings.mod))}
        },
        {
            "guildOnly": true,
            "level": 2,
            "name": "Server Admin",
            "check": (message)=>{try{return (message.member.hasPermission("ADMINISTRATOR"))}catch(e){return false;}}
        },
        {
            "guildOnly": true,
            "level": 3,
            "name": "Server Owner",
            "check": (message)=>{return (message.author.id === message.guild.owner.id)}
        },
        {
            "guildOnly": false,
            "level": 4,
            "name": "Bot Support",
            "check": (message)=>{return (config.support.includes(message.author.id))}
        },
        {
            "guildOnly": false,
            "level": 5,
            "name": "Bot Admin",
            "check": (message)=>{return (config.admins.includes(message.author.id))}
        },
        {
            "guildOnly": false,
            "level": 6,
            "name": "Bot Owner",
            "check": (message)=>{return (message.author.id === config.owner)}
        },
    ]
};

module.exports = config;