// upload-timetable.js - Upload timetable

// Auth guard
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

const BASE_URL_UPLOAD = "https://attendance-calculator-backend-2.onrender.com/api/v1";

document.getElementById("uploadForm")

.addEventListener("submit", async function (e) {

    e.preventDefault();

    const file = document.getElementById("timetable").files[0];

    if (!file) {

        alert("Please select an Excel file");

        return;

    }

    const formData = new FormData();

    formData.append("timetable", file);

    const messageEl = document.getElementById("message");

    messageEl.innerText = "Uploading...";

    try {

        const response = await fetch(

            `${BASE_URL_UPLOAD}/timetables/upload`,

            {

                method: "POST",

                headers: {

                    Authorization:

                    `Bearer ${adminToken}`

                },

                body: formData

            }

        );

        const data = await response.json();

        if (!response.ok) {

            messageEl.innerText = "Error: " + (data.message || "Upload failed");

        } else {

            messageEl.innerText = data.message || "Timetable uploaded successfully!";

        }

    }

    catch (error) {

        messageEl.innerText = "Error: " + error.message;

    }

});