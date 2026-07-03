const BASE_URL = "https://attendease-backend-p5ah.onrender.com/api/v1";

// ===========================
// Generic Request Function
// ===========================

async function apiRequest(endpoint, method = "GET", body = null) {

    const token = localStorage.getItem("accessToken");

    const options = {

        method,

        headers: {
            "Content-Type": "application/json"
        }

    };

    if (token) {

        options.headers.Authorization = `Bearer ${token}`;

    }

    if (body) {

        options.body = JSON.stringify(body);

    }

   const response = await fetch(`${BASE_URL}${endpoint}`, options);

   // Auto logout if token expires
if (response.status === 401) {

    localStorage.clear();

    alert("Session expired. Please login again.");

    window.location.href = "login.html";

    return;

}

const data = await response.json();

if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
}

return data;

}


//AUthentication

function loginUser(email, password) {
    return apiRequest("/users/login", "POST", { email, password });
}
function registerUser(userData) {

    return apiRequest("/users/register", "POST", userData);

}

function logoutUser() {

    return apiRequest("/users/logout", "POST");

}

//Profile

function getProfile() {
    return apiRequest("/users/profile", "GET");
}

function updateProfile(userData) {
    return apiRequest("/users/profile", "PATCH", userData);
}

//attendance

function markAttendance(classId) {
    return apiRequest("/attendance/mark", "POST", {
        classId
    });
}
function getAttendanceReport() {

    return apiRequest("/attendance/report");

}

function getAttendancePrediction() {

    return apiRequest("/attendance/prediction");

}

function getAttendanceHistory() {

    return apiRequest("/attendance/history");

}

//timetable
function getTodayTimetable() {

    return apiRequest("/timetable/today");

}

function getMyTimetable() {

    return apiRequest("/timetable/my");

}


async function changePassword(data){

    return await apiRequest(

        "/users/change-password",

        "PATCH",

        data

    );

}

async function adminLogin(adminId, password) {

    return apiRequest(

        "/admin/login",

        "POST",

        {

            adminId,

            password

        }

    );

}


// ===========================
// Holiday APIs
// ===========================

function addHoliday(data){

    return apiRequest(

        "/holiday/add",

        "POST",

        data

    );

}

function getHolidays(){

    return apiRequest(

        "/holiday"

    );

}

function deleteHoliday(id){

    return apiRequest(

        `/holiday/${id}`,

        "DELETE"

    );

}


// ===========================
// Extra Class APIs
// ===========================

function addExtraClass(data){

    return apiRequest(

        "/extra-class/add",

        "POST",

        data

    );

}

function getExtraClasses(){

    return apiRequest(

        "/extra-class"

    );

}

function deleteExtraClass(id){

    return apiRequest(

        `/extra-class/${id}`,

        "DELETE"

    );

}

// ==========================
// Subjects
// ==========================

function getSubjects(){

    return apiRequest("/subjects");

}

function cancelClass(data){

    return apiRequest(

        "/cancel-class",

        "POST",

        data

    );

}

function getCancelledClasses(){

    return apiRequest(

        "/cancel-class"

    );

}

function deleteCancelledClass(id){

    return apiRequest(

        `/cancel-class/${id}`,

        "DELETE"

    );

}