const token = localStorage.getItem("accessToken");

if(!token){

    window.location.href="login.html";

}

async function loadAttendance(){

    try{

        const report = await getAttendanceReport();

        document.getElementById("overallAttendance").innerText =
            report.overallAttendance + "%";

        const table =
        document.getElementById("attendanceTable");

        table.innerHTML="";

        report.subjects.forEach(subject=>{

            table.innerHTML+=`

            <tr>

            <td>${subject.subjectName}</td>

            <td>${subject.present}</td>

            <td>${subject.absent}</td>

            <td>${subject.total}</td>

            <td>${subject.percentage}%</td>

            </tr>

            `;

        });

    }

    catch(error){

        alert(error.message);

    }

}

loadAttendance();