const token = localStorage.getItem("accessToken");

if(!token){

    window.location.href="login.html";

}

async function loadTimetable(){

    try{

        const timetable =
        await getMyTimetable();

        const schedule =
        timetable.data.schedule;

        const container =
        document.getElementById("timetableContainer");

        container.innerHTML="";

        for(const day in schedule){

            let html=`

            <div class="day-card">

            <h2>

            ${day.toUpperCase()}

            </h2>

            `;

            schedule[day].forEach(cls=>{

                html+=`

                <div class="class-card">

                <h3>

                ${cls.subjectId.subjectName}

                </h3>

                <p>

                ${cls.startTime}
                -
                ${cls.endTime}

                </p>

                <p>

                Room :
                ${cls.room}

                </p>

                <p>

                Teacher :
                ${cls.teacher}

                </p>

                <p>

                ${cls.classType}

                </p>

                </div>

                `;

            });

            html+=`</div>`;

            container.innerHTML+=html;

        }

    }

    catch(error){

        alert(error.message);

    }

}

loadTimetable();