const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}