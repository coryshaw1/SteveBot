# Private Credentials

create a settings.js file in this directory with the following info

```js
module.exports = {
  'OWNER' : 'your dubtrack user name',
  'APPROVED_USERS' : [], // add trustworthy Dubtrack users here
  'USERNAME': 'login',
  'PASSWORD': 'password',
  'ROOMNAME': 'dubtrack room name',
  'SOUNDCLOUDID': 'Soundcloud app client ID',
  'YT_API' : 'YouTube API key',
  'FIREBASE' : {
    'BASEURL' : 'firebase url'
  }
};
```