// ============================================
// CONTACT FORM VALIDATION
// ============================================

// Grab the elements we need and store them in variables.
// document.getElementById("...") finds the HTML element with that id —
// this is "the DOM": your HTML, as objects JavaScript can read and change.
const form = document.getElementById("contact-form");
const nameField = document.getElementById("name");
const phoneField = document.getElementById("phone");
const messageField = document.getElementById("message");
const status = document.getElementById("form-status");

// "Listen" for the form's submit event — fires when the button
// is pressed OR when someone hits Enter in a field.
form.addEventListener("submit", function (event) {

    // Stop the browser doing its default submit (which reloads
    // the page). WE decide what happens instead.
    event.preventDefault();

    // Collect the values. .trim() removes spaces from both ends,
    // so "   " doesn't count as a filled-in name.
    const name = nameField.value.trim();
    const phone = phoneField.value.trim();
    const message = messageField.value.trim();

    // Check each field, simplest first. "return" stops the
    // function immediately — no point checking further.
    if (name === "") {
        showStatus("Please enter your name.", "error");
        nameField.focus(); // put the cursor in the offending field
        return;
    }

    if (phone === "") {
        showStatus("Please enter a phone number so we can call you back.", "error");
        phoneField.focus();
        return;
    }

    // Sanity-check the phone number: strip spaces, then require
    // 10–15 characters that are digits (with an optional leading +).
    const digits = phone.replace(/\s/g, ""); // remove all spaces
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

    // Everything passed. (Actual sending comes when we launch —
    // for now we confirm and clear the form.)
    showStatus("Thank you — your message has been received. We'll be in touch soon.", "success");
    form.reset(); // empty all the fields
});

// A small helper so we write the status-updating code once, not
// five times. It takes the text and a type ("error" or "success").
function showStatus(text, type) {
    status.textContent = text;
    status.className = type; // sets class="error" or class="success"
}
// ============================================
// YEARS OF EXPERIENCE — calculated, never stale
// ============================================

// new Date().getFullYear() asks the visitor's browser what year
// it is. 2026 - 1997 = 29 today, 30 next year, automatically.
const years = new Date().getFullYear() - 1997;
document.getElementById("years-experience").textContent = years;

// ============================================
// SCROLL-REVEAL — elements fade up as they enter view
// ============================================

// Tag the things we want to animate. Doing it here in JS means
// visitors with JavaScript off simply see everything, un-animated.
const revealItems = document.querySelectorAll(
    ".card, .about-grid, .contact-grid, section h2, .eyebrow"
);

// IntersectionObserver: the browser tells US when an element
// scrolls into view, instead of us constantly checking.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // animate once, then stop watching
            }
        });
    }, { threshold: 0.12 }); // fire when 12% of the element is visible

    revealItems.forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
    });
}
// If the browser is old or the visitor prefers no motion,
// we never add .reveal — everything just shows normally.