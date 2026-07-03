// holiday.js - Holiday management

// Auth guard
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

const form = document.getElementById("holidayForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();

    const date = document.getElementById("date").value;

    const description = document.getElementById("description").value.trim();

    if (!title || !date) {
        alert("Please fill in the holiday title and date.");
        return;
    }

    try {

        const response = await addHoliday({

            title,

            date,

            description

        });

        const msg = (response.data && response.data.message) ||
                    response.message ||
                    "Holiday added successfully!";

        alert(msg);

        form.reset();

        loadHolidays();

    }

    catch (error) {

        alert(error.message || "Could not add holiday.");

    }

});

async function loadHolidays() {

    const container = document.getElementById("holidayList");

    container.innerHTML = "Loading...";

    try {

        const response = await getHolidays();

        // Handle both { data: [...] } and direct array
        const holidays = Array.isArray(response) ? response :
            (Array.isArray(response.data) ? response.data : []);

        container.innerHTML = "";

        if (holidays.length === 0) {
            container.innerHTML = "<p>No holidays found.</p>";
            return;
        }

        holidays.forEach(holiday => {

            container.innerHTML += `

            <div class="holiday-card">

            <h3>

            ${holiday.title}

            </h3>

            <p>

            ${holiday.date ? holiday.date.substring(0, 10) : ""}

            </p>

            <p>

            ${holiday.description || ""}

            </p>

            <button onclick="removeHoliday('${holiday._id}')">

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

async function removeHoliday(id) {

    if (!confirm("Delete this holiday?")) return;

    try {

        await deleteHoliday(id);

        loadHolidays();

    }

    catch (error) {

        alert(error.message || "Could not delete holiday.");

    }

}

loadHolidays();