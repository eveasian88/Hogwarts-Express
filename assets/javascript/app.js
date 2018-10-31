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

    // first time pushed back a year to make sure it comes back before current time
    var firstTimeConverted = moment(firstTrainHour, "hh:mm").subtract(1, "years");
    // console.log("FTC: " + firstTimeConverted);

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

    // don't refresh the page
    return;
});

// delete function not finished yet
// $(document).on("click", ".delete", function(){
//   var confirmDelete = confirm("Are you sure you want to cancel your wish?");

//    if (confirmDelete){
//     var entry = $(this).attr("data-index");
//     database.ref().child(trainIDs[entry]).remove();
//     location.reload();
//    } else{
//      return false;
//    }
// });


// firebase watcher + initial loader: code behaves similarly to .on("child_added")
database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (snapshot) {

    console.log(snapshot.val());

    console.log("Train Name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First Train: " + snapshot.val().firstTrainHour);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next Train: " + snapshot.val().nextArrival);
    console.log("Minutes Away: " + snapshot.val().minutesAway);

    
    // change the HTML to reflect
    // let trainRow = $("<tr>");
    // let trainName = $("<td>").text(snapshot.val().trainName);
    // let destination = $("<td>").text(snapshot.val().destination);
    // let frequency = $("<td>").text(snapshot.val().frequency);
    // let nextArrival = $("<td>").text(snapshot.val().nextArrival);
    // let minutesAway= $("<td>").text(snapshot.val().minutesAway);

    // trainRow.append(trainName);
    // trainRow.append(destination);
    // trainRow.append(frequency);
    // trainRow.append(nextArrival);
    // trainRow.append(minutesAway);

    // $("#train-table").append(trainRow);

    $("#train-table").append("<tr><td>" + snapshot.val().trainName + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + snapshot.val().frequency + " mins" + "</td>" +
        "<td>" + snapshot.val().nextArrival + "</td>" +
        "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" + "</td></tr>");

    index++;

    // add each train's data into the table (alternate version to above)
    // $("#train-table > tbody").append("<tr><td>" + trainName + "</tr><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + nextArrival + "</td></tr>");


    // handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// gets the train IDs in an array
database.ref().once('value', function (dataSnapshot) {
    var key = dataSnapshot.key;
    var trainIndex = 0;

    dataSnapshot.forEach(
        function (snapshot) {
            trainIDs[trainIndex++] = snapshot.key;
        }
    );
});

console.log(trainIDs);