

const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

document.getElementById("uploadForm")

.addEventListener("submit", async function (e) {

    e.preventDefault();

    const file = document.getElementById("timetable").files[0];

    if (!file) {

        alert("Select an Excel file");

        return;

    }

    const formData = new FormData();

    formData.append("timetable", file);

    try {

        const response = await fetch(

            "http://localhost:5000/api/v1/timetable/upload",

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

        document.getElementById("message")

        .innerText = data.message;

    }

    catch (error) {

        alert(error.message);

    }

});