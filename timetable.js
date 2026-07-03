// timetable.js - Weekly timetable page

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}

async function loadTimetable() {

    try {

        const response = await getMyTimetable();

        // Handle both { data: { schedule: {...} } } and { schedule: {...} }
        const timetableData = response.data || response;

        const schedule = timetableData.schedule || timetableData;

        const container = document.getElementById("timetableContainer");

        container.innerHTML = "";

        const days = Object.keys(schedule);

        if (days.length === 0) {
            container.innerHTML = `<p>No timetable found. Please contact your administrator.</p>`;
            return;
        }

        for (const day in schedule) {

            const classes = schedule[day];

            let html = `

            <div class="day-card">

            <h2>

            ${day.toUpperCase()}

            </h2>

            `;

            if (!classes || classes.length === 0) {
                html += `<p>No classes</p>`;
            } else {

                classes.forEach(cls => {

                    const subjectName = cls.subjectId
                        ? (typeof cls.subjectId === "object" ? cls.subjectId.subjectName : cls.subjectId)
                        : "Unknown Subject";

                    html += `

                    <div class="class-card">

                    <h3>

                    ${subjectName}

                    </h3>

                    <p>

                    ${cls.startTime}
                    -
                    ${cls.endTime}

                    </p>

                    <p>

                    Room :
                    ${cls.room}

                    </p>

                    <p>

                    Teacher :
                    ${cls.teacher || "N/A"}

                    </p>

                    <p>

                    ${cls.classType || ""}

                    </p>

                    </div>

                    `;

                });

            }

            html += `</div>`;

            container.innerHTML += html;

        }

    }

    catch (error) {

        alert(error.message || "Could not load timetable.");

    }

}

loadTimetable();