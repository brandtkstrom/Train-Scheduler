// Stores current train schedule items
const SCHEDULES = [];

// Time picker for 'First Train Time' input
const timepicker = new TimePicker(["input-train-time"], {
    theme: "dark",
    lang: "en"
});
timepicker.on("change", evt => {
    let value = `${evt.hour || "00"}:${evt.minute || "00"}`;
    evt.element.value = value;
});

// Updates the current time displayed
function updateCurrentTime() {
    let now = moment();
    let time = now.format("dddd, MMM. Do YYYY, h:mm:ss A");
    document.querySelector("#current-time").innerText = time;

    // Every minute, update arrival times
    if (now.second() === 0) {
        SCHEDULES.forEach(schedule => {
            // Get table row for shedule
            let row = document.querySelector(`#${schedule.key}`);
            if (!row) {
                return;
            }

            // If found, recalc arrival times
            schedule.calcNextArrival();

            // Get next arrival table data element
            let tdNextArrival = row.querySelector("td.next-arrival");
            if (tdNextArrival) {
                tdNextArrival.innerText = schedule.nextArrival;
            }

            // Get minutes away table data element
            let tdMinsAway = row.querySelector("td.mins-away");
            if (tdMinsAway) {
                tdMinsAway.innerText = schedule.minutesAway;
            }
        });
    }
}

// Class for holding train schedule information
class TrainScheduleItem {
    constructor(key, name, dest, timeFirst, frequency) {
        this.key = key;
        this.name = name;
        this.destination = dest;
        this.firstTrainTime = timeFirst;
        this.frequency = frequency;
        this.nextArrival = null;
        this.minutesAway = null;
        this.calcNextArrival();
    }

    calcNextArrival() {
        let now = moment();
        let firstTrain = moment(this.firstTrainTime, "HH:mm");
        firstTrain.date(now.date());

        if (firstTrain.hour() < now.hour()) {
            firstTrain.add(1, "d");
        }

        let timeDiffMins = Math.abs(now.diff(firstTrain, "minutes")) + 1;
        console.log(timeDiffMins);

        let minsPerDay = 60 * 24;
        let days = Math.floor(this.frequency / minsPerDay);

        this.minutesAway = days * minsPerDay + (timeDiffMins % this.frequency);
        this.nextArrival = moment()
            .add(this.minutesAway, "m")
            .format("hh:mm A");
    }

    appendNewScheduleRow(tableBodyElmt) {
        let row = document.createElement("tr");
        row.setAttribute("id", this.key);

        let tdName = document.createElement("td");
        tdName.innerText = this.name;
        let tdDest = document.createElement("td");
        tdDest.innerText = this.destination;
        let tdFreq = document.createElement("td");
        tdFreq.innerText = this.frequency;
        let tdNextArrival = document.createElement("td");
        tdNextArrival.innerText = this.nextArrival;
        tdNextArrival.className = "next-arrival";
        let tdMinsAway = document.createElement("td");
        tdMinsAway.innerText = this.minutesAway;
        tdMinsAway.className = "mins-away";

        row.append(tdName, tdDest, tdFreq, tdNextArrival, tdMinsAway);

        tableBodyElmt.append(row);
    }
}

document.addEventListener("DOMContentLoaded", evt => {
    // Set current time
    updateCurrentTime();

    // Create reference to train schedule table body element
    const TABLE_BODY = document.querySelector("#train-table-body");

    // Handle events triggered when new train schedules are added to Firebase
    DB.on("child_added", data => {
        let record = data.val();
        let schedItem = new TrainScheduleItem(
            data.key,
            record.name,
            record.destination,
            record.firstTrain,
            record.frequency
        );
        schedItem.appendNewScheduleRow(TABLE_BODY);

        SCHEDULES.push(schedItem);
    });

    // Attach event listener to submit button
    document.querySelector("#add-button").addEventListener("click", evt => {
        // Get input values
        let name = document
            .querySelector("#input-train-name")
            .value.trim()
            .toLowerCase();
        let dest = document
            .querySelector("#input-train-dest")
            .value.trim()
            .toLowerCase();
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

    // Update current time every second
    setInterval(updateCurrentTime, 1000);
});
