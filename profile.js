const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}
let editMode = false;
async function loadProfile() {

    try {

        const profile = await getProfile();

        const user = profile.data;

        document.getElementById("fullName").innerText = user.fullName;

        document.getElementById("email").innerText = user.email;

        document.getElementById("rollNumber").innerText = user.rollNumber;

        document.getElementById("branch").innerText = user.branch;

        document.getElementById("semester").innerText = user.semester;

        document.getElementById("section").innerText = user.section;

        document.getElementById("academicYear").innerText = user.academicYear;

    }

    catch(error){

        alert(error.message);

    }

}

loadProfile();

document.getElementById("editBtn").addEventListener("click", enableEdit);

function enableEdit(){

    if(editMode) return;

    editMode=true;

    const fullName=document.getElementById("fullName");

    const email=document.getElementById("email");

    fullName.innerHTML=`
        <input
        id="newFullName"
        value="${fullName.innerText}">
    `;

    email.innerHTML=`
        <input
        id="newEmail"
        value="${email.innerText}">
    `;

    document.getElementById("saveBtn").style.display="inline-block";

}

document.getElementById("saveBtn").addEventListener("click", saveProfile);

async function saveProfile(){

    try{

        const fullName=
        document.getElementById("newFullName").value;

        const email=
        document.getElementById("newEmail").value;

        await updateProfile({

            fullName,

            email

        });

        alert("Profile Updated Successfully");

        location.reload();

    }

    catch(error){

        alert(error.message);

    }

}