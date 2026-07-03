// profile.js - User profile page

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}

let editMode = false;

async function loadProfile() {

    try {

        const profile = await getProfile();

        // Handle both { data: {...} } and direct object
        const user = profile.data || profile;

        document.getElementById("fullName").innerText = user.fullName || "";

        document.getElementById("email").innerText = user.email || "";

        document.getElementById("rollNumber").innerText = user.rollNumber || "";

        document.getElementById("branch").innerText = user.branch || "";

        document.getElementById("semester").innerText = user.semester || "";

        document.getElementById("section").innerText = user.section || "";

        document.getElementById("academicYear").innerText = user.academicYear || "";

    }

    catch (error) {

        alert(error.message || "Could not load profile.");

    }

}

loadProfile();

document.getElementById("editBtn").addEventListener("click", enableEdit);

function enableEdit() {

    if (editMode) return;

    editMode = true;

    const fullNameEl = document.getElementById("fullName");

    const emailEl = document.getElementById("email");

    fullNameEl.innerHTML = `
        <input
        id="newFullName"
        value="${fullNameEl.innerText}">
    `;

    emailEl.innerHTML = `
        <input
        id="newEmail"
        value="${emailEl.innerText}">
    `;

    document.getElementById("saveBtn").style.display = "inline-block";

}

document.getElementById("saveBtn").addEventListener("click", saveProfile);

async function saveProfile() {

    try {

        const fullName =
            document.getElementById("newFullName").value.trim();

        const email =
            document.getElementById("newEmail").value.trim();

        if (!fullName || !email) {
            alert("Full name and email cannot be empty.");
            return;
        }

        await updateProfile({

            fullName,

            email

        });

        alert("Profile Updated Successfully");

        editMode = false;

        location.reload();

    }

    catch (error) {

        alert(error.message || "Could not update profile.");

    }

}

// Navigate to Change Password page
document.getElementById("changePasswordBtn").addEventListener("click", () => {

    window.location.href = "changepassword.html";

});