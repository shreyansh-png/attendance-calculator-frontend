// dashboard.js - Main dashboard logic

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "login.html";
}

// Greeting

const hour = new Date().getHours();

const greeting = document.getElementById("greeting");

if (hour < 12) {

    greeting.innerText = "Good Morning 👋";

}

else if (hour < 18) {

    greeting.innerText = "Good Afternoon 👋";

}

else {

    greeting.innerText = "Good Evening 👋";

}

// =============================
// Load Profile
// =============================

async function loadProfile() {
    try {
        const profile = await getProfile();
        const user = profile.data;
        document.getElementById("studentName").innerText = user.fullName;
    }
    catch (error) {
        console.log("Profile load error:", error.message);
    }
}

// =============================
// Load Attendance
// =============================

async function loadAttendance() {

    try {

        const report = await getAttendanceReport();

        document.getElementById("overallAttendance").innerText =
            (report.data ? report.data.overallAttendance : report.overallAttendance) + "%";

    }

    catch (error) {

        console.log("Attendance load error:", error.message);

    }

}

// =============================
// Today's Timetable
// =============================

async function loadTodayClasses() {

    try {

        const timetable = await getTodayTimetable();

        const container = document.getElementById("todayClasses");

        // Holiday check
        if (timetable.holiday || (timetable.data && timetable.data.holiday)) {

            const msg = timetable.message || (timetable.data && timetable.data.message) || "Today is a Holiday";

            container.innerHTML =

                `<div class="class-card">

                    <h2>${msg}</h2>

                    <p>No classes today. Have fun!</p>

                </div>`;

            document.getElementById("todayClassCount").innerText = "0";

            return;

        }

        const classes = timetable.classes || (timetable.data && timetable.data.classes) || [];

        container.innerHTML = "";

        if (classes.length === 0) {

            container.innerHTML = `
                <div class="class-card">
                    <h3>No Classes Today</h3>
                    <p>HAVE FUN IETIANS 🎉</p>
                </div>
            `;

            document.getElementById("todayClassCount").innerText = "0";

            return;

        }

        document.getElementById("todayClassCount").innerText = classes.length;

        classes.forEach(cls => {

            const subjectName = cls.subjectId
                ? (typeof cls.subjectId === "object" ? cls.subjectId.subjectName : cls.subjectId)
                : "Unknown Subject";

            container.innerHTML += `

                <div class="class-card">

                    <h3>${subjectName}</h3>

                    <p>${cls.startTime} - ${cls.endTime}</p>

                    <p>Room : ${cls.room}</p>

                    <button
                        id="mark-btn-${cls._id}"
                        onclick="markClassAttendance('${cls._id}', this)">

                        Present

                    </button>

                </div>

            `;

        });

    }

    catch (error) {

        console.log("Timetable load error:", error.message);

        document.getElementById("todayClasses").innerHTML =
            `<p>Could not load today's classes: ${error.message}</p>`;

    }

}

// =============================
// Mark Attendance
// =============================

async function markClassAttendance(classId, button) {

    try {

        await markAttendance(classId);

        button.innerText = "✔ Present";

        button.disabled = true;

        button.style.opacity = "0.6";

    }

    catch (error) {

        alert(error.message || "Could not mark attendance.");

    }

}

// =============================
// Initial Load
// =============================

loadProfile();
loadAttendance();
loadTodayClasses();

// ===========================
// Quick Actions
// ===========================

document.getElementById("attendanceBtn").addEventListener("click", () => {

    window.location.href = "attendance.html";

});

document.getElementById("predictionBtn").addEventListener("click", () => {

    window.location.href = "prediction.html";

});

document.getElementById("timetableBtn").addEventListener("click", () => {

    window.location.href = "timetable.html";

});

document.getElementById("profileBtn").addEventListener("click", () => {

    window.location.href = "profile.html";

});


// ===========================
// Logout
// ===========================

document.getElementById("logoutBtn").addEventListener("click", async () => {

    try {

        await logoutUser();

    } catch (error) {

        console.log(error);

    }

    localStorage.clear();

    window.location.href = "login.html";

});
