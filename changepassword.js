const form = document.getElementById("passwordForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const verificationCode =
    document.getElementById("verificationCode").value.trim();

    const newPassword =
    document.getElementById("newPassword").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if(newPassword !== confirmPassword){

        alert("Passwords do not match");

        return;

    }

    try{

        await changePassword({

            verificationCode,

            newPassword

        });

        alert("Password Changed Successfully");

        window.location.href="profile.html";

    }

    catch(error){

        alert(error.message);

    }

});