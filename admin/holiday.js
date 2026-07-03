
const adminToken = localStorage.getItem("adminToken");

if(!adminToken){

    window.location.href="admin-login.html";

}

const form=document.getElementById("holidayForm");

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const title=document.getElementById("title").value.trim();

    const date=document.getElementById("date").value;

    const description=document.getElementById("description").value.trim();

    const response=await addHoliday({

        title,

        date,

        description

    });

    alert(response.data.message);

    form.reset();

    loadHolidays();

});

async function loadHolidays(){

    const response=await getHolidays();

    const container=document.getElementById("holidayList");

    container.innerHTML="";

    response.data.forEach(holiday=>{

        container.innerHTML+=`

        <div class="holiday-card">

        <h3>

        ${holiday.title}

        </h3>

        <p>

        ${holiday.date.substring(0,10)}

        </p>

        <p>

        ${holiday.description||""}

        </p>

        <button onclick="removeHoliday('${holiday._id}')">

        Delete

        </button>

        </div>

        `;

    });

}

async function removeHoliday(id){

    if(!confirm("Delete this holiday?")) return;

    await deleteHoliday(id);

    loadHolidays();

}

loadHolidays();