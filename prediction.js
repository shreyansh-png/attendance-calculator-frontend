// prediction.js - Attendance prediction page

// Auth guard
const token = localStorage.getItem("accessToken");

if (!token) {

    window.location.href = "login.html";

}

// ─────────────────────────────────────────────
// Prediction Logic
// ─────────────────────────────────────────────
async function loadPrediction() {
    try {
        const report = await getAttendanceReport();
        const container = document.getElementById("predictionContainer");
        container.innerHTML = "";

        const subjects = report.data ? (report.data.subjects || []) : (report.subjects || []);

        if (subjects.length === 0) {
            container.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><p>No prediction data available. Please check your attendance records.</p></div>`;
            return;
        }

        const targetPercentage = 75; // Goal %

        subjects.forEach(subject => {
            let present = parseInt(subject.present) || 0;
            let total = parseInt(subject.total) || 0;
            let currentPct = total === 0 ? 100 : (present / total) * 100;
            
            // Fix rounding errors
            currentPct = Math.round(currentPct * 100) / 100;
            
            let message = "";
            let className = "";
            let badgeIcon = "";

            if (total === 0) {
                className = "pct-good";
                badgeIcon = "check-circle";
                message = `✅ No classes conducted yet. You are safe!`;
            } else if (currentPct >= targetPercentage) {
                // Calculate safe bunks
                // Formula: (Present / (Total + x)) * 100 >= Target -> x = (Present / (Target / 100)) - Total
                let safeBunks = Math.floor((present / (targetPercentage / 100)) - total);
                className = safeBunks > 0 ? "pct-good" : "pct-warning";
                badgeIcon = safeBunks > 0 ? "check-circle" : "alert-circle";
                message = safeBunks > 0 ? `✅ You can safely miss ${safeBunks} more classes and stay above ${targetPercentage}%` : `⚠️ On the edge! Missing the next class will drop you below ${targetPercentage}%`;
            } else {
                // Calculate required classes to attend
                // Formula: (Present + x) / (Total + x) * 100 = Target -> x = (Target * Total - 100 * Present) / (100 - Target)
                let needed = Math.ceil(((targetPercentage / 100) * total - present) / (1 - (targetPercentage / 100)));
                className = "pct-danger";
                badgeIcon = "x-circle";
                message = `❌ You need to attend the next ${needed} classes consecutively to reach ${targetPercentage}%`;
            }

            container.innerHTML += `
                <div class="card prediction-card" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="margin: 0;">${subject.subjectName}</h3>
                        <span class="badge ${className === 'pct-good' ? 'badge-success' : className === 'pct-warning' ? 'badge-warning' : 'badge-danger'}">
                            ${currentPct}%
                        </span>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="width: 100%; height: 8px; background: var(--gray-600); border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
                        <div style="width: ${currentPct}%; height: 100%; background: ${className === 'pct-good' ? 'var(--success)' : className === 'pct-warning' ? 'var(--warning)' : 'var(--danger)'}; transition: width 1s ease-in-out;"></div>
                    </div>

                    <div style="display: flex; gap: 8px; align-items: flex-start;">
                        <i data-lucide="${badgeIcon}" style="color: ${className === 'pct-good' ? 'var(--success)' : className === 'pct-warning' ? 'var(--warning)' : 'var(--danger)'}; width: 20px; height: 20px; flex-shrink: 0;"></i>
                        <p style="margin: 0; color: var(--color-text-secondary); font-size: 14px;">
                            ${message}
                        </p>
                    </div>
                </div>
            `;
        });
        
        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        if (typeof showToast === "function") {
            showToast("error", error.message || "Could not load prediction data.");
        } else {
            alert("Could not load prediction data.");
        }
    }
}

loadPrediction();