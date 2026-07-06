// forgotpassword.js - Reset password without login

const forgotPasswordForm = document.getElementById("forgot-password-form");

if (forgotPasswordForm) {

    if (localStorage.getItem("accessToken")) {
        window.location.href = "dashboard.html";
    }

    forgotPasswordForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const submitBtn = document.getElementById("reset-btn");
        const defaultText = submitBtn.innerText;

        if (!email || !newPassword || !confirmPassword) {

            alert("Please fill all fields.");

            return;

        }

        if (newPassword !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Resetting...";

        try {

            await forgotPassword(email, newPassword);

            alert("Password reset successfully! Please login.");

            window.location.href = "login.html";

        }

        catch (error) {

            alert(error.message || "Could not reset password.");

            submitBtn.disabled = false;
            submitBtn.innerText = defaultText;

        }

    });

}
