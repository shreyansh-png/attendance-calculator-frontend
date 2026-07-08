const BASE_URL = "https://attendance-calculator-backend-2.onrender.com/api/v1";

// ===========================
// Generic Request Function
// ===========================

async function apiRequest(endpoint, method = "GET", body = null) {

    const isBrowser = typeof window !== "undefined";
    const isAdminPage = isBrowser && window.location.pathname.includes("/admin/");
    const isLoginEndpoint = endpoint === "/users/login" || endpoint === "/admin/login";
    const token = isLoginEndpoint
        ? null
        : isAdminPage
            ? localStorage.getItem("adminToken")
            : localStorage.getItem("accessToken");

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

    // Auto logout only for authenticated requests, not login attempts
    if (response.status === 401 && token) {

        localStorage.clear();

        if (typeof showToast === "function") {
            showToast("warning", "Session expired. Please login again.");
        }

        // Redirect to the correct login page based on context
        setTimeout(() => {
            if (window.location.pathname.includes("/admin/")) {
                window.location.href = "admin-login.html";
            } else {
                window.location.href = "../login.html";
            }
        }, 1500);

        return;

    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;

}


// Authentication

function loginUser(email, password) {
    return apiRequest("/users/login", "POST", { email, password });
}

function registerUser(userData) {

    return apiRequest("/users/register", "POST", userData);

}

function forgotPassword(email, newPassword) {

    return apiRequest("/users/forgot-password", "POST", { email, newPassword });

}

function logoutUser() {

    return apiRequest("/users/logout", "POST");

}

// Profile

function getProfile() {
    return apiRequest("/users/profile", "GET");
}

function updateProfile(userData) {
    return apiRequest("/users/profile", "PATCH", userData);
}

// Attendance

function markAttendance(classId, status = "Present") {
    return apiRequest("/attendance/mark", "POST", {
        classId,
        status
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

// Timetable
function getTodayTimetable() {

    return apiRequest("/timetables/today");

}

function getMyTimetable() {

    return apiRequest("/timetables/my");

}


async function changePassword(data) {

    return await apiRequest(

        "/users/change-password",

        "PATCH",

        data

    );

}

async function adminLogin(adminEmail, password) {

    return apiRequest(

        "/admin/login",

        "POST",

        {

            adminEmail,

            password

        }

    );

}


// ===========================
// Holiday APIs
// ===========================

function addHoliday(data) {

    return apiRequest(

        "/holiday/add",

        "POST",

        data

    );

}

function getHolidays() {

    return apiRequest(

        "/holiday"

    );

}

function deleteHoliday(id) {

    return apiRequest(

        `/holiday/${id}`,

        "DELETE"

    );

}


// ===========================
// Extra Class APIs
// ===========================

function addExtraClass(data) {

    return apiRequest(

        "/extra-classes/add",

        "POST",

        data

    );

}

function getExtraClasses() {

    return apiRequest(

        "/extra-classes"

    );

}

function deleteExtraClass(id) {

    return apiRequest(

        `/extra-classes/${id}`,

        "DELETE"

    );

}

// ==========================
// Subjects
// ==========================

function getSubjects() {

    return apiRequest("/subjects");

}

function cancelClass(data) {

    return apiRequest(

        "/cancelled-classes/add",

        "POST",

        data

    );

}

function getCancelledClasses() {

    return apiRequest(

        "/cancelled-classes"

    );

}

function deleteCancelledClass(id) {

    return apiRequest(

        `/cancelled-classes/${id}`,

        "DELETE"

    );

}

// ==========================
// Dashboard
// ==========================

function getDashboard() {

    return apiRequest("/dashboard");

}