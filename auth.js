// auth.js — handles login and registration using api.js functions

// ===========================
// Login Form
// ===========================

const loginForm = document.getElementById("login-form");

if (loginForm) {

    // If already logged in, redirect to dashboard
    if (localStorage.getItem("accessToken")) {
        window.location.href = "dashboard.html";
    }

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const submitBtn = document.getElementById("login-btn");

        if (!email || !password) {
            showToast("warning", "Please fill in all fields.");
            return;
        }

        // Loading state
        submitBtn.disabled  = true;
        submitBtn.innerHTML = '<span class="btn-spinner"></span> Logging in…';

        try {

            const data = await loginUser(email, password);

            // Save Token & User
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("user",        JSON.stringify(data.data.user));

            showToast("success", "Login successful! Redirecting…");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 900);

        } catch (error) {

            showToast("error", error.message || "Login failed. Please check your credentials.");
            submitBtn.disabled  = false;
            submitBtn.innerHTML = "Login";

        }

    });

}

// ===========================
// Register Form
// ===========================

const registerForm = document.getElementById("register-form");

if (registerForm) {

    // If already logged in, redirect to dashboard
    if (localStorage.getItem("accessToken")) {
        window.location.href = "dashboard.html";
    }

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullName        = document.getElementById("fullName").value.trim();
        const rollNumber      = document.getElementById("rollNo").value.trim();
        const academicYear    = document.getElementById("batch").value;
        const email           = document.getElementById("email").value.trim();
        const branch          = document.getElementById("branch").value;
        const semester        = document.getElementById("semester").value;
        const section         = document.getElementById("section").value;
        const password        = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const submitBtn       = document.getElementById("register-btn");

        if (!fullName || !rollNumber || !email || !branch || !semester || !section || !academicYear || !password || !confirmPassword) {
            showToast("warning", "Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            showToast("error", "Passwords do not match. Please try again.");
            return;
        }

        if (password.length < 6) {
            showToast("warning", "Password must be at least 6 characters.");
            return;
        }

        // Loading state
        submitBtn.disabled  = true;
        submitBtn.innerHTML = '<span class="btn-spinner"></span> Creating Account…';

        try {

            await registerUser({
                fullName,
                rollNumber,
                email,
                password,
                semester:  Number(semester),
                branch,
                section,
                batch: Number(academicYear)
            });

            showToast("success", "Account created! Redirecting to login…");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {

            showToast("error", error.message || "Registration failed. Please try again.");
            submitBtn.disabled  = false;
            submitBtn.innerHTML = "Create Account";

        }

    });

}