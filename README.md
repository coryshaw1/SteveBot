![DerpyBot Avatar](http://i.imgur.com/p999E1u.png)
# DerpyBot 

[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/franciscog/DerpyBot/blob/master/LICENSE)

A Dubtrack Bot using DubAPI

[List of commands](#commands)

## Requirements
1. Node >= 4.0.0

## Installation

*Note* - Windows 10 users may need to `npm install --global --production windows-build-tools` first

1. `npm install`
2. Create a new folder off the root of the repo called `private`
3. Create a new app in Firebase and export the service account credentials as json, rename it to `serviceAccountCredentials.json` and place it inside the private folder. It's in the Permissions settings somewhere.  It was hard to find and I don't remember exactly now but I'll find out and edit this later
4. Create `settings.js` using `example-settings.js`, replacing each variable with your credentials and place that inside the `private` folder as well
3. `node index`

## Thanks
* [anjanms/DubAPI](https://github.com/anjanms/DubAPI) by [@anjanms](https://github.com/anjanms)
* [NitroGhost/dubbot-starter](https://github.com/NitroGhost/dubbot-starter) by [@NitroGhost](https://github.com/NitroGhost)
* And most important, [coryshaw1/SteveBot](https://github.com/coryshaw1/SteveBot) by [@coryshaw1](https://github.com/coryshaw1)

# [Commands](#commands)
Below are the list of commands that have been implemented.
## Categories

### Bot

* **!bot** - Bot responds with "I'm still here"
* **!ping** - Bot responds with "Pong!"
* **!pong** - Bot responds with "Ping!"
* **!thanks** - Bot responds with "You're welcome!"
* **!v** or **!ver** or **!version** - Bot responds with "Version: [*version number*]"

### Credits

##### Adding Credits
*Adding credits to a user is limited to one time per song.*
* **!flowpoint** - Add to current DJ's total "flowpoints" count using a message of flow as :ocean:
* **!flowpoint @username** - Add to @username's total "flowpoints" count using a message of flow as :ocean:
* **!fire @username** - Add to @username's total "props" count using a message of props as :fire:
* **!love** - Add to current DJ's total "hearts" count :heart:
* **!love @username** - Add to @username's total "hearts" count :heart:
* **!props** - Add to current DJ's total "props" count using a message of props as :fist:
* **!props @username** - Add to @username's total "props" count using a message of props as :fist:
* **!tune** - Add to current DJ's total "props" count using a message of props as :musical_note:
* **!tune @username** - Add to @username's total "props" count using a message of props as :musical_note:
 
##### Credit Info
* **!balance** - See the amount of total "hearts" and total "props" connected to your name
* **!balance @username** - See the amount of total "hearts" and total "props" connected to @username
* **!leaders** - See the leaders of total "hearts", "props", and total "flowpoints" in the database

### Fun
* **!cat** - Show a random cat picture or gif
* **!fact** - A random inciteful fact
* **!steve** - To honor the origin of this bot's code
* **!todayfact** - A random inciteful fact about today

### Info
* **!commands** - Basic list of commands
* **!dubx** - Shameless plug to [sinfulBA/DubX](https://github.com/sinfulBA/DubX-Script)
* **!eta** - Gets the user's estimated time in minutes until their song plays
* **!help** - Basic list of commands
* **!lastplayed** or **!lastsong** or **!lasttrack** - Name and link of the song that just played
* **!link** - Get the current song's name and link. 
    * *Note*: Get's the actual link of the song to SoundCloud instead of the api.soundcloud..../redirect link
* **!rules** - Rules of the room

### Moderation
##### For Mods and higher
* **!front @username** - Move @username to the front of the queue
* **!lock @username** - Lock/Pause @username's queue from playing
* **!lockskip** - Skip the current DJ, and lock/pause their queue. Useful for DJs that are AFK and continue to requeue
* **!pause @username** - Lock/Pause @username's queue from playing

##### For Resident DJs and higher
* **!skip** - Skip the current song without reason or message using a reason of (broke, nsfw, op, theme, troll, and more to come) can leave blank if just want to skip without reason
* **!skip broke** or **!skip broken** - Skip the current song giving a reason that the song/video no longer exists or is unavailable in all countries 
* **!skip nsfw** - Skip the current song giving a reason that the song/video is not safe for a work environment
* **!skip op** - Skip the current song giving a reason that the song/video is overplayed and banned from the room
* **!skip troll** - Skip the current song giving a reason that the song/video is trolling, *this also then kicks the DJ*


Much more to come, and suggestions are welcome! Please add an [issue](https://github.com/franciscog/DerpyBot/issues) for any requests or bugs!
