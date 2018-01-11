# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

The Commands of the bot are its API so here's how it will adhere to Semantic Versioning:    
**MAJOR** - Changing/removing existing bot commands breaking how they previously functioned (incompatible API changes)     
**MINOR** - Adding new commands or functionality that won't affect or break existing ones    
**PATCH** - Bug fixes, code improvements (backwards-compatible bug fixes)

## [1.18.0] - 2018-01-10
## Added
- trigger append/concat with `+=` like this `!mytrigger += more trigger text`
- add trigger parameters using %n% (starting at 0) string interpolation
- added verification system ("are you sure you want to do X? y/n")

## [1.17.1] - 2018-01-05
## Fixed
Better error detection and implemented a rate limit queueing system for the chats, hopeully fixing [issue 38](https://github.com/FranciscoG/DerpyBot/issues/38). 

## [1.17.0] - 2017-12-11
### Added
- !dog - returns random dog image. [issue 33](https://github.com/FranciscoG/DerpyBot/issues/33)

## Changed
- lowered the "you have a song in the queue already played" warning time to 8 hours - [issue 35](https://github.com/FranciscoG/DerpyBot/issues/35)    
- disabled !plays, !firstplay, !lastplay because they were broken - [issue 32](https://github.com/FranciscoG/DerpyBot/issues/32)

## [1.16.2] - 2017-07-13
### Changed
- fixed song warning [issue](https://github.com/FranciscoG/DerpyBot/issues/20)

## [1.16.1] - 2017-05-02
### Changed
- fixed random when it returns triggers with %me% or %dj% to properly swap those out

## [1.16.0] - 2017-05-02
### Added
- !random - returns a random trigger and its name
- !search - fuzzy search trigger names

## [1.15.0] - 2017-02-24
### Changed
- fixed cleverbot... until they decide to change things again :-/
- ResidentDJs can now **only** create triggers.

### Added
- added !lasttrigger that shows the most recently updated/created trigger
- bot @metions the owner on reconnect if owner is in the room
- bot greets the owner when they enter the room

## [1.14.0] - 2017-02-16
### Changed
- disabled cleverbot for now until their api issues are resolved
- added new cleverbot api key in settings
- deleted hardcoded !dubx, going to make it a trigger

## [1.13.2] - 2017-02-06
### Changed
- Minor internal changes to logging
- trigger add or update now deletes the chat messages used to create it
- made all triggers lowercase
- removed unessecary environment variable

## [1.13.1] - 2017-01-20
### Changed
- fixed issue with updub event file causing issue during event

## [1.13.0] - 2017-01-19
### Added
- created a config setting to turn on/off saving songs to a playlist
- add new dubapi extension to get user queue
### Changed
- fixed !urban no results bug
- updated third party cleverbot lib
- updating trigger internals

## [1.12.1] - 2017-01-04
### Changed
- fixed the queuePlaylist issue error (disabled really)
- updated dubapi to 1.6.5

## [1.12.0] - 2016-12-16
### Added
- new command `!urban` to search urban dictionary

## [1.11.1] - 2016-12-15
### Added
- added "unrecognized command" response

## [1.11.0] - 2016-12-13
### Added
- `!dj [stop]` command which makes the bot join or leave the queue
- bot extention to shuffle playlist
- `!shuffleplaylist` or `!sp` to shuffle bot's playlist
- bot jumps into the queue when there are 0 DJs

## [1.10.0] - 2016-12-12
### Changed
- updating internals to use firebase more effeciently
- fixed the order of !leaders
- improved how YouTube region restrictions are announced.  Now it just adds a link
- changed lastplay messaging for tracks that haven't been played before

### Added
- Announce new users under 20 dubs that join the queue
- Added monthly leaderboard tracking

## [1.9.0] - 2016-12-07
### Added
- now tracking song stats for all songs
- new command: "!lastplay" shows who was the last person to play current song
- new command: "!firstplay" shows who was the first person to play current song
- new command: "!plays" shows total number of plays for the current song

## [1.8.1] - 2016-12-01
### Changed
- "+prop" & "+flow" now still show the trigger even if already gave a point

## [1.8.0] - 2016-11-30
### Added
- extend dubapi to add abiliy to add song to a playlist
- extend dubapi to add abiliy to get a list of all its own playlists
- Added new configurations:  playlistID, playlistName, playOnEmpty
- bot now saves the previously played song to a playlist if it wasn't skipped
- updated !source to include the new metada for triggers if they exist

## [1.7.0] - 2016-11-29
### Added
- added new "!source" command that shows you who created or updated a trigger
- added more metadata to when a trigger is created or updated

## [1.6.1] - 2016-11-29
### Changed
- updated Cleverbot
- update Firebase to use their new admin module

## [1.6.0] - 2016-11-23
### Added
- "+prop" at the very end of any trigger and it will add a prop point along with the trigger text (for current DJ only)
- "+flow" at the very end of any trigger will add a flowpoint to the current DJ only

## [1.5.0] - 2016-10-21
### Added
- recently played songs are now checked when anyone joins the queue instead of just when current song is playing

## [1.4.4] - 2016-10-20
### Changed
- removing steve command (no one cares about this so I'm treating like patch lol)
- moved bot name to a config setting
- removed commas from youtube country flags

## [1.4.3] - 2016-10-19
### Changed
- fixing history bug
- added moment.js

## [1.4.2] - 2016-10-14
### Changed
- bug fixing

## [1.4.1] - 2016-10-14
### Changed
- fixed the history bug that was vexxing me

## [1.4.0] - 2016-10-14
### Added
- new admin command to refresh history

### Changed
- fix another bug with new history check

## [1.3.1] - 2016-10-14
### Changed
- fix bug with new history check

## [1.3.0] - 2016-10-13
### Added
- Added Cleverbot integration. Chat with cleverbot by using `@derpybot [your message]`
- Added Recently played warning

### Changed
- update usernames on logUser

## [1.2.2] - 2016-10-06
### Changed
- added approved users for !admin commands

## [1.2.1] - 2016-10-06
### Changed
- bug fixes

## [1.2.0] - 2016-10-05
### Added
- added more !admin commands

### Changed
- bug fixes

## [1.1.0] - 2016-10-05
note:  The previous release (0.1.0) should have been a 1.0.0 release because it had MAJOR changes that broke previous functionality so I'm going to jump this relase to 1.1.0.

### Changed
- create separate gh-pages for commands
- code improvements
- added !admin reconnect command

## [0.1.0] - 2016-09-30
### Added
- !flowpoint, !flowpoint @username
- Loaded in all the previous chat triggers from Mixerbot
- !trigger, add/update/del triggers (mod only)
- !sayhi @[username]
- !giphy [search text]
- youtube broken link auto skip
- bot notifies chat of youtube region registriction
- !admin, adding some admin commands, right now it only can restart (owner of bot only)

### Changed
- Stevebot became DerpyBot
- Updated Readme
- Switched from using MongoDB to Firebase
- Disabled Raffles
- Lots of Code improvements
- Added more responses to !bot
- changed the response to !steve
- removed !boo
- removed !chuck
- removed !missuniverse
- removed !meh
- got rid of some undocumented and unnessecary credit related commands
- made !help and !commands the same (both do !commands)
- moved !heart points to incrememnt props, no more separate !heart points

-------------------

## Change Log for previous SteveBot

## [0.0.3] - 2016-02-09
### Added
- !front @username to move @username to front of queue
- !lock/!pause @username to pause @username's queue
- !lockskip to skip the current dj and pause their queue
- !skip and all other !skip [reason]
- Commands list to readme [https://github.com/coryshaw1/stevebot#commands](https://github.com/coryshaw1/stevebot#commands)
- Add Travis CI build check [https://travis-ci.org/coryshaw1/stevebot](https://travis-ci.org/coryshaw1/stevebot)
- Add node dependency check [https://david-dm.org/coryshaw1/stevebot](https://david-dm.org/coryshaw1/stevebot)


### Changed
- !raffle can be used by Managers and higher now to manually start a raffle
- !commands now links to [https://github.com/coryshaw1/stevebot#commands](https://github.com/coryshaw1/stevebot#commands)
- Raffles will not start if the queue is empty or only contains 1 person
- stevebot now requires at least Node 4.3.0 due to a vulnerability

### Fixed
- Fixed !fire chat output type
- Fixed bug where credits could be given to the same user using the @ parameter of the command
- Fixed bug where users that heart/love were being added to users that propped array, and couldn't heart during a song they propped
- Fixed bug where Steve could potentially kick himself (Just like during Miss Universe)

## [0.0.2] - 2016-02-03
### Added
- !commands/!help - Outputs some starter commands
- !fire - Same as !props or !tune with a different message
- !myfire/!myprops/!mytunes/!myhearts/!mylove - Output users number of flames
- !steve/!missuniverse - A couple jabs at who this bot is named after
- Added Jethro logger
    - Use with `bot.log`
- Added this file!

### Changed
- Completely restructured and refactored
    - Inspired by [NitroGhost/dubbot-starter](https://github.com/NitroGhost/dubbot-starter) by [@NitroGhost](https://github.com/NitroGhost)
- Split out all commands/events into separate files
- !balance - Can now look up other's balances by `!balance @username`
- !props/!tune/!heart/!love - Can now prop/heart people not DJing by `!command @username`
    - Limited once per song

### Fixed
- Fixed !dubx command's chat output
- Fixed invalid JOIN/LEFT logs

## [0.0.1] - 2016-02-01
- Initial release