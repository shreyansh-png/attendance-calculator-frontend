// cancel-class.js - Cancel class management

// Auth guard
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

// ===========================
// Form Submission
// ===========================

const cancelForm = document.getElementById("cancelForm");

cancelForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const batch = document.getElementById("batch").value;

    const branch = document.getElementById("branch").value;

    const semester = document.getElementById("semester").value;

    const section = document.getElementById("section").value;

    const day = document.getElementById("day").value;

    const classId = document.getElementById("classId").value;

    const date = document.getElementById("date").value;

    const reason = document.getElementById("reason").value.trim();

    if (!date || !reason) {
        alert("Please fill in the date and reason.");
        return;
    }

    try {

        const response = await cancelClass({

            batch: Number(batch),

            branch,

            semester: Number(semester),

            section,

            day,

            classId,

            date,

            reason

        });

        const msg = (response.data && response.data.message) ||
                    response.message ||
                    "Class cancelled successfully!";

        alert(msg);

        cancelForm.reset();

    }

    catch (error) {

        alert(error.message || "Could not cancel class.");

    }

});

// ===========================
// Load timetable classes for class selector
// based on filter fields
// ===========================

function setupClassLoader() {

    const filterFields = ["batch", "branch", "semester", "section", "day"];

    filterFields.forEach(id => {

        const el = document.getElementById(id);

        if (el) {

            el.addEventListener("change", loadTimetableClasses);

        }

    });

}

async function loadTimetableClasses() {

    const classSelect = document.getElementById("classId");

    classSelect.innerHTML = `<option value="">Loading...</option>`;

    try {

        const response = await getMyTimetable();

        const timetableData = response.data || response;

        const schedule = timetableData.schedule || timetableData;

        const day = document.getElementById("day").value;

        const dayClasses = schedule[day] || [];

        classSelect.innerHTML = `<option value="">Select Class</option>`;

        dayClasses.forEach(cls => {

            const subjectName = cls.subjectId
                ? (typeof cls.subjectId === "object" ? cls.subjectId.subjectName : cls.subjectId)
                : "Unknown Subject";

            classSelect.innerHTML += `
                <option value="${cls._id}">
                    ${subjectName} (${cls.startTime} - ${cls.endTime})
                </option>
            `;

        });

        if (dayClasses.length === 0) {
            classSelect.innerHTML = `<option value="">No classes on ${day}</option>`;
        }

    }

    catch (error) {

        classSelect.innerHTML = `<option value="">Error loading classes</option>`;

        console.log("Error:", error.message);

    }

}

setupClassLoader();