var Scene = require('Scene')
var Time = require('Time')
var Networking = require('Networking')
var Diagnostics = require('Diagnostics')
var TouchGestures = require('TouchGestures')
var Textures = require('Textures')
const Materials = require('Materials')

var sceneRoot = Scene.root
    .child('Device')
    .child('Camera')
    .child('Focal Distance')

var currentScore = sceneRoot.child('currentScore')
var currentScoreText = currentScore.child('text')
var currentMatch = sceneRoot.child('currentMatch')
var noMatch = sceneRoot.child('noMatch')
var homeTeamText = currentMatch.child('home')
var awayTeamText = currentMatch.child('away')
// var currentTeam = sceneRoot.child('currentTeam').child('text')
var winningContainer = sceneRoot.child('winningContainer')
var faceTracker = sceneRoot.child('facetracker0')
var facemesh = faceTracker.child('facemesh0')
var losingContainer = facemesh.child('losingContainer')

var currentTeamBool = false // false = home, true = away
var currentMatchIndex = 0
var matches = []

var currentMatchUrl = 'https://world-cup-json.herokuapp.com/matches/current'
// var todaysMatchesUrl = 'https://world-cup-json.herokuapp.com/matches/today'
// var tomorrowsMatchesUrl = 'https://world-cup-json.herokuapp.com/matches/tomorrow'

var getCurrentMatch = function () {
    Networking.fetch(currentMatchUrl).then(function (result) {
        // Diagnostics.log(result);
        // Log result: {"status":200}

        if ((result.status >= 200) && (result.status < 300)) {
            return result.json();
        }
        // Diagnostics.log("HTTP status code " + result.status)
        throw new Error("HTTP status code " + result.status);
    }).then(function (json) {
        // Diagnostics.log(json)

        // dummy no data
        // json = []

        // dummy data
        // json = [{
        //     home_team: { country: 'england', goals: '1', code: 'ENG' },
        //     away_team: { country: 'brazil', goals: '0', code: 'BRA' }
        // }, {
        //     home_team: { country: 'japan', goals: '3', code: 'JPN' },
        //     away_team: { country: 'australia', goals: '2', code: 'AUS' }
        // }]

        // Diagnostics.log(json)

        matches = json

        if (!matches.length) {
            // Diagnostics.log('no current match!')
            // currentScore.hidden = false
            // currentMatch.hidden = false
            // faceTracker.hidden = false
            // noMatch.hidden = true

            // uncomment to put back to right
            currentScore.hidden = true
            currentMatch.hidden = true
            faceTracker.hidden = true
            noMatch.hidden = false
            // updateScore()
            // updateTeam()

            // getTodaysMatches()
            // getTomorrowsMatches()
            // gettingMatches = false
            return
        }
        noMatch.hidden = true
        currentScore.hidden = false
        currentMatch.hidden = false
        faceTracker.hidden = false

        var match = matches[currentMatchIndex]

        Diagnostics.log(match)

        updateScore()
        updateTeam()
    }).catch(function (error) {
        // Diagnostics.log("There was an issue with fetch operation: " + error);
    })
}

var updateScore = function () {
    homeTeamText.text = matches[currentMatchIndex].home_team.code
    awayTeamText.text = matches[currentMatchIndex].away_team.code

    currentScoreText.text = matches[currentMatchIndex].home_team.goals + ' ' + matches[currentMatchIndex].away_team.goals
}

Time.ms.interval(20000).subscribe(
    function (elapsedTime) {
        getCurrentMatch()
    })


var toggleTeam = function () {

    if (currentTeamBool && matches[currentMatchIndex + 1]) {
        currentMatchIndex++
        currentTeamBool = false
        updateScore()
        updateTeam()
        return
    } else if (currentTeamBool && !matches[currentMatchIndex + 1]) {
        currentMatchIndex = 0
        currentTeamBool = false
        updateScore()
        updateTeam()
        return
    } else {
        currentTeamBool = !currentTeamBool
        // Diagnostics.log('tap!' + currentTeamBool)
        // updateScore()
        updateTeam()
    }

}

var updateTeam = function () {
    // currentTeam.text = currentTeamBool ? awayTeam.country : homeTeam.country
    var team = currentTeamBool ? matches[currentMatchIndex].away_team : matches[currentMatchIndex].home_team
    var otherTeam = currentTeamBool ? matches[currentMatchIndex].home_team : matches[currentMatchIndex].away_team

    flagMat.diffuse = Textures.get(team.country.toLowerCase())

    winningContainer.hidden = !(team.goals >= otherTeam.goals)
    losingContainer.hidden = !(team.goals < otherTeam.goals)
}

// get any tap on the screen
var fullscreenTap = TouchGestures.onTap().subscribe(toggleTeam)
// var fullscreenTap = TouchGestures.onTap(sceneRoot.child('currentMatch')).subscribe(toggleTeam)

getCurrentMatch()

var flagMat = Materials.get('flag')

// var getTodaysMatches = function () {
    //     Networking.fetch(todaysMatchesUrl).then(function (result) {
    //         Diagnostics.log(result);
    //         if ((result.status >= 200) && (result.status < 300)) {
    //             return result.json();
    //         }
    //         throw new Error("HTTP status code " + result.status);
    //     }).then(function (json) {
    //         var matches = json

    //         // TODO: update a view of the data

    //         Diagnostics.log('todays matches: ' + matches);
    //     }).catch(function (error) {
    //         Diagnostics.log("There was an issue with fetch operation: " + error);
    //     })
    // }

    // var getTomorrowsMatches = function () {
    //     Networking.fetch(tomorrowsMatchesUrl).then(function (result) {
    //         Diagnostics.log(result);
    //         if ((result.status >= 200) && (result.status < 300)) {
    //             return result.json();
    //         }
    //         throw new Error("HTTP status code " + result.status);
    //     }).then(function (json) {

    //         var matches = json

    //         // TODO: update a view of the data

    //         Diagnostics.log('tomorrows matches: ' + matches);

    //     }).catch(function (error) {
    //         Diagnostics.log("There was an issue with fetch operation: " + error);
    //     })
    // }