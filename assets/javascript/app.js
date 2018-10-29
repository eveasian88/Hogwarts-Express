// initialize firebase
var config = {
    apiKey: "AIzaSyDF0J3mwFtUbLYc-NnnH8ra6LwJnbNGoOc",
    authDomain: "hogwartsexpress-75b44.firebaseapp.com",
    databaseURL: "https://hogwartsexpress-75b44.firebaseio.com",
    projectId: "hogwartsexpress-75b44",
    storageBucket: "",
    messagingSenderId: "456587058142",
    storageBucket: ""
};

firebase.initializeApp(config);

var dataRef = firebase.database();

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
    datetime.html(date.format('MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function () {
    datetime = $('#current-status')
    update();
    setInterval(update, 1000);
});

// capture button click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // grab values from text boxes
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainHour = moment($("#train-time").val().trim(), "MM/DD/YYYY").format("X");
    frequency = $("#frequency").val().trim();

    // first time pushed back a year to make sure it comes back before current time
    var firstTimeConverted = moment(firstTrainHour, "HH:mm").subtract(1, "years");
    console.log("FTC: " + firstTimeConverted);

    // difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    // time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // minute until train arrives
    var minutesAway = frequency - tRemainder;

    // next train
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

    // arrival time
    var nextArrival = moment(nextTrain).format("hh:mm a");

    // possible to delete this section
    var nextArrivalUpdate = function () {
        date = moment(new Date())
        datetime.html(date.format("hh:mm a"));
    }

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

    // // don't refresh the page
    return;
});

// delete function 
$("#submit").on("click", function (event) {
    event.preventDefault();

    if ($("#train-name").val().trim() === "" ||
        $("#destination").val().trim() === "" ||
        $("#train-time").val().trim() === "" ||
        $("#frequency").val().trim() === "") {

        alert("Please fill in all details to add a new train");

    } else {

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrainHour = $("#train-time").val().trim();
        frequency = $("#frequency").val().trim();

        $(".form-field").val("");

        database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            firstTrainHour: firstTrainHour,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        sessionStorage.clear();
    }

});


// firebase watcher + initial loader HINT
dataRef.ref().on("child_added", function (childSnapshot) {
    
    console.log("childSnapshot", childSnapshot.val());
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainHour);
    console.log(childSnapshot.val().frequency);

})


// HTML to reflect 
var newrow = $("<tr>");
newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

if (minToArrival < 6) {
    newrow.addClass("info");
}

$("#train-table-rows").append(newrow);


$(document).on("click", ".arrival", function () {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
});

  currentTime();

  setInterval(function() {
    window.location.reload();
    // test stops here

// handle errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// gets train IDs in an array
database.ref().once('value', function (dataSnapshot) {
    var trainIndex = 0;

    dataSnapshot.forEach(
        function (childSnapshot) {
            trainIDs[trainIndex++] = childSnapshot.key();
        }
    );
});

console.log(trainIDs);