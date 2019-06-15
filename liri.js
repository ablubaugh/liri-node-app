require("dotenv").config();
//Global Variables 
var keys = require("./keys");

var axios = require("axios");
var moment = require("moment");

//Spotify Needs
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//Movie Needs
var request = require("request");
//Do-What-It-Says Needs
var fs = require("fs");
//To take in User Input
var command = process.argv[2];
var input = process.argv[3];

switch (command) {
  //Spotify Case
  case 'spotify-this-song':
    song();
    break;
  //Movie Case
  case 'movie-this':
    movie();
    break;
  //Do What It Says Case
  case 'do-what-it-says':
    followDirections();
    break;
  //Default
  default:
    console.log(`I'm sorry, I don't understand. \nYou can ask me to spotify-this-song to find information about a song. \nYou can ask me to movie-this to find information about a movie.`)
}


function song() {
  var song = '';
  if (input === undefined) {
    song = 'I Want It That Way'
  } else {
    song = input;
  }
  console.log(`--------------------`);
  console.log(`Song Information`)
  spotify.search({ type: 'track', query: song }, function (error, data) {
    if (!error) {
      console.log(`Song: ${data.tracks.items[0].name}`);
      console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
      console.log(`Album: ${data.tracks.items[0].album.name}`);
      console.log(`Preview Link: ${data.tracks.items[0].external_urls.spotify}`);
      var songData = `\nUsed spotify-this-song to find: \nArtist: ${data.tracks.items[0].artists[0].name} \nSong Name: ${data.tracks.items[0].name} \nSpotify Preview Link: ${data.tracks.items[0].external_urls.spotify} \nAlbum: ${data.tracks.items[0].album.name}\n--------------------`
      fs.appendFile('log.txt', songData, function (error) {
        if (error) throw error;
      });
    }
  });
}

function movie() {
  var movie = '';
  if (input === undefined) {
    console.log(`--------------------`);
    console.log(`If you haven't watched "Mr. Nobody," then you should!`);
    console.log(`It's on Netflix!`);
    movie = 'Mr. Nobody'
  } else {
    movie = input;
    console.log(`--------------------`);
    console.log(`Here's what I found about the movie!`);
  }
  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(`Movie Title: ${JSON.parse(body).Title}`);
      console.log(`Release Year: ${JSON.parse(body).Year}`);
      console.log(`Country: ${JSON.parse(body).Country}`);
      console.log(`Language: ${JSON.parse(body).Language}`);
      console.log(`Plot: ${JSON.parse(body).Plot}`);
      console.log(`Actor(s): ${JSON.parse(body).Actors}`);
      console.log(`--------------------`);
      var movieData = `\nUsed movie-this to find: \nTitle: ${JSON.parse(body).Title} \nYear: ${JSON.parse(body).Year} \nCountry:${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nPlot: ${JSON.parse(body).Plot} \nActor(s): ${JSON.parse(body).Actors} \n--------------------`
      fs.appendFile('log.txt', movieData, function (error) {
        if (error) throw error;
      });
    }else{
      console.log(`Something went wrong!`)
    }
  });
}

function followDirections() {
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) {
      console.log(error);
    } else {
      var dataArray = data.split(',');
      var dataCommand = dataArray[0];
      var dataInput = dataArray[1];
      console.log(`One moment please..`)
      switch (dataCommand) {
        case 'spotify-this-song':
          input = dataInput;
          song();
          break;
        case 'movie-this':
          input = dataInput;
          movie();
          break;
        default:
          console.log(`Something went wrong!`)
      }
    }
  })
}
