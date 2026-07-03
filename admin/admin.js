const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const adminId = document.getElementById("adminId").value.trim();

    const password = document.getElementById("adminPassword").value.trim();

    try {

        const response = await adminLogin(adminId, password);

        if (!response.ok) {

            alert(response.data.message);

            return;

        }

        localStorage.setItem(

            "adminToken",

            response.data.token

        );

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

});