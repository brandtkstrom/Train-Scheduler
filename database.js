// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvUZSoG3haIdBDElz8_3DDZiq79XjjiJY",
    authDomain: "bks-train-schedule.firebaseapp.com",
    databaseURL: "https://bks-train-schedule.firebaseio.com",
    projectId: "bks-train-schedule",
    storageBucket: "bks-train-schedule.appspot.com",
    messagingSenderId: "66666459521",
    appId: "1:66666459521:web:654b1dc74df5abbf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const DB = firebase.database().ref("schedule");

DB.RemoveSchedule = function(id) {
    firebase
        .database()
        .ref("schedule/" + id)
        .remove();
};

DB.AddSchedule = function(name, dest, time, freq) {
    DB.push().set({
        name: name,
        destination: dest,
        firstTrain: time,
        frequency: freq
    });
};
