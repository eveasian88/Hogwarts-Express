// initialize firebase
var config = {
    apiKey: "AIzaSyDF0J3mwFtUbLYc-NnnH8ra6LwJnbNGoOc",
    authDomain: "hogwartsexpress-75b44.firebaseapp.com",
    databaseURL: "https://hogwartsexpress-75b44.firebaseio.com",
    projectId: "hogwartsexpress-75b44",
    storageBucket: "hogwartsexpress-75b44.appspot.com",
    messagingSenderId: "456587058142"
};
firebase.initializeApp(config);

var database = firebase.database();

// initial values
var trainName = "";
var destination = "";
var firstTrainHour = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// show current time
var datetime = null,
    date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format("MMMM Do YYYY, h:mm:ss a"));
};


$(document).ready(function () {
    datetime = $("#current-status")
    update();
    setInterval(update, 1000);
});


// capture button click
$("#submit").on("click", function (event) {
    event.preventDefault();
    // console.log("button has been clicked");

    // grab values from text boxes
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainHour = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();

    // time assumptions
    var frequency = 3;
    var firstTime = "03:30";

    // first time pushed back a year to make sure it comes back before current time
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // console.log("FTC: " + firstTimeConverted);

    // current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("Difference in time: " + diffTime);

    // time apart (remainder)
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    // minute until train arrives
    var minutesAway = frequency - tRemainder;
    // console.log("Minutes away: " + minutesAway);

    // next train
    var nextTrain = moment().add(minutesAway, "minutes");
    // console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

    // arrival time
    var nextArrival = moment(nextTrain).format("hh:mm a");


    // code for handling the push
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainHour: firstTrainHour,
        frequency: frequency,
        minutesAway: minutesAway,
        nextArrival: nextArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Your Wish Has Been Granted!");

    // empty text input
    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");

    sessionStorage.clear();

    // don't refresh the page
    return;
});

// firebase watcher + initial loader: code behaves similarly to .on("child_added")
database.ref().orderByChild("dateAdded").limitToLast(8).on("child_added", function (snapshot) {

    console.log(snapshot.val());
    console.log("Train Name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First Train: " + snapshot.val().firstTrainHour);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next Train: " + snapshot.val().nextArrival);
    console.log("Minutes Away: " + snapshot.val().minutesAway);

    // tracking time table in the future - TRIALS
    var nextArrivalUpdate = function () {
        date = moment(new Date());
        datetime.html(date.format("hh:mm a"));

        if (nextArrivalUpdate === nextTrain) {
            nextArrival = nextTrain.format("hh:mm a");
            minutesAway = nextTrain.diff(moment(), "minutes");
        }
        else {
            diffTime = moment().diff(nextTrain, "minutes");
            tRemainder = diffTime % frequency;
            minutesAway = frequency - tRemainder;
            nextArrival = moment().add(minutesAway, "m").format("hh:mm a");
        }
        console.log("minutesAway:", minutesAway);
        console.log("nextArrival:", nextArrival);
    }

    // adds information to the time table
    $("#train-table-rows").append("<tr><td>" + snapshot.val().trainName + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td class='text-center'>" + snapshot.val().frequency + "</td>" +
        "<td class='text-center'>" + snapshot.val().nextArrival + "</td>" +
        "<td class='text-center'>" + snapshot.val().minutesAway + "</td>" + "</td>" +
        "<td class='text-center'><button class='arrival btn btn-light btn-sm' data-key='" + snapshot.key + "'>x</button></td></tr>");

    index++;

    // delete function
    $(document).on("click", ".arrival", function () {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();
    });

    // handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// gets the train IDs in an array
database.ref().once('value', function (dataSnapshot) {
    key = dataSnapshot.key;
    var trainIndex = 0;

    dataSnapshot.forEach(
        function (snapshot) {
            trainIDs[trainIndex++] = snapshot.key;
        }
    );
});

console.log(trainIDs);


moment();

setInterval(function () {
    window.location.reload();
}, 60000);

// tracking time for the train table in the future but it doesn't work where i added it on the top so putting it here for now...
// var nextArrivalUpdate = function () {
//     date = moment(new Date());
//     datetime.html(date.format("hh:mm a"));

//     if (nextArrivalUpdate === nextTrain) {
//         nextArrival = nextTrain.format("hh:mm a");
//         minutesAway = nextTrain.diff(moment(), "minutes");
//     }
//     else {
//         diffTime = moment().diff(nextTrain, "minutes");
//         tRemainder = diffTime % frequency;
//         minutesAway = frequency - tRemainder;

//         nextArrival = moment().add(minutesAway, "m").format("hh:mm a");
//     }
//     console.log("minutesAway:", minutesAway);
//     console.log("nextArrival:", nextArrival);
// }