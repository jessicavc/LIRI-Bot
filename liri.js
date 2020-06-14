//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import keys file and store it in a variable
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

//Variables for the arguments in LIRI
var appCommand = process.argv[2];
// console.log("Command: " + appCommand); 
// use slice function to account for user search with spaces
var userSearch = process.argv.slice(3).join(" ");
// console.log("Search: " + userSearch)

//switch statements to activate user input
function liriStart(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsInTown(userSearch);
            break;

        case "movie-this":
            getOMDB(userSearch);
            break;

        case "do-what-it-says":
            getRandom();
            break;

    }
}; 

// Spotify API function
function getSpotify(songName) {
    var spotify = new Spotify(keys.spotify);
    // console.log("Spotify Key: " + spotify); 

    if (!songName) {
        songName = "The Sign";
    };
    // console.log("No song provided defaults to: " + songName);

    spotify.search({type: "track", query: songName }, function(err, data) {
        if (err) {
            return console.log("Error occured: " + err);
        }

        // console.log("searched song data: " + data.tracks.items[0]);
        //Artist(s)
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        //song's name
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        //preview link of the song from Spotify
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n")
        //album that song is from
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

    }); 
    
};


liriStart(appCommand, userSearch);