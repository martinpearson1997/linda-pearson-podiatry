// ============================================
// LINDA PEARSON PODIATRY - script.js
// Complete consolidated version. Replaces everything.
// ============================================

// ============================================
// 1. CONTACT / BOOKING FORM
// Everything here is wrapped in a check that the form
// exists, so the rest of the file still runs on pages
// that don't have one.
// ============================================

const form = document.getElementById("contact-form");

if (form) {

    const enquiryField = document.getElementById("enquiry");
    const treatmentField = document.getElementById("treatment");
    const treatmentWrapper = document.getElementById("treatment-field");
    const nameField = document.getElementById("name");
    const phoneField = document.getElementById("phone");
    const messageField = document.getElementById("message");
    const status = document.getElementById("form-status");

    // --- Show the treatment dropdown only for booking requests ---

    function updateTreatmentVisibility() {
        if (!treatmentWrapper || !enquiryField) return;
        const isBooking = enquiryField.value === "Booking request";
        treatmentWrapper.hidden = !isBooking;
        // If they switch away from booking, clear the treatment so a
        // stale value isn't submitted with a general question.
        if (!isBooking && treatmentField) treatmentField.value = "";
    }

    if (enquiryField) {
        enquiryField.addEventListener("change", updateTreatmentVisibility);
    }

    // --- Pre-fill from the address bar ---
    // A link like book.html?enquiry=booking&treatment=Full%20treatment
    // arrives with those values in the URL. URLSearchParams reads them
    // out, and we set the dropdowns to match.

    const params = new URLSearchParams(window.location.search);

    if (params.get("enquiry") === "booking" && enquiryField) {
        enquiryField.value = "Booking request";
    }

    updateTreatmentVisibility(); // run once on load, after any pre-fill

    const wantedTreatment = params.get("treatment");
    if (wantedTreatment && treatmentField) {
        // Only set it if it's genuinely one of our options, so a
        // made-up value in the URL can't inject anything odd.
        const optionExists = Array.from(treatmentField.options)
            .some(function (opt) { return opt.value === wantedTreatment; });
        if (optionExists) treatmentField.value = wantedTreatment;
    }

    // --- Validation and sending ---

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const enquiry = enquiryField ? enquiryField.value : "";
        const name = nameField.value.trim();
        const phone = phoneField.value.trim();

        if (enquiryField && enquiry === "") {
            showStatus("Please choose what we can help with.", "error");
            enquiryField.focus();
            return;
        }

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
            showStatus("That phone number doesn't look right - please check it.", "error");
            phoneField.focus();
            return;
        }

        // Send to Netlify. Only works on the live site - locally there's
        // no Netlify listening, so you'll see the error message instead.
        showStatus("Sending...", "success");

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
        })
        .then(function (response) {
            if (response.ok) {
                showStatus("Thank you - your message has been sent. We'll be in touch soon.", "success");
                form.reset();
                updateTreatmentVisibility(); // hide treatment again after reset
            } else {
                showStatus("Sorry - something went wrong sending that. Please call us instead.", "error");
            }
        })
        .catch(function () {
            showStatus("Sorry - something went wrong sending that. Please call us instead.", "error");
        });
    });

    function showStatus(text, type) {
        status.textContent = text;
        status.className = type;
    }
}

// ============================================
// 2. YEARS OF EXPERIENCE - calculated, never stale
// ============================================

const yearsSpan = document.getElementById("years-experience");
if (yearsSpan) {
    yearsSpan.textContent = new Date().getFullYear() - 1997;
}

// ============================================
// 3. SCROLL-REVEAL - elements fade up into view
// ============================================

const revealItems = document.querySelectorAll(
    ".card, .about-grid, .contact-grid, section h2, .eyebrow, .review-card"
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

// ============================================
// 4. COOKIE CONSENT
// ============================================

const cookieBanner = document.getElementById("cookie-banner");
const CONSENT_KEY = "lpp-cookie-consent";

function loadMap() {
    const holder = document.getElementById("map-embed");
    if (!holder || holder.querySelector("iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.src = holder.dataset.mapSrc;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.title = "Map showing Linda Pearson Podiatry at Abakhan Craft Village";
    iframe.setAttribute("allowfullscreen", "");

    holder.innerHTML = "";
    holder.appendChild(iframe);
}

// Load Google Analytics. Only ever called after the visitor accepts.
function loadAnalytics() {
    if (window.gaLoaded) return;   // never load twice
    window.gaLoaded = true;

    const GA_ID = "G-BS0FVE6W4G";

    // Inject Google's script tag into the page
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);

    // Google's standard initialisation snippet
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", GA_ID);
}

function setConsent(choice) {
    localStorage.setItem(CONSENT_KEY, choice);
    if (cookieBanner) cookieBanner.hidden = true;
    if (choice === "accepted") {
        loadMap();
        loadAnalytics();
    }
}

const savedConsent = localStorage.getItem(CONSENT_KEY);

if (savedConsent === "accepted") {
    loadMap();
    loadAnalytics();
} else if (savedConsent !== "declined" && cookieBanner) {
    cookieBanner.hidden = false;
}

const savedConsent = localStorage.getItem(CONSENT_KEY);

if (savedConsent === "accepted") {
    loadMap();
} else if (savedConsent !== "declined" && cookieBanner) {
    cookieBanner.hidden = false;
}

const acceptBtn = document.getElementById("cookie-accept");
const declineBtn = document.getElementById("cookie-decline");

if (acceptBtn) acceptBtn.addEventListener("click", function () { setConsent("accepted"); });
if (declineBtn) declineBtn.addEventListener("click", function () { setConsent("declined"); });

const settingsLink = document.getElementById("cookie-settings-link");
if (settingsLink) {
    settingsLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem(CONSENT_KEY);
        if (cookieBanner) cookieBanner.hidden = false;
    });
}
