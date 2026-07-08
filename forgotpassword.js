// forgotpassword.js — Reset password without login

const forgotPasswordForm = document.getElementById("forgot-password-form");

if (forgotPasswordForm) {

    if (localStorage.getItem("accessToken")) {
        window.location.href = "dashboard.html";
    }

    forgotPasswordForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email           = document.getElementById("email").value.trim();
        const newPassword     = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const submitBtn       = document.getElementById("reset-btn");

        if (!email || !newPassword || !confirmPassword) {
            showToast("warning", "Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("error", "Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            showToast("warning", "Password must be at least 6 characters.");
            return;
        }

        submitBtn.disabled  = true;
        submitBtn.innerHTML = '<span class="btn-spinner"></span> Resetting…';

        try {

            await forgotPassword(email, newPassword);

            showToast("success", "Password reset successfully! Redirecting to login…");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {

            showToast("error", error.message || "Could not reset password. Please try again.");
            submitBtn.disabled  = false;
            submitBtn.innerHTML = "Reset Password";

        }

    });

}
