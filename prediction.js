// prediction.js - Attendance prediction page

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}

async function loadPrediction() {

    try {

        const prediction = await getAttendancePrediction();

        const container = document.getElementById("predictionContainer");

        container.innerHTML = "";

        // Handle both { data: [...] } and direct array
        const subjects = Array.isArray(prediction) ? prediction :
            (Array.isArray(prediction.data) ? prediction.data : []);

        if (subjects.length === 0) {
            container.innerHTML = `<p>No prediction data available. Please check your attendance records.</p>`;
            return;
        }

        subjects.forEach(subject => {

            let message = "";

            let className = "";

            if (subject.attendance >= 75) {

                className = "good";

                message =
                    `✅ You can miss ${subject.canMiss} more classes`;

            }

            else {

                className = "bad";

                message =
                    `❌ Attend next ${subject.needToAttend} classes to reach 75%`;

            }

            container.innerHTML += `

            <div class="prediction-card">

            <h2>${subject.subjectName}</h2>

            <p>

            Attendance :
            ${subject.attendance}%

            </p>

            <p class="${className}">

            ${message}

            </p>

            </div>

            `;

        });

    }

    catch (error) {

        alert(error.message || "Could not load prediction data.");

    }

}

loadPrediction();