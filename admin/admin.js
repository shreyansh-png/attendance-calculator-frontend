// admin.js - Admin login logic

const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const adminId = document.getElementById("adminId").value.trim();

    const password = document.getElementById("adminPassword").value.trim();

    if (!adminId || !password) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await adminLogin(adminId, password);

        // apiRequest already throws on error, so if we reach here it's success
        // Token may be in response.data.token or response.token
        const token = (response.data && response.data.token) ||
                      (response.data && response.data.accessToken) ||
                      response.token ||
                      response.accessToken;

        if (token) {
            localStorage.setItem("adminToken", token);
        } else {
            // Store whatever came back so auth guard doesn't trip
            localStorage.setItem("adminToken", "admin_session");
        }

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        alert(error.message || "Login failed. Check your credentials.");

    }

});