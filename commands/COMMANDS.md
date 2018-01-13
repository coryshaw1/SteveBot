![DerpyBot Avatar](http://i.imgur.com/p999E1u.png)

Please add an [issue](https://github.com/franciscog/DerpyBot/issues) for any suggestions, request, or bugs!

# Triggers
You can create, update, and delete a trigger using the `!trigger` command

## Creating a trigger 
**!trigger \[trigger_name\] \[trigger_text\]**    
access level: ResDJ or higher only

example
```
!trigger funnycow look at this funny cow https://i.imgur.com/rp7zs.gif
```

## Editing a trigger 
Exactly the same as creating a trigger but just use an existing trigger name    
access level: Mods only

Example:    
This example will change the `funnycow` trigger we just created
```
!trigger funnycow jokes on you, there are no funny cows
```

## Deleting a trigger 
Just:  **!trigger \[trigger_name\]**    
access level: Mods only

Example:    
This example will delete the `funnycow` trigger
```
!trigger funnycow
```

## Adding dynamic content

**%me%** - will be replaced by your user name    
**%dj%** - will be replaced by the current DJ playing    

### Trigger arguments
when you call a trigger with extra words, they effectively serve as arguments (i.e. parameters) for your trigger.

when you call a trigger, every subsequent word will be assigned a number starting at 0 in order

```
!mytrigger dude rad awesome    
^^^^^^^^^^ ^^^^ ^^^ ^^^^^^^    
trigger     0    1     2
```

then in your trigger text you place the following anywhere    
**%0%** will be replaced with "dude"    
**%1%** will be replaced with "rad"    
**%2%** will be replaced with "awesome"    
and so on, in order

`hey %0%, you are pretty %1% and %2%`    
`!mytrigger dude rad awesome`    
becomes this:  `hey dude, you are pretty rad and awesome`

you can also place the numbers in text out of order    
`hey %0%, you are pretty %2% and %1%`    
calling with arguments: `!mytrigger dude rad awesome`    
becomes this:  `hey dude, you are pretty awesome and rad`

and you can add defaults to them with the | symbol like this:    
`hey %dj%, you are pretty %0|cool%`    
no arguments: `!mytrigger`    
becomes this:  `hey currentDJperson, you are pretty cool`    

When using defaults, "me" and "dj" are reserved words act just like %me% and %dj%:

`this %0|dj% is cool`    
without arguments: `this currentDJname is cool`


# Commands

### Bot

* **!bot** - Chooses a random a response from [this array](https://github.com/FranciscoG/DerpyBot/blob/master/bot/commands/bot/bot.js#L10)
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


# Config

Here are a list of configuration items that can be toggled on/off with the `!toggle` command.

Example usage:
```
!toggle allow_multi_prop
```

All of these config items below will be reset if the bot happens to reboot, that's why the default state is listed. At some point I might try and make the changes persist. 

* **muted** -  (default: false) - Whether the bot is allowed to send chats or not    
* **allow_multi_prop** -  (default: false) - allow people to give multiple props for the same song    
* **welcomeUsers** -  (default: false) - display a welcome message to new users (default: false)    
* **autoUpvote** - (default: true) - allow bot to auto upvote every song    
* **playOnEmpty** - (default: false) - play music when the queue is empty    
* **autoskip_stuck** - (default: true) - skip a song that is stuck because it has issues    
* **recently\_played\_warning** - (default: true) - warn the room that a song in the queue was played within X amount of hours    
* **reset_points** :  (default: true) - reset all user points back to 0 at the beginning of each month    
* **hourly_leader** :  (default: true) - whether the bot should announce to the room every hour who the currently monthly leaders are