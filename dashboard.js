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

function getAttendanceButtonStyle(type, status) {

    const basePresent = "flex: 1; background: #10b981; color: white; border: none; padding: 8px; border-radius: 6px;";
    const baseAbsent = "flex: 1; background: #ef4444; color: white; border: none; padding: 8px; border-radius: 6px;";

    if (status === "Present" && type === "Present") {
        return `${basePresent} outline: 3px solid #059669; font-weight: bold; cursor: default;`;
    }

    if (status === "Absent" && type === "Absent") {
        return `${baseAbsent} outline: 3px solid #dc2626; font-weight: bold; cursor: default;`;
    }

    if (status === "Present" || status === "Absent") {
        return `${type === "Present" ? basePresent : baseAbsent} opacity: 0.45; cursor: not-allowed;`;
    }

    return `${type === "Present" ? basePresent : baseAbsent} cursor: pointer;`;

}

function renderAttendanceButtons(classId, status) {

    const isMarked = status === "Present" || status === "Absent";

    const presentAttrs = isMarked
        ? "disabled"
        : `onclick="markClassAttendance('${classId}', 'Present', this)"`;

    const absentAttrs = isMarked
        ? "disabled"
        : `onclick="markClassAttendance('${classId}', 'Absent', this)"`;

    return `
        <button
            id="present-btn-${classId}"
            ${presentAttrs}
            style="${getAttendanceButtonStyle("Present", status)}">
            Present
        </button>
        <button
            id="absent-btn-${classId}"
            ${absentAttrs}
            style="${getAttendanceButtonStyle("Absent", status)}">
            Absent
        </button>
    `;

}

function renderAttendanceActions(classId, status) {

    return `
        <div class="attendance-actions" style="display: flex; gap: 10px; margin-top: 10px;">
            ${renderAttendanceButtons(classId, status)}
        </div>
    `;

}

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

            const attendanceStatus = cls.attendanceStatus || "Pending";

            container.innerHTML += `

                <div class="class-card">

                    <h3>${subjectName}</h3>

                    <p>${cls.startTime} - ${cls.endTime}</p>

                    <p>Room : ${cls.room}</p>

                    ${renderAttendanceActions(cls._id, attendanceStatus)}

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

async function markClassAttendance(classId, status, button) {

    const container = button.parentElement;
    const buttons = container.querySelectorAll("button");

    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
    });

    try {

        await markAttendance(classId, status);

        container.innerHTML = renderAttendanceButtons(classId, status);

    }

    catch (error) {

        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.cursor = "pointer";
        });

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
