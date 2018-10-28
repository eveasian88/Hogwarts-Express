// initialize firebase
var config = {
    apiKey: "AIzaSyBb_VvgidrYsaUud7zcbTIDCthA_EfNwPo",
    authDomain: "demoproject-40b0e.firebaseapp.com",
    databaseURL: "https://demoproject-40b0e.firebaseio.com",
    projectId: "demoproject-40b0e",
    storageBucket: "demoproject-40b0e.appspot.com",
    messagingSenderId: "100672990588"
};
firebase.initializeApp(config);

var database = firebase.database();

// initial values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// show current time
var datetime = null,
    date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function () {
    datetime = $('#current-status')
    update();
    setInterval(update, 1000);
});

// capture button click
$("#add-train").on("click", function () {

    // grab values from text boxes
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();

    // first time pushed back a year to make sure it comes back before current time
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log("FTC: " + firstTimeConverted);
});
  // difference between the times

  // time apart

  // minute until train arrives

  // next train

  // arrival time

  // code for handling the push

  // empty text input

  // don't refresh the page

  // firebase watcher + initial loader HINT: this code behaves similarly to .on("child_added")

  // show only 25 latest entries

  // HTML to reflect 

