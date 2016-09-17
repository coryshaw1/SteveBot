# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.0.3] - 2016-02-09
### Added
- !front @username to move @username to front of queue
- !lock/!pause @username to pause @username's queue
- !lockskip to skip the current dj and pause their queue
- !skip and all other !skip [reason]
- Commands list to readme [https://github.com/coryshaw1/DerpyBot#commands](https://github.com/coryshaw1/DerpyBot#commands)
- Add Travis CI build check [https://travis-ci.org/coryshaw1/DerpyBot](https://travis-ci.org/coryshaw1/DerpyBot)
- Add node dependency check [https://david-dm.org/coryshaw1/DerpyBot](https://david-dm.org/coryshaw1/DerpyBot)


### Changed
- !raffle can be used by Managers and higher now to manually start a raffle
- !commands now links to [https://github.com/coryshaw1/DerpyBot#commands](https://github.com/coryshaw1/DerpyBot#commands)
- Raffles will not start if the queue is empty or only contains 1 person
- DerpyBot now requires at least Node 4.3.0 due to a vulnerability

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