const BASE_URL = "http://localhost:5000/api/v1";
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await fetch(`${BASE_URL}/users/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

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

        alert("Server Error");

        console.log(error);

    }

});

const registerForm = document.getElementById("register-form");

if (registerForm) {

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

        try {

            const response = await fetch(`${BASE_URL}/users/register`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    fullName,

                    rollNumber,

                    email,

                    password,

                    semester:Number(semester),

                    branch,

                    section,

                    academicYear

                })

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message);

                return;

            }

            alert("Registration Successful");

            window.location.href = "login.html";

        }

        catch (error) {

            alert("Server Error");

            console.log(error);

        }

    });

}