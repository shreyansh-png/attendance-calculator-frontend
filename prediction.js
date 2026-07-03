const token = localStorage.getItem("accessToken");

if(!token){

    window.location.href="login.html";

}

async function loadPrediction(){

    try{

        const prediction = await getAttendancePrediction();

        const container =
        document.getElementById("predictionContainer");

        container.innerHTML="";

        prediction.data.forEach(subject=>{

            let message="";

            let className="";

            if(subject.attendance>=75){

                className="good";

                message=
                `✅ You can miss ${subject.canMiss} classes`;

            }

            else{

                className="bad";

                message=
                `❌ Attend next ${subject.needToAttend} classes`;

            }

            container.innerHTML+=`

            <div class="prediction-card">

            <h2>${subject.subjectName}</h2>

            <p>

            Attendance :
            ${subject.attendance}%

            </p>

            <p class="${className}">

            ${message}

            </p>

            </div>

            `;

        });

    }

    catch(error){

        alert(error.message);

    }

}

loadPrediction();