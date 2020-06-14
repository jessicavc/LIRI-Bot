//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import keys file and store it in a variable
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
const {
    response
} = require("express");

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

    //line break to make reading results easier
    console.log("\n====================\n")

    spotify.search({
        type: "track",
        query: songName
    }, function (err, data) {
        if (err) {
            return console.log(err);
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

//BIT API function
function getBandsInTown(artist) {
    var artist = userSearch;
    var bandQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(bandQueryUrl)
        .then(function (repsonse) {
            //line break to make reading results easier
            console.log("\n====================\n");
            console.log(response);
            console.log("Name of the venue: " + response.data.venue.name + "\r\n");
            console.log("Venue location: " + response.data.venue.location + "\r\n");
            console.log("Date of the event: " + moment(repsonse.data.datetime).format("MM-DD-YYYY") + "\r\n");
        })
};

//OMDB API function
function getOMDB(movie) {
    // console.log("Movie: " + movie);
    if (!movie) {
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?i=" + movie + "&y=&plot=short&tt3896198&apikey=4451031a"
    // console.log(movieQueryUrl);

    axios.request(movieQueryUrl)
        .then(function (repsonse) {
            // console.log(response.data);
            //line break to make reading results easier
            console.log("\n====================\n");
            console.log("* Title: " + response.data.Title + "\r\n");
            console.log("* Year Released: " + response.data.Year + "\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("* Country Produced: " + response.data.Country + "\r\n");
            console.log("* Lanuage: " + response.data.Language + "\r\n");
            console.log("* Plot: " + response.data.Plot + "\r\n");
            console.log("* Actors: " + response.data.Actors + "\r\n");
        })
}


liriStart(appCommand, userSearch);