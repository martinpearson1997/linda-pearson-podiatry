// ============================================
// LINDA PEARSON PODIATRY — script.js
// Complete consolidated version. Replaces everything.
// ============================================

// ============================================
// 1. CONTACT FORM — validation + real sending
// ============================================

// Find the elements we need in the page (the DOM)
const form = document.getElementById("contact-form");
const nameField = document.getElementById("name");
const phoneField = document.getElementById("phone");
const messageField = document.getElementById("message");
const status = document.getElementById("form-status");

form.addEventListener("submit", function (event) {

    // Stop the browser's default submit (which reloads the page)
    event.preventDefault();

    const name = nameField.value.trim();
    const phone = phoneField.value.trim();
    const message = messageField.value.trim();

    // --- Validation, simplest checks first ---

    if (name === "") {
        showStatus("Please enter your name.", "error");
        nameField.focus();
        return;
    }

    if (phone === "") {
        showStatus("Please enter a phone number so we can call you back.", "error");
        phoneField.focus();
        return;
    }

    // Strip spaces, then require 10-15 digits (optional leading +)
    const digits = phone.replace(/\s/g, "");
    if (!/^\+?\d{10,15}$/.test(digits)) {
        showStatus("That phone number doesn't look right — please check it.", "error");
        phoneField.focus();
        return;
    }

    if (message === "") {
        showStatus("Please tell us briefly how we can help.", "error");
        messageField.focus();
        return;
    }

    // --- Everything passed: send to Netlify ---
    // fetch() POSTs the form data to our own site, where Netlify's
    // form handler catches and stores it. Only works on the LIVE
    // site — locally there's no Netlify listening, so you'll see
    // the polite error message instead. That's correct behaviour.

    showStatus("Sending…", "success");

    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(function (response) {
        // response.ok is true only for a genuine success (HTTP 200s).
        // Without this check, a failed send could still show "thank you".
        if (response.ok) {
            showStatus("Thank you — your message has been sent. We'll be in touch soon.", "success");
            form.reset();
        } else {
            showStatus("Sorry — something went wrong sending that. Please call us instead.", "error");
        }
    })
    .catch(function () {
        showStatus("Sorry — something went wrong sending that. Please call us instead.", "error");
    });
});

// Small helper so status updates live in one place
function showStatus(text, type) {
    status.textContent = text;
    status.className = type; // "error" or "success" — CSS colours it
}

// ============================================
// 2. YEARS OF EXPERIENCE — calculated, never stale
// ============================================

// Asks the visitor's browser what year it is, so "29 years"
// becomes "30 years" automatically next January.
const yearsSpan = document.getElementById("years-experience");
if (yearsSpan) {
    yearsSpan.textContent = new Date().getFullYear() - 1997;
}

// ============================================
// 3. SCROLL-REVEAL — elements fade up into view
// ============================================

const revealItems = document.querySelectorAll(
    ".card, .about-grid, .contact-grid, section h2, .eyebrow"
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // animate once, then stop
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
    });
}
// Older browsers / reduced-motion users: .reveal is never added,
// so everything simply shows normally.
