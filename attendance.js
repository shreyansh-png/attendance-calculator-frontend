// attendance.js — Attendance report page

// Auth guard
const token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "login.html";
}

async function loadAttendance() {

    try {

        const report = await getAttendanceReport();
        const data   = report.data || report;

        // Update overall card
        const overallEl  = document.getElementById("overallAttendance");
        overallEl.className = "";
        overallEl.innerText = data.overallAttendance + "%";

        const table    = document.getElementById("attendanceTable");
        const subjects = data.subjects || [];

        table.innerHTML = "";

        if (subjects.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;padding:40px;color:var(--gray-400);">
                        <div style="font-size:2.5rem;margin-bottom:12px;">📭</div>
                        <p>No attendance data found yet.<br>Mark attendance from the Dashboard!</p>
                    </td>
                </tr>`;
            return;
        }

        subjects.forEach(subject => {
            let present = parseInt(subject.present) || 0;
            let absent = parseInt(subject.absent) || 0;
            let total = parseInt(subject.total) || 0;
            let pct = total === 0 ? 100 : (present / total) * 100;
            
            // Round precisely to 2 decimals
            pct = Math.round(pct * 100) / 100;
            
            let badgeClass = "pct-good";
            if      (pct < 60) badgeClass = "pct-danger";
            else if (pct < 75) badgeClass = "pct-warning";

            table.innerHTML += `
                <tr>
                    <td><strong>${subject.subjectName}</strong></td>
                    <td style="color:var(--success);font-weight:600;">${present}</td>
                    <td style="color:var(--danger);font-weight:600;">${absent}</td>
                    <td>${total}</td>
                    <td><span class="badge ${badgeClass === 'pct-good' ? 'badge-success' : badgeClass === 'pct-warning' ? 'badge-warning' : 'badge-danger'}">${pct}%</span></td>
                </tr>
            `;
        });

    } catch (error) {

        if (typeof showToast === "function") {
            showToast("error", error.message || "Could not load attendance report.");
        }

        document.getElementById("attendanceTable").innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:24px;color:var(--danger);">
                    ⚠️ ${error.message}
                </td>
            </tr>`;


    }
}

loadAttendance();