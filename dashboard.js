// dashboard.js — Main dashboard logic

// ── Auth Guard ──
const token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "login.html";
}

// ── Greeting & Date ──
const hour     = new Date().getHours();
const greeting = document.getElementById("greeting");
const dateEl   = document.getElementById("currentDate");

if (hour < 12)      greeting.innerText = "Good Morning 👋";
else if (hour < 17) greeting.innerText = "Good Afternoon 👋";
else if (hour < 21) greeting.innerText = "Good Evening 👋";
else                greeting.innerText = "Burning Midnight Oil 🌙";

if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "short", day: "numeric"
    });
}

// ─────────────────────────────────────────────
// Load Profile
// ─────────────────────────────────────────────
async function loadProfile() {
    try {
        const profile    = await getProfile();
        const user       = profile.data;
        const nameEl     = document.getElementById("studentName");
        nameEl.className = "";
        nameEl.innerText = user.fullName || "Student";
    } catch (error) {
        console.log("Profile load error:", error.message);
    }
}

// ─────────────────────────────────────────────
// Load Attendance
// ─────────────────────────────────────────────
async function loadAttendance() {
    try {
        const report     = await getAttendanceReport();
        const pct        = report.data ? report.data.overallAttendance : report.overallAttendance;
        const attEl      = document.getElementById("overallAttendance");
        attEl.className  = "stat-value";
        attEl.innerText  = pct + "%";

        // Color coding
        if      (pct >= 75) attEl.style.color = "var(--green-600)";
        else if (pct >= 60) attEl.style.color = "var(--amber-500)";
        else                attEl.style.color = "var(--red-600)";

    } catch (error) {
        const attEl     = document.getElementById("overallAttendance");
        attEl.className = "stat-value";
        attEl.innerText = "N/A";
    }
}

// ─────────────────────────────────────────────
// Attendance Button Helpers
// ─────────────────────────────────────────────

/**
 * Build the attendance buttons HTML.
 * Using modern interactive state logic.
 */
function renderAttendanceButtons(classId, status) {
    const isPresent = status === "Present";
    const isAbsent  = status === "Absent";
    const isMarked  = isPresent || isAbsent;

    if (isMarked) {
        return `
            <div class="attendance-actions" id="actions-${classId}" style="animation: fadeIn 0.3s ease;">
                <div class="marked-state ${isPresent ? 'state-present' : 'state-absent'}">
                    <span class="badge ${isPresent ? 'badge-success' : 'badge-danger'}" style="padding: 6px 12px; font-size: 13px;">
                        <i data-lucide="${isPresent ? 'check-circle' : 'x-circle'}" style="width:16px;height:16px;"></i>
                        ${isPresent ? 'Marked Present' : 'Marked Absent'}
                    </span>
                    <button class="btn-sm btn-outline" style="margin-left:8px;" onclick="resetAttendanceState('${classId}')">
                        <i data-lucide="edit-2" style="width:12px;height:12px;"></i> Edit
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <div class="attendance-actions" id="actions-${classId}">
            <button
                id="present-btn-${classId}"
                class="att-btn present-action"
                onclick="markClassAttendance('${classId}', 'Present', this)"
            >
                <i data-lucide="check" style="width:16px;height:16px;"></i> Present
            </button>
            <button
                id="absent-btn-${classId}"
                class="att-btn absent-action"
                onclick="markClassAttendance('${classId}', 'Absent', this)"
            >
                <i data-lucide="x" style="width:16px;height:16px;"></i> Absent
            </button>
        </div>
    `;
}

// ─────────────────────────────────────────────
// Reset State for Editing
// ─────────────────────────────────────────────
window.resetAttendanceState = function(classId) {
    const actionsDiv = document.getElementById(`actions-${classId}`);
    if(actionsDiv) {
        actionsDiv.outerHTML = renderAttendanceButtons(classId, "Pending");
        if (window.lucide) window.lucide.createIcons();
    }
}

// ─────────────────────────────────────────────
// Load Today's Classes
// ─────────────────────────────────────────────
async function loadTodayClasses() {

    const container = document.getElementById("todayClasses");

    try {

        const timetable = await getTodayTimetable();

        // Holiday check
        if (timetable.holiday || (timetable.data && timetable.data.holiday)) {
            const msg = timetable.message || (timetable.data && timetable.data.message) || "Today is a Holiday 🎉";
            container.innerHTML = `
                <div class="class-card" style="border-left-color: var(--amber-500); text-align: center; padding: 32px;">
                    <div style="font-size:3rem;margin-bottom:12px;">🎉</div>
                    <h3 style="color:var(--amber-500);">${msg}</h3>
                    <p style="margin-top:6px;">No classes today — go outside and touch some grass, IETians! 🌿</p>
                </div>`;
            document.getElementById("todayClassCount").className = "stat-value";
            document.getElementById("todayClassCount").innerText = "0";
            return;
        }

        const classes = timetable.classes || (timetable.data && timetable.data.classes) || [];

        // Remove skeleton cards
        container.innerHTML = "";

        if (classes.length === 0) {
            container.innerHTML = `
                <div class="class-card" style="text-align:center; padding:32px; border-left-color:var(--green-500);">
                    <div style="font-size:3rem;margin-bottom:12px;">🥳</div>
                    <h3>No Classes Today!</h3>
                    <p style="margin-top:6px;">Free day, IETians! Your WiFi subscription to college is temporarily paused. Enjoy! 🎊</p>
                </div>`;
            document.getElementById("todayClassCount").className = "stat-value";
            document.getElementById("todayClassCount").innerText = "0";
            return;
        }

        const countEl     = document.getElementById("todayClassCount");
        countEl.className = "stat-value";
        countEl.innerText = classes.length;

        classes.forEach(cls => {

            const subjectName      = cls.subjectId
                ? (typeof cls.subjectId === "object" ? cls.subjectId.subjectName : cls.subjectId)
                : "Unknown Subject";
            const attendanceStatus = cls.attendanceStatus || "Pending";

            const card = document.createElement("div");
            card.className = "class-card";
            card.innerHTML = `
                <h3>${subjectName}</h3>
                <p><i data-lucide="clock" style="width:14px;height:14px;"></i> ${cls.startTime} – ${cls.endTime}</p>
                <p><i data-lucide="map-pin" style="width:14px;height:14px;"></i> Room: ${cls.room || "N/A"}</p>
                ${cls.teacher ? `<p><i data-lucide="user" style="width:14px;height:14px;"></i> ${cls.teacher}</p>` : ""}
                ${renderAttendanceButtons(cls._id, attendanceStatus)}
            `;

            container.appendChild(card);
        });

        // Initialize newly added lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

    } catch (error) {
        // Remove skeleton
        container.innerHTML = `
            <div class="class-card" style="text-align:center;border-left-color:var(--red-500);">
                <p style="color:var(--red-600);">⚠️ Could not load today's classes: ${error.message}</p>
            </div>`;
    }
}

// ─────────────────────────────────────────────
// Mark Attendance
// ─────────────────────────────────────────────
async function markClassAttendance(classId, status, clickedBtn) {
    const actionsDiv = clickedBtn.parentElement;
    const allBtns    = actionsDiv.querySelectorAll("button");
    const originalHtml = actionsDiv.innerHTML;

    // Loading State
    allBtns.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    clickedBtn.innerHTML = '<span class="btn-spinner"></span> Saving...';
    clickedBtn.style.opacity = '1';
    clickedBtn.style.transform = 'scale(0.98)';

    try {
        await markAttendance(classId, status);

        // Success State
        actionsDiv.outerHTML = renderAttendanceButtons(classId, status);
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Ensure overall attendance is refreshed
        loadAttendance();

        showToast("success", `Marked as ${status} successfully! ✨`);
    } catch (error) {
        // Restore State
        actionsDiv.innerHTML = originalHtml;
        if (window.lucide) window.lucide.createIcons();
        showToast("error", error.message || "Failed to mark attendance.");
    }
}

// ─────────────────────────────────────────────
// Initial Load
// ─────────────────────────────────────────────
loadProfile();
loadAttendance();
loadTodayClasses();

// ─────────────────────────────────────────────
// Quick Actions
// ─────────────────────────────────────────────
document.getElementById("attendanceBtn").addEventListener("click", () => { window.location.href = "attendance.html"; });
document.getElementById("predictionBtn").addEventListener("click", () => { window.location.href = "prediction.html"; });
document.getElementById("timetableBtn").addEventListener("click", () => { window.location.href  = "timetable.html";  });
document.getElementById("profileBtn").addEventListener("click", () => { window.location.href    = "profile.html";    });

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────
document.getElementById("logoutBtn").addEventListener("click", async () => {

    document.getElementById("logoutBtn").innerHTML = '<span class="btn-spinner"></span> Logging out…';

    try {
        await logoutUser();
    } catch (error) {
        console.log(error);
    }

    localStorage.clear();
    window.location.href = "login.html";

});
