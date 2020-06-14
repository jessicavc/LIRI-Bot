//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import keys file and store it in a variable
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
// var BandsInTown = require("bandsintown");
// var OMDB = require("OMDB");
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
    
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events/?app_id=codingbootcamp")
        .then(function (response) {
            //line break to make reading results easier
            console.log("\n====================\n");
            // console.log(response);
            console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue location: " + response.data[0].venue.location + "\r\n");
            console.log("Date of the event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {

        });
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
        .then(function (data) {
            // console.log(response.data);
            //line break to make reading results easier
            console.log("\n====================\n");
            console.log("* Title: " + data.Title + "\r\n");
            console.log("* Year Released: " + data.Year + "\r\n");
            console.log("* IMDB Rating: " + data.Ratings + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + data.Ratings[1].Value + "\r\n");
            console.log("* Country Produced: " + data.Country + "\r\n");
            console.log("* Lanuage: " + data.Language + "\r\n");
            console.log("* Plot: " + data.Plot + "\r\n");
            console.log("* Actors: " + data.Actors + "\r\n");
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {

        });
};

//Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands
//Do What It Says Function
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            console.log(data);

            var randomData = data.split(",");
            liriStart(randomData[0], randomData[1]);
        }
    })
}

liriStart(appCommand, userSearch);