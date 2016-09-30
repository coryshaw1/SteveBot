![DerpyBot Avatar](http://i.imgur.com/p999E1u.png)
# DerpyBot 

[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/franciscog/DerpyBot/blob/master/LICENSE)
![build](https://travis-ci.org/FranciscoG/DerpyBot.svg)

A Dubtrack Bot using DubAPI

[List of commands](#commands)

## Requirements
1. Node >= 4.0.0

## Installation

*Note* - Windows 10 users may need to `npm install --global --production windows-build-tools` first

1. `npm install`
2. Create a new folder off the root of the repo called `private`
3. Create a new app in Firebase and export the service account credentials as json, rename it to `serviceAccountCredentials.json` and place it inside the private folder. It's in the Permissions settings somewhere.  Firebase Console for your project -> Permissions -> Service Accounts -> Create Service Account,  then follow the steps, give it "project -> editor" permissions, then download and rename the JSON it provides.
4. Create `settings.js` using `example-settings.js`, replacing each variable with your credentials and place that inside the `private` folder as well
3. `node index`

## Thanks
* [anjanms/DubAPI](https://github.com/anjanms/DubAPI) by [@anjanms](https://github.com/anjanms)
* [NitroGhost/dubbot-starter](https://github.com/NitroGhost/dubbot-starter) by [@NitroGhost](https://github.com/NitroGhost)
* And most important, [coryshaw1/SteveBot](https://github.com/coryshaw1/SteveBot) by [@coryshaw1](https://github.com/coryshaw1)

# Commands
# List of commands can be found [here](http://franciscog.com/DerpyBot/commands/)

