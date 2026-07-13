// timetable.js — Weekly timetable page

// Auth guard
const token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "login.html";
}

// ─────────────────────────────────────────────
// Funny day-specific comments for IETians 😄
// ─────────────────────────────────────────────
const DAY_VIBES = {
    monday:    "😭 Monday again... the WiFi at home was better. RIP weekend.",
    tuesday:   "😤 Tuesday — the Monday of the week's second chance. Still recovering.",
    wednesday: "🐫 Hump day! You're halfway through the suffering. Hang in there, IETian!",
    thursday:  "🤏 Almost there! Friday is so close you can almost taste the freedom.",
    friday:    "🥳 FRIDAY! Last lecture of the week — try to stay awake for at least 10 minutes.",
    saturday:  "😱 Saturday class?! Someone in admin clearly hates us all equally.",
    sunday:    "😴 Sunday? No class today! Sleep well, eat a lot, and pretend assignments don't exist. 🛏️"
};

// ─────────────────────────────────────────────
// Load Timetable
// ─────────────────────────────────────────────
async function loadTimetable() {

    const container = document.getElementById("timetableContainer");

    try {

        const response      = await getMyTimetable();
        const timetableData = response.data || response;
        const schedule      = timetableData.schedule || timetableData;

        // Clear skeleton
        container.innerHTML = "";

        const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const days     = dayOrder.filter(d => schedule[d] !== undefined);

        if (days.length === 0) {

            // fallback to whatever keys exist
            const anyDays = Object.keys(schedule);
            if (anyDays.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center;padding:60px 20px;background:var(--color-card);border:1px solid var(--color-border);border-radius:16px;box-shadow:var(--shadow-md);">
                        <div style="margin-bottom:16px;color:var(--color-text-muted);display:flex;justify-content:center;"><i data-lucide="inbox" style="width:48px;height:48px;"></i></div>
                        <h3 style="color:var(--color-text);">No Timetable Found</h3>
                        <p style="color:var(--color-text-secondary);margin-top:8px;">Either you're incredibly lucky or the admin forgot. Either way — enjoy!</p>
                    </div>`;
                if (window.lucide) window.lucide.createIcons();
                return;
            }
            days.push(...anyDays);
        }

        const renderDays = days.length ? days : Object.keys(schedule);

        for (const day of renderDays) {

            const classes  = schedule[day] || [];
            const vibe     = DAY_VIBES[day.toLowerCase()] || "Another day, another lecture. You've got this! 💪";

            const dayCard  = document.createElement("div");
            dayCard.className = "day-card";

            // Header
            dayCard.innerHTML = `
                <div class="day-header">
                    <span class="day-name">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    <span class="day-vibe">${vibe}</span>
                </div>
                <div class="day-classes" id="classes-${day}"></div>
            `;

            container.appendChild(dayCard);

            const classesDiv = dayCard.querySelector(`#classes-${day}`);

            if (!classes || classes.length === 0) {

                classesDiv.innerHTML = `
                    <div class="no-classes">
                        <i data-lucide="coffee" style="width:32px;height:32px;color:var(--color-primary);"></i>
                        <p style="margin-top:6px;">No classes — it's a free slot! Go touch some grass or sleep in the canteen.</p>
                    </div>`;

            } else {

                classes.forEach(cls => {

                    const subjectName = cls.subjectId
                        ? (typeof cls.subjectId === "object" ? cls.subjectId.subjectName : cls.subjectId)
                        : "Unknown Subject";

                    const isLab     = (cls.classType || "").toLowerCase() === "lab";
                    const badgeCls  = isLab ? "class-type-badge lab" : "class-type-badge";
                    const typeLabel = cls.classType || "Theory";

                    classesDiv.innerHTML += `
                        <div class="class-card">
                            <h3>
                                ${subjectName}
                                <span class="${badgeCls}">${typeLabel}</span>
                            </h3>
                            <div class="class-meta">
                                <span class="class-meta-item"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${cls.startTime} – ${cls.endTime}</span>
                                <span class="class-meta-item"><i data-lucide="map-pin" style="width:14px;height:14px;"></i> Room ${cls.room || "N/A"}</span>
                                ${cls.teacher ? `<span class="class-meta-item"><i data-lucide="user" style="width:14px;height:14px;"></i> ${cls.teacher}</span>` : ""}
                            </div>
                        </div>
                    `;
                });
            }
        }

    } catch (error) {

        container.innerHTML = `
            <div style="text-align:center;padding:40px;background:var(--color-card);border:1px solid var(--color-border);border-radius:16px;">
                <p style="color:var(--danger);"><i data-lucide="alert-triangle" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> ${error.message || "Could not load timetable."}</p>
            </div>`;
        showToast("error", error.message || "Could not load timetable.");
        if (window.lucide) window.lucide.createIcons();
    }
}

loadTimetable().then(() => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
});