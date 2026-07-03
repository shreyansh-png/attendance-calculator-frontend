// attendance.js - Attendance report page

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}

async function loadAttendance() {

    try {

        const report = await getAttendanceReport();

        // Handle both { overallAttendance, subjects } and { data: { overallAttendance, subjects } }
        const data = report.data || report;

        document.getElementById("overallAttendance").innerText =
            data.overallAttendance + "%";

        const table = document.getElementById("attendanceTable");

        table.innerHTML = "";

        const subjects = data.subjects || [];

        if (subjects.length === 0) {
            table.innerHTML = `<tr><td colspan="5">No attendance data found.</td></tr>`;
            return;
        }

        subjects.forEach(subject => {

            table.innerHTML += `

            <tr>

            <td>${subject.subjectName}</td>

            <td>${subject.present}</td>

            <td>${subject.absent}</td>

            <td>${subject.total}</td>

            <td>${subject.percentage}%</td>

            </tr>

            `;

        });

    }

    catch (error) {

        alert(error.message || "Could not load attendance report.");

    }

}

loadAttendance();