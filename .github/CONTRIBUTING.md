# Contributing

## Suggestions & Issues

To suggest features for the bot use the Github issue tracker.

If you believe to have found a bug in the code and think it's harmless, report it through the Github issue tracker.   
If you think that this bug might be harmful or exploitable, report it privately through email antti@antti.codes or through Discord Chicken#4127.  

## Pull requests

Contributors are welcome. Feel free to fork and submit a pull request for review.

1. Fork & clone
1. Create a new branch
1. Code away
1. Commit & push
1. Submit the pull request

## Guidelines

To make sure that your pull request gets accepted you need to follow some guidelines.  
This is not everything but a list of basic things. Think before you do.  

* Modularity is great
* No inappropriate stuff
* Follow "best practices" for javascript
* Make sure that the feature is usable by everyone
* Write the code so that it can be understood and modified in the future

## Running the bot

Running the bot shouldn't be hard for an experienced user but might give a headache for a first timer.

1. Install [Node.JS](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install) if don't have them already
1. Create an application at [Discord Developer Portal](https://discord.com/developers/applications)
1. Create a bot for the application
1. Copy the bot's token and enable all intents (Too lazy to worry about problems with intents)
1. Copy `.env.example` to `.env`
1. Fill in the necessary tokens (some commands will error out without the tokens but that will be fine for development purposes)
1. If you want to use all the commands, register/apply for the apis required and get tokens for them
1. For dashboard to work in you also need to setup redirect uris and public facing url for the web server
   * I'm going to write the instructions here someday but not now because it's unnecessary
1. Copy the `src/config.example.js` to `src/config.js`
1. Edit the config to your needs
1. Before installing dependencies you need some requirements of `better-sqlite3` and `node-canvas`
   * For `better-sqlite3` follow instructions for [Enmap](https://enmap.evie.dev/install)
   * For `node-canvas` follow instructions on their [Github](https://github.com/Automattic/node-canvas/blob/master/Readme.md#installation)
1. To use the bots music features you need to have a Lavalink node running (without is fine for development purposes)
   * You can try to find a public node for testing
   * Or run your own by using these [instructions](https://github.com/Frederikam/Lavalink#server-configuration)
1. Install dependencies with `yarn`
1. Run with `yarn dev` or start as pm2 daemon using `yarn start`
