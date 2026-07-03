const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "login.html";
}
const user = JSON.parse(localStorage.getItem("user"));


// Greeting

const hour = new Date().getHours();

const greeting = document.getElementById("greeting");

if(hour<12){

    greeting.innerText="Good Morning 👋";

}

else if(hour<18){

    greeting.innerText="Good Afternoon 👋";

}

else{

    greeting.innerText="Good Evening 👋";

}

//load profile data
async function loadProfile(){
    try{
        const profile=await getprofile();
      document.getElementById("studentName").innerText =
    profile.user.fullName;
    }
    catch(error){
        alert(error.message);
    }
}

// Load Attendance
// =============================

async function loadAttendance() {

    try {

        const report = await getAttendanceReport();

        document.getElementById("overallAttendance").innerText =
            report.overallAttendance + "%";

    }

    catch (error) {

        console.log(error);

    }

}

// =============================
// Today's Timetable
// =============================

async function loadTodayClasses() {

    try {

        const timetable = await getTodayTimetable();
if(timetable.holiday){

    document.getElementById("todayClasses").innerHTML=

    `<div class="class-card">

        <h2>${timetable.message}</h2>

        <p>No classes today. Have fun!</p>

    </div>`;

    return;

}
        const container =
            document.getElementById("todayClasses");

        container.innerHTML = "";


if (timetable.classes.length === 0) {

    container.innerHTML = `
        <div class="class-card">
            <h3>No Classes Today</h3>
            <p> HAVE FUN IETIANS 🎉</p>
        </div>
    `;

    document.getElementById("todayClassCount").innerText = "0";

    return;

} 
        document.getElementById("todayClassCount")
            .innerText = timetable.classes.length;

        timetable.classes.forEach(cls => {

            container.innerHTML += `

                <div class="class-card">

                    <h3>${cls.subjectId.subjectName}</h3>

                    <p>

                        ${cls.startTime} - ${cls.endTime}

                    </p>

                    <p>

                        Room : ${cls.room}

                    </p>

                    <button
                        onclick="markClassAttendance('${cls._id}')">

                        Present

                    </button>

                </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

async function markClassAttendance(classId, button) {

    try {

        await markAttendance(classId);

        button.innerText = "✔ Present";

        button.disabled = true;

    }

    catch (error) {

        alert(error.message);

    }

}

loadProfile();
loadAttendance();
loadTodayClasses();

// ===========================
// Quick Actions
// ===========================

document.getElementById("attendanceBtn").addEventListener("click", () => {

    window.location.href = "attendance.html";

});

document.getElementById("predictionBtn").addEventListener("click", () => {

    window.location.href = "prediction.html";

});

document.getElementById("timetableBtn").addEventListener("click", () => {

    window.location.href = "timetable.html";

});

document.getElementById("profileBtn").addEventListener("click", () => {

    window.location.href = "profile.html";

});


// ===========================
// Logout
// ===========================

document.getElementById("logoutBtn").addEventListener("click", async () => {

    try {

        await logoutUser();

    } catch (error) {

        console.log(error);

    }

    localStorage.clear();

    window.location.href = "login.html";

});
