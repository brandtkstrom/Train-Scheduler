// Firebase configuration
var firebaseConfig = {
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

const database = firebase.database();

const timepicker = new TimePicker(["input-train-time"], {
    theme: "dark",
    lang: "en"
});
timepicker.on("change", evt => {
    console.log(evt);

    let value = `${evt.hour || "00"}:${evt.minute || "00"}`;
    evt.element.value = value;
});

class TrainScheduleItem {
    constructor(name, dest, timeFirst, frequency) {
        this.name = name;
        this.destination = dest;
        this.firstTrainTime = timeFirst;
        this.frequency = frequency;
        this.nextArrival = null;
        this.minutesAway = null;
    }

    calcNextArrival() {
        // TODO
    }
}
