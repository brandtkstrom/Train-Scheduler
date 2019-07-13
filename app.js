// Time picker for 'First Train Time' input
const timepicker = new TimePicker(["input-train-time"], {
    theme: "dark",
    lang: "en"
});
timepicker.on("change", evt => {
    console.log(evt);

    let value = `${evt.hour || "00"}:${evt.minute || "00"}`;
    evt.element.value = value;
});

// Class for holding train schedule information
class TrainScheduleItem {
    constructor(name, dest, timeFirst, frequency) {
        this.name = name;
        this.destination = dest;
        this.firstTrainTime = timeFirst;
        this.frequency = frequency;
        this.nextArrival = null;
        this.minutesAway = null;
        this.calcNextArrival();
    }

    calcNextArrival() {
        // TODO
    }

    appendNewScheduleRow(tableBodyElmt) {
        // TODO
    }
}

document.addEventListener("DOMContentLoaded", evt => {
    // Create reference to train schedule table body element
    const TABLE_BODY = document.querySelector("#train-table-body");

    // Handle events triggered when new train schedules are added to Firebase
    DB.on("child_added", data => {
        let record = data.val();
        let schedItem = new TrainScheduleItem(
            record.name,
            record.destination,
            record.firstTrain,
            record.frequency
        );
        schedItem.appendNewScheduleRow(TABLE_BODY);
    });

    // Attach event listener to submit button
    document.querySelector("#add-button").addEventListener("click", evt => {
        // Get input values
        let name = document.querySelector("#input-train-name").value.trim();
        let dest = document.querySelector("#input-train-dest").value.trim();
        let time = document.querySelector("#input-train-time").value.trim();
        let freq = parseInt(document.querySelector("#input-train-freq").value);

        // Verify correct first train time format
        if (!moment(time, "HH:mm").isValid()) {
            alert("Invalid train time. Enter time as HH:mm (e.g. 15:30).");
            evt.preventDefault();
            return;
        }

        // Add new train schedule entry to Firebase DB
        DB.push().set({
            name: name,
            destination: dest,
            firstTrain: time,
            frequency: freq
        });
    });
});
