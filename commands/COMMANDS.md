![DerpyBot Avatar](http://i.imgur.com/p999E1u.png)

# Commands


## Categories

### Bot

* **!bot** - Chooses a random a response from [this array](https://github.com/FranciscoG/DerpyBot/blob/master/bot/commands/bot/bot.js#L10)
* **!sayhi @username** - introduce the bot to a user
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
* **!love** - Add to current DJ's total "props" count with a message of :heart:
* **!love @username** - Add to @username's total "props" count with a message of :heart:
* **!props** - Add to current DJ's total "props" count using a message of props as :fist:
* **!props @username** - Add to @username's total "props" count using a message of props as :fist:
* **!tune** - Add to current DJ's total "props" count using a message of props as :musical_note:
* **!tune @username** - Add to @username's total "props" count using a message of props as :musical_note:
 
##### Credit Info
* **!balance** - See the amount of total "hearts" and total "props" connected to your name
* **!balance @username** - See the amount of total "hearts" and total "props" connected to @username
* **!leaders** - See the leaders of total "hearts", "props", and total "flowpoints" in the database

### Fun
* **!trigger \[trigger_name\] \[trigger_text\]** - to create a new chat trigger. Trigger won't work if it matches one of the existing commands. [MODS ONLY]
* **!cat** - Show a random cat picture or gif
* **!fact** - A random inciteful fact
* **!steve** - To honor the origin of this bot's code
* **!todayfact** - A random inciteful fact about today
* **!giphy [search text]** - Return a random giphy image (rating: P-13 or below)
* **@DerpyBot [message]** - Chat with the bot (uses Cleverbot API)

### Info
* **!commands** - Basic list of commands
* **!dubx** - Shameless plug to [sinfulBA/DubX](https://github.com/sinfulBA/DubX-Script)
* **!eta** - Gets the user's estimated time in minutes until their song plays
* **!help** - Basic list of commands
* **!lastplayed** or **!lastsong** or **!lasttrack** - Name and link of the song that just played
* **!link** - Get the current song's name and link. 
    * *Note*: Get's the actual link of the song to SoundCloud instead of the api.soundcloud..../redirect link
* **!rules** - Rules of the room

### Auto-Moderation    
* Automatically skips broken youtube links

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
