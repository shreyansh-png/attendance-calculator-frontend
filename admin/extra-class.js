const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

async function loadSubjects(){

    const response = await getSubjects();

    const select =

    document.getElementById("subjectId");

    select.innerHTML =

    `<option value="">Select Subject</option>`;

    response.data.forEach(subject=>{

        select.innerHTML += `

        <option value="${subject._id}">

        ${subject.subjectCode}

        -

        ${subject.subjectName}

        </option>

        `;

    });

}

loadSubjects();

const form=
document.getElementById("extraClassForm");

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const response=await addExtraClass({

        batch:
        document.getElementById("batch").value,

        branch:
        document.getElementById("branch").value,

        semester:
        document.getElementById("semester").value,

        section:
        document.getElementById("section").value,

        subjectId:
        document.getElementById("subjectId").value,

        teacher:
        document.getElementById("teacher").value,

        room:
        document.getElementById("room").value,

        date:
        document.getElementById("date").value,

        startTime:
        document.getElementById("startTime").value,

        endTime:
        document.getElementById("endTime").value,

        classType:
        document.getElementById("classType").value

    });

    alert(response.data.message);

    form.reset();

    loadExtraClasses();

});

async function loadExtraClasses(){

    const response=
    await getExtraClasses();

    const container=
    document.getElementById("extraClassList");

    container.innerHTML="";

    response.data.forEach(extra=>{

        container.innerHTML+=`

        <div class="holiday-card">

        <h3>

        ${extra.subjectId.subjectName}

        </h3>

        <p>

        ${extra.date.substring(0,10)}

        </p>

        <p>

        ${extra.startTime}

        -

        ${extra.endTime}

        </p>

        <button
        onclick="removeExtraClass('${extra._id}')">

        Delete

        </button>

        </div>

        `;

    });

}

async function removeExtraClass(id){

    if(!confirm("Delete Extra Class?"))

    return;

    await deleteExtraClass(id);

    loadExtraClasses();

}

loadExtraClasses();