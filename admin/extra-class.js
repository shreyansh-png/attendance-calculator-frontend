// extra-class.js - Extra class management

// Auth guard
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

async function loadSubjects() {

    try {

        const response = await getSubjects();

        const select = document.getElementById("subjectId");

        select.innerHTML =
            `<option value="">Select Subject</option>`;

        // Handle both { data: [...] } and direct array
        const subjects = Array.isArray(response) ? response :
            (Array.isArray(response.data) ? response.data : []);

        subjects.forEach(subject => {

            select.innerHTML += `

            <option value="${subject._id}">

            ${subject.subjectCode}

            -

            ${subject.subjectName}

            </option>

            `;

        });

    }

    catch (error) {

        console.log("Could not load subjects:", error.message);

    }

}

loadSubjects();

const form = document.getElementById("extraClassForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const response = await addExtraClass({

            batch: Number(document.getElementById("batch").value),

            branch: document.getElementById("branch").value,

            semester: Number(document.getElementById("semester").value),

            section: document.getElementById("section").value,

            subjectId: document.getElementById("subjectId").value,

            teacher: document.getElementById("teacher").value,

            room: document.getElementById("room").value,

            date: document.getElementById("date").value,

            startTime: document.getElementById("startTime").value,

            endTime: document.getElementById("endTime").value,

            classType: document.getElementById("classType").value

        });

        const msg = (response.data && response.data.message) ||
                    response.message ||
                    "Extra class added successfully!";

        alert(msg);

        form.reset();

        loadSubjects();

        loadExtraClasses();

    }

    catch (error) {

        alert(error.message || "Could not add extra class.");

    }

});

async function loadExtraClasses() {

    const container = document.getElementById("extraClassList");

    container.innerHTML = "Loading...";

    try {

        const response = await getExtraClasses();

        // Handle both { data: [...] } and direct array
        const extraClasses = Array.isArray(response) ? response :
            (Array.isArray(response.data) ? response.data : []);

        container.innerHTML = "";

        if (extraClasses.length === 0) {
            container.innerHTML = "<p>No extra classes found.</p>";
            return;
        }

        extraClasses.forEach(extra => {

            const subjectName = extra.subjectId
                ? (typeof extra.subjectId === "object" ? extra.subjectId.subjectName : extra.subjectId)
                : "Unknown Subject";

            container.innerHTML += `

            <div class="holiday-card">

            <h3>

            ${subjectName}

            </h3>

            <p>

            ${extra.date ? extra.date.substring(0, 10) : ""}

            </p>

            <p>

            ${extra.startTime}

            -

            ${extra.endTime}

            </p>

            <button
            onclick="removeExtraClass('${extra._id}')">

            Delete

            </button>

            </div>

            `;

        });

    }

    catch (error) {

        container.innerHTML = `<p>Error: ${error.message}</p>`;

    }

}

async function removeExtraClass(id) {

    if (!confirm("Delete Extra Class?")) return;

    try {

        await deleteExtraClass(id);

        loadExtraClasses();

    }

    catch (error) {

        alert(error.message || "Could not delete extra class.");

    }

}

loadExtraClasses();