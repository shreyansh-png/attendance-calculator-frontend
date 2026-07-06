// auth.js - handles login and registration using api.js functions

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

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const submitBtn = document.getElementById("login-btn");
        const defaultText = submitBtn.innerText;

        if (!email || !password) {

            alert("Please fill all fields.");

            return;

        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Logging in...";

        try {

            const data = await loginUser(email, password);

            // Save Token
            localStorage.setItem(
                "accessToken",
                data.data.accessToken
            );

            // Save User
            localStorage.setItem(
                "user",
                JSON.stringify(data.data.user)
            );

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        }

        catch (error) {

            alert(error.message || "Server Error. Please try again.");

            console.log(error);

            submitBtn.disabled = false;
            submitBtn.innerText = defaultText;

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

        const fullName = document.getElementById("fullName").value.trim();

        const rollNumber = document.getElementById("rollNo").value.trim();

        const academicYear = document.getElementById("batch").value;

        const email = document.getElementById("email").value.trim();

        const branch = document.getElementById("branch").value;

        const semester = document.getElementById("semester").value;

        const section = document.getElementById("section").value;

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;
        const submitBtn = document.getElementById("register-btn");
        const defaultText = submitBtn.innerText;

        if (

            !fullName ||

            !rollNumber ||

            !email ||

            !branch ||

            !semester ||

            !section ||

            !academicYear ||

            !password ||

            !confirmPassword

        ) {

            alert("Please fill all fields.");

            return;

        }

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Creating Account...";

        try {

            await registerUser({

                fullName,

                rollNumber,

                email,

                password,

                semester: Number(semester),

                branch,

                section,

                batch: Number(academicYear)

            });

            alert("Registration Successful! Please login.");

            window.location.href = "login.html";

        }

        catch (error) {

            alert(error.message || "Server Error. Please try again.");

            console.log(error);

            submitBtn.disabled = false;
            submitBtn.innerText = defaultText;

        }

    });

}