/* ============================================================
   TOAST NOTIFICATION UTILITY — AttendEase
   Include this BEFORE other page scripts.
   ============================================================ */

(function () {
    // Create container once
    function getContainer() {
        let c = document.getElementById("toast-container");
        if (!c) {
            c = document.createElement("div");
            c.id = "toast-container";
            document.body.appendChild(c);
        }
        return c;
    }

    const ICONS = {
        success: "✅",
        error:   "❌",
        warning: "⚠️",
        info:    "ℹ️"
    };

    const TITLES = {
        success: "Success",
        error:   "Error",
        warning: "Warning",
        info:    "Info"
    };

    /**
     * Show a toast notification.
     * @param {"success"|"error"|"warning"|"info"} type
     * @param {string} message
     * @param {number} [duration=4000] ms before auto-dismiss
     */
    window.showToast = function (type, message, duration) {
        duration = duration || 4000;
        const container = getContainer();

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${ICONS[type] || "ℹ️"}</span>
            <div class="toast-body">
                <div class="toast-title">${TITLES[type] || type}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">✕</button>
            <div class="toast-progress"></div>
        `;

        // Close button
        toast.querySelector(".toast-close").addEventListener("click", () => dismiss(toast));

        container.appendChild(toast);

        // Auto-dismiss
        const timer = setTimeout(() => dismiss(toast), duration);
        toast._timer = timer;

        return toast;
    };

    function dismiss(toast) {
        clearTimeout(toast._timer);
        toast.classList.add("removing");
        toast.addEventListener("animationend", () => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, { once: true });
    }
})();
