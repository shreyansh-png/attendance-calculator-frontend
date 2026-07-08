// admin.js - Admin login logic

const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const adminEmail = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!adminEmail || !password) {

        alert("Please fill all fields.");

        return;

    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Logging in...";

    try {

        const response = await adminLogin(adminEmail, password);

        const token = (response.data && response.data.token) || response.token;

        if (!token) {
            throw new Error("Admin token missing from login response.");
        }

        localStorage.setItem("adminToken", token);
        localStorage.removeItem("accessToken");

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        alert(error.message || "Login failed. Check your credentials.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Login";

    }

});