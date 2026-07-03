// changepassword.js - Change password page

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}

const form = document.getElementById("passwordForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const verificationCode =
        document.getElementById("verificationCode").value.trim();

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (!verificationCode) {

        alert("Please enter the verification code.");

        return;

    }

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match");

        return;

    }

    if (newPassword.length < 6) {

        alert("Password must be at least 6 characters.");

        return;

    }

    try {

        await changePassword({

            verificationCode,

            newPassword

        });

        alert("Password Changed Successfully");

        window.location.href = "profile.html";

    }

    catch (error) {

        alert(error.message || "Could not change password.");

    }

});