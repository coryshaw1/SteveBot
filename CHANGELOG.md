# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
    - Inspired by [NitroGhost/dubbot-starter](https://github.com/NitroGhost/dubbot-starter) by @NitroGhost
- Split out all commands/events into separate files
- !balance - Can now look up other's balances by `!balance @username`
- !props/!tune/!heart/!love - Can now prop/heart people not DJing by `!command @username`
    - Limited once per song

### Fixed
- Fixed !dubx command's chat output
- Fixed invalid JOIN/LEFT logs

## [0.0.1] - 2016-02-01
- Initial release