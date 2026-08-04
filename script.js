/* ==========================================================================
   PORTFOLIO — SHARED JAVASCRIPT
   Handles: active nav link highlighting, contact form submission,
   success toast, and (optional) email notification via EmailJS.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ------------------------------------------------------------------
       1) ACTIVE NAV LINK
       Highlights the current page's link in the navbar automatically.
    ------------------------------------------------------------------ */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navbar-gold .nav-link, .navbar-gold .dropdown-item").forEach(function (link) {
        const href = link.getAttribute("href");
        if (href && href === currentPage) {
            link.classList.add("active");
            // if it's inside a dropdown, also mark the parent "About" toggle active
            const dropdownParent = link.closest(".dropdown");
            if (dropdownParent) {
                const toggle = dropdownParent.querySelector(".dropdown-toggle");
                if (toggle) toggle.classList.add("active");
            }
        }
    });

    /* ------------------------------------------------------------------
       2) CONTACT FORM SUBMISSION
       Shows an instant "successfully submitted" confirmation message
       and (if configured) sends an email notification via EmailJS.
  
       ----------------------------------------------------------------
       HOW TO RECEIVE A REAL EMAIL NOTIFICATION ON SUBMIT:
       Plain HTML/CSS/JS cannot send emails by itself (there is no
       server). The easiest free way to make the "email notification"
       part actually work is EmailJS (https://www.emailjs.com):
  
         1. Create a free account at emailjs.com
         2. Add an Email Service (e.g. connect your Gmail)
         3. Create an Email Template with fields: {{from_name}},
            {{from_phone}}, {{from_email}}, {{message}}
         4. Copy your Public Key, Service ID and Template ID
         5. Paste them into the CONFIG block below
         6. Uncomment the emailjs <script> tag in contact.html (already
            included, just add your Public Key where marked)
  
       Until this is configured, the form will still show the on-page
       "successfully submitted" confirmation, but no email will be sent.
    ------------------------------------------------------------------ */

    const EMAILJS_CONFIG = {
        enabled: true,                 // set to true once you've added your keys below
        publicKey: "vmaVw_osYA_6JViwH",
        serviceId: "service_ax5v1g9",
        templateId: "template_2xwfrrg",
    };

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        if (EMAILJS_CONFIG.enabled && window.emailjs) {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        }

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const finishUp = function () {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                contactForm.reset();
                showSuccessToast();
            };

            if (EMAILJS_CONFIG.enabled && window.emailjs) {
                emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, contactForm)
                    .then(finishUp)
                    .catch(function (err) {
                        console.error("EmailJS error:", err);
                        finishUp(); // still show confirmation to keep UX friendly
                    });
            } else {
                // No email service configured yet — just simulate the send.
                setTimeout(finishUp, 600);
            }
        });
    }

    function showSuccessToast() {
        const toast = document.getElementById("formSuccessToast");
        if (!toast) return;
        toast.classList.add("show");
        setTimeout(function () {
            toast.classList.remove("show");
        }, 4200);
    }

    /* ------------------------------------------------------------------
       3) SKILL BAR ANIMATION (skills page)
    ------------------------------------------------------------------ */
    document.querySelectorAll(".skill-bar-fill").forEach(function (bar) {
        const target = bar.getAttribute("data-width") || "0%";
        requestAnimationFrame(function () {
            bar.style.width = target;
        });
    });

});

// ===============================
// Live Date & Time
// ===============================

function showDateTime() {

    let clock = document.getElementById("clock");

    if (clock) {

        let now = new Date();

        clock.innerHTML = now.toLocaleString();

    }

}

setInterval(showDateTime, 1000);

showDateTime();