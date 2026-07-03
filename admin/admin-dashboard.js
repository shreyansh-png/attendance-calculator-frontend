const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

document.getElementById("uploadBtn")

.addEventListener("click", () => {

    window.location.href = "upload-timetable.html";

});

document.getElementById("holidayBtn")

.addEventListener("click", () => {

    window.location.href = "holiday.html";

});

document.getElementById("extraBtn")

.addEventListener("click", () => {

    window.location.href = "extra-class.html";

});

document.getElementById("cancelBtn")

.addEventListener("click", () => {

    window.location.href = "cancel-class.html";

});

document.getElementById("logoutBtn")

.addEventListener("click", () => {

    localStorage.removeItem("adminToken");

    window.location.href = "admin-login.html";

});