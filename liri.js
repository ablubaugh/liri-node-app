require(".env").configt();

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);